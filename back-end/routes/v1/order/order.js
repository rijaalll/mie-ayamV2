const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/firebase');


router.get('/all', async (req, res) => {
    try {
      const snapshot = await db.ref('mie-hoog/order').once('value');
      const orders = [];
      snapshot.forEach(child => {
        orders.push(child.val());
      });
  
      res.status(200).json({ status: "OK", orders });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// POST /order/add
router.post('/add', async (req, res) => {
  try {
    const {
      user_id,
      table_number,
      order_status,
      order_list
    } = req.body;

    if (!user_id || table_number === undefined || order_status === undefined || !order_list) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Tanggal otomatis
    const today = new Date();
    const order_day = today.getDate().toString().padStart(2, '0');
    const order_month = (today.getMonth() + 1).toString().padStart(2, '0');
    const order_year = today.getFullYear().toString();

    // Ambil data menu dari Firebase
    const menuSnapshot = await db.ref('mie-hoog/menu').once('value');
    const menus = {};
    menuSnapshot.forEach(child => {
      const item = child.val();
      menus[item.id] = parseInt(item.menu_price);
    });

    // Hitung total
    let order_total = 0;
    for (const menuId in order_list) {
      const quantity = parseInt(order_list[menuId]);
      const price = menus[menuId];

      if (price === undefined) {
        return res.status(400).json({ message: `Menu ID ${menuId} not found in database` });
      }

      order_total += price * quantity;
    }

    // Simpan ke Firebase
    const orderRef = db.ref('mie-hoog/order').push();
    const newOrder = {
      id: orderRef.key,
      user_id,
      table_number,
      order_day,
      order_month,
      order_year,
      order_status,
      order_total,
      order_list
    };

    await orderRef.set(newOrder);

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/id/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const snapshot = await db.ref('mie-hoog/order').orderByChild('id').equalTo(id).once('value');
  
      if (!snapshot.exists()) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      let order = null;
      snapshot.forEach(child => {
        order = child.val();
      });
  
      res.status(200).json(order);
    } catch (err) {
      console.error('Error fetching order by ID:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/user/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      const snapshot = await db.ref('mie-hoog/order').orderByChild('user_id').equalTo(user_id).once('value');
  
      if (!snapshot.exists()) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      const orders = [];
      snapshot.forEach(child => {
        orders.push(child.val());
      });
  
      res.status(200).json({ status: "OK", orders });
    } catch (err) {
      console.error('Error fetching orders by user_id:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
});

// GET orders by specific date: /date/29-05-2025
router.get('/date/:day-:month-:year', async (req, res) => {
  try {
    const { day, month, year } = req.params;

    const snapshot = await db.ref('mie-hoog/order').once('value');

    const matchedOrders = [];
    snapshot.forEach(child => {
      const order = child.val();
      if (
        order.order_day === day &&
        order.order_month === month &&
        order.order_year === year
      ) {
        matchedOrders.push(order);
      }
    });

    if (matchedOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this date' });
    }

    res.status(200).json({
      status: "OK",
      date: `${day}-${month}-${year}`,
      orders: matchedOrders
    });
  } catch (err) {
    console.error('Error fetching orders by date:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  
router.post('/update', async (req, res) => {
    try {
      const { id, updates } = req.body;
  
      if (!id || !updates || typeof updates !== 'object') {
        return res.status(400).json({ message: 'Invalid request body' });
      }
  
      const snapshot = await db.ref('mie-hoog/order').orderByChild('id').equalTo(id).once('value');
  
      if (!snapshot.exists()) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      let key;
      snapshot.forEach(child => {
        key = child.key;
      });
  
      await db.ref(`mie-hoog/order/${key}`).update(updates);
  
      res.status(200).json({ message: 'Order updated successfully' });
    } catch (err) {
      console.error('Error updating order:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/delete', async (req, res) => {
    try {
      const { id } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: 'Order ID is required' });
      }
  
      const snapshot = await db.ref('mie-hoog/order').orderByChild('id').equalTo(id).once('value');
  
      if (!snapshot.exists()) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      let key;
      snapshot.forEach(child => {
        key = child.key;
      });
  
      await db.ref(`mie-hoog/order/${key}`).remove();
  
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
      console.error('Error deleting order:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
});  

module.exports = router;
