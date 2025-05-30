const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { db } = require('../../../utils/firebase');

const uploadDir = path.join(__dirname, '../../../assets/uploads/images');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({ storage });

// Helper to generate menu_id
const getNextMenuId = async () => {
  const menuRef = db.ref('mie-hoog/menu');
  const snapshot = await menuRef.once('value');

  let maxNumber = 0;
  snapshot.forEach(child => {
    const id = child.val().menu_id;
    if (id && id.startsWith('menu_')) {
      const num = parseInt(id.replace('menu_', ''), 10);
      if (num > maxNumber) maxNumber = num;
    }
  });

  const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
  return `menu_${nextNumber}`;
};

// POST /add with image upload
router.post('/add', upload.single('file'), async (req, res) => {
  try {
    const { menu_name, menu_price, menu_des, user_id } = req.body;
    const file = req.file;

    if (!menu_name || !menu_price || !menu_des || !file || !user_id) {
      return res.status(400).json({ message: 'All fields including image file and user_id are required' });
    }

    // Cek admin
    const userSnap = await db.ref(`mie-hoog/user/${user_id}`).once('value');
    const userData = userSnap.val();
    if (!userData || userData.level !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    if (!menu_name || !menu_price || !menu_des || !file) {
      return res.status(400).json({ message: 'All fields including image file are required' });
    }

    const imageUrl = `http://127.0.0.1:3001/api/v1/image/${file.filename}`;
    const menu_id = await getNextMenuId();
    const menuRef = db.ref('mie-hoog/menu');
    const newMenuRef = menuRef.push();

    const newMenu = {
      id: newMenuRef.key,
      menu_id,
      menu_name,
      menu_price,
      menu_des,
      menu_img: imageUrl,
      createdAt: Date.now()
    };

    await newMenuRef.set(newMenu);

    res.status(201).json({ message: 'Menu added successfully', menu: newMenu });
  } catch (error) {
    console.error('Error adding menu with image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /all
router.get('/all', async (req, res) => {
  try {
    const menuRef = db.ref('mie-hoog/menu');
    const snapshot = await menuRef.once('value');

    const all_menu = [];
    snapshot.forEach(child => {
      all_menu.push(child.val());
    });

    res.status(200).json({
      status: "OK",
      all_menu
    });
  } catch (error) {
    console.error('Error fetching all menus:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /menu/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuRef = db.ref('mie-hoog/menu');
    const snapshot = await menuRef.orderByChild('menu_id').equalTo(id).once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    let menu;
    snapshot.forEach(child => {
      menu = child.val();
    });

    res.status(200).json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /delete
router.post('/delete', async (req, res) => {
  try {
    const { id, user_id } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({ message: 'Both menu id and user id are required' });
    }

    // Cek user level di mie-hoog/user/<user_id>
    const userSnap = await db.ref(`mie-hoog/user/${user_id}`).once('value');
    const userData = userSnap.val();

    if (!userData || userData.level !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Cari menu berdasarkan id (key di Firebase, bukan menu_id)
    const menuRef = db.ref('mie-hoog/menu');
    const snapshot = await menuRef.once('value');

    let menuKeyToDelete = null;
    snapshot.forEach(child => {
      if (child.val().id === id) {
        menuKeyToDelete = child.key;
      }
    });

    if (!menuKeyToDelete) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    await menuRef.child(menuKeyToDelete).remove();
    res.status(200).json({ message: 'Menu deleted successfully' });

  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /update
router.post('/update', upload.single('file'), async (req, res) => {
  try {
    const { id, menu_name, menu_price, menu_des, user_id } = req.body;

    if (!id || !user_id) {
      return res.status(400).json({ message: 'Menu id and user_id are required' });
    }

    // Cek admin
    const userSnap = await db.ref(`mie-hoog/user/${user_id}`).once('value');
    const userData = userSnap.val();
    if (!userData || userData.level !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const menuRef = db.ref('mie-hoog/menu');
    const snapshot = await menuRef.once('value');

    let targetKey = null;
    snapshot.forEach(child => {
      if (child.val().id === id) {
        targetKey = child.key;
      }
    });

    if (!targetKey) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const updates = {};
    if (menu_name) updates.menu_name = menu_name;
    if (menu_price) updates.menu_price = menu_price;
    if (menu_des) updates.menu_des = menu_des;

    // Jika upload gambar baru
    if (req.file) {
      const file = req.file;
      const imageUrl = `http://127.0.0.1:3001/api/v1/image/${file.filename}`;
      updates.menu_img = imageUrl;
    }

    await menuRef.child(targetKey).update(updates);

    res.status(200).json({ message: 'Menu updated successfully' });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;