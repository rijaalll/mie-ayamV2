const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/firebase');

// POST /transaction/add
router.post('/add', async (req, res) => {
  try {
    const {
      cust_name,
      order_total,
      order_menu
    } = req.body;

    if (!cust_name || !order_total || !order_menu || !Array.isArray(order_menu)) {
      return res.status(400).json({ 
        message: 'All fields are required (cust_name, order_total, order_menu as array)' 
      });
    }

    // Validasi format order_menu
    for (const item of order_menu) {
      if (!item.nama || !item.harga || !item.jumlah || !item.menu_img) {
        return res.status(400).json({ 
          message: 'Each order_menu item must have: nama, harga, jumlah, menu_img' 
        });
      }
    }

    // Tanggal dan waktu otomatis
    const now = new Date();
    const trans_day = now.getDate().toString().padStart(2, '0');
    const trans_month = (now.getMonth() + 1).toString().padStart(2, '0');
    const trans_year = now.getFullYear().toString();
    const trans_hour = now.getHours().toString().padStart(2, '0');
    const trans_minute = now.getMinutes().toString().padStart(2, '0');
    const trans_second = now.getSeconds().toString().padStart(2, '0');

    // Generate Firebase key first, then create custom ID
    const transactionRef = db.ref('mie-hoog/transaction').push();
    const firebaseKey = transactionRef.key;
    const customId = `TXN-${firebaseKey}-${cust_name}`;

    const newTransaction = {
      id: customId,
      cust_name,
      trans_day,
      trans_month,
      trans_year,
      trans_hour,
      trans_minute,
      trans_second,
      order_total,
      order_menu,
      createdAt: Date.now()
    };

    await transactionRef.set(newTransaction);

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: newTransaction
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET all transactions
router.get('/all', async (req, res) => {
  try {
    const snapshot = await db.ref('mie-hoog/transaction').once('value');
    const transactions = [];
    snapshot.forEach(child => {
      transactions.push(child.val());
    });

    res.status(200).json({ status: "OK", transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET transaction by ID
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await db.ref('mie-hoog/transaction').orderByChild('id').equalTo(id).once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    let transaction = null;
    snapshot.forEach(child => {
      transaction = child.val();
    });

    res.status(200).json(transaction);
  } catch (err) {
    console.error('Error fetching transaction by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET transactions by customer name
router.get('/customer/:cust_name', async (req, res) => {
  try {
    const { cust_name } = req.params;
    const snapshot = await db.ref('mie-hoog/transaction').orderByChild('cust_name').equalTo(cust_name).once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'No transactions found for this customer' });
    }

    const transactions = [];
    snapshot.forEach(child => {
      transactions.push(child.val());
    });

    res.status(200).json({ status: "OK", transactions });
  } catch (err) {
    console.error('Error fetching transactions by customer name:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET transactions by specific date: /date/29-05-2025
router.get('/date/:day-:month-:year', async (req, res) => {
  try {
    const { day, month, year } = req.params;

    const snapshot = await db.ref('mie-hoog/transaction').once('value');

    const matchedTransactions = [];
    snapshot.forEach(child => {
      const transaction = child.val();
      if (
        transaction.trans_day === day &&
        transaction.trans_month === month &&
        transaction.trans_year === year
      ) {
        matchedTransactions.push(transaction);
      }
    });

    if (matchedTransactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this date' });
    }

    res.status(200).json({
      status: "OK",
      date: `${day}-${month}-${year}`,
      transactions: matchedTransactions
    });
  } catch (err) {
    console.error('Error fetching transactions by date:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE transaction by ID
router.post('/delete', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }

    const snapshot = await db.ref('mie-hoog/transaction').orderByChild('id').equalTo(id).once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    let key;
    snapshot.forEach(child => {
      key = child.key;
    });

    await db.ref(`mie-hoog/transaction/${key}`).remove();

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;