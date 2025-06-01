const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/firebase');
const axios = require('axios');
const FormData = require('form-data');

// Generate unique menu_id
const getNextMenuId = async () => {
  const menuRef = db.ref('mie-hoog/menu');
  const snapshot = await menuRef.once('value');

  let maxNumber = 0;
  snapshot.forEach(categorySnap => {
    categorySnap.forEach(child => {
      const id = child.val().menu_id;
      if (id && id.startsWith('menu_')) {
        const num = parseInt(id.replace('menu_', ''), 10);
        if (num > maxNumber) maxNumber = num;
      }
    });
  });

  const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
  return `menu_${nextNumber}`;
};

// Upload image to external server
const uploadImageToExternal = async (file) => {
  const form = new FormData();
  form.append('images', file.data, file.name);

  const response = await axios.post('http://image.rpnza.my.id/upload', form, {
    headers: form.getHeaders(),
  });

  return response.data.filename;
};

// POST /add
router.post('/add', async (req, res) => {
  try {
    const { menu_name, menu_price, menu_des, user_id, category } = req.body;
    const file = req.files?.file;

    if (!menu_name || !menu_price || !menu_des || !file || !user_id || !category) {
      return res.status(400).json({ message: 'All fields including image file, user_id, and category are required' });
    }

    // Check admin user
    const userSnap = await db.ref(`mie-hoog/user/${user_id}`).once('value');
    const userData = userSnap.val();
    if (!userData || userData.level !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Validate category
    const categorySnap = await db.ref('mie-hoog/category').once('value');
    const categories = categorySnap.val();
    const isValidCategory = Object.values(categories || {}).some(cat => cat.name === category);

    if (!isValidCategory) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Upload image
    const uploadedFileName = await uploadImageToExternal(file);
    const imageUrl = `https://image.rpnza.my.id/get/${uploadedFileName}`;

    // Generate menu ID
    const menu_id = await getNextMenuId();
    const menuRef = db.ref(`mie-hoog/menu/${category}`);
    const newMenuRef = menuRef.push();

    const newMenu = {
      id: newMenuRef.key,
      menu_id,
      menu_name,
      menu_price,
      menu_des,
      menu_img: imageUrl,
      category,
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
    snapshot.forEach(categorySnap => {
      categorySnap.forEach(menuSnap => {
        all_menu.push(menuSnap.val());
      });
    });

    res.status(200).json({ status: "OK", all_menu });
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
    const snapshot = await menuRef.once('value');

    let foundMenu = null;

    snapshot.forEach(categorySnap => {
      categorySnap.forEach(menuSnap => {
        const menu = menuSnap.val();
        if (menu.menu_id === id) {
          foundMenu = menu;
        }
      });
    });

    if (!foundMenu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.status(200).json(foundMenu);
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

    const userSnap = await db.ref(`mie-hoog/user/${user_id}`).once('value');
    const userData = userSnap.val();

    if (!userData || userData.level !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const menuRef = db.ref('mie-hoog/menu');
    const snapshot = await menuRef.once('value');

    let targetPath = null;

    snapshot.forEach(categorySnap => {
      categorySnap.forEach(menuSnap => {
        if (menuSnap.val().id === id) {
          targetPath = `mie-hoog/menu/${categorySnap.key}/${menuSnap.key}`;
        }
      });
    });

    if (!targetPath) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    await db.ref(targetPath).remove();
    res.status(200).json({ message: 'Menu deleted successfully' });

  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /update
router.post('/update', async (req, res) => {
  try {
    const { id, menu_name, menu_price, menu_des, user_id } = req.body;
    const file = req.files?.file;

    if (!id || !user_id) {
      return res.status(400).json({ message: 'Menu id and user_id are required' });
    }

    const userSnap = await db.ref(`mie-hoog/user/${user_id}`).once('value');
    const userData = userSnap.val();
    if (!userData || userData.level !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const menuRef = db.ref('mie-hoog/menu');
    const snapshot = await menuRef.once('value');

    let targetPath = null;

    snapshot.forEach(categorySnap => {
      categorySnap.forEach(menuSnap => {
        if (menuSnap.val().id === id) {
          targetPath = `mie-hoog/menu/${categorySnap.key}/${menuSnap.key}`;
        }
      });
    });

    if (!targetPath) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const updates = {};
    if (menu_name) updates.menu_name = menu_name;
    if (menu_price) updates.menu_price = menu_price;
    if (menu_des) updates.menu_des = menu_des;

    if (file) {
      const uploadedFileName = await uploadImageToExternal(file);
      const imageUrl = `https://image.rpnza.my.id/get/${uploadedFileName}`;
      updates.menu_img = imageUrl;
    }

    await db.ref(targetPath).update(updates);
    res.status(200).json({ message: 'Menu updated successfully' });

  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
