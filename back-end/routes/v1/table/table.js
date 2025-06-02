const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/firebase');

// GET all tables
router.get('/all', async (req, res) => {
  try {
    const snapshot = await db.ref('mie-hoog/table').once('value');
    const tables = [];
    snapshot.forEach(child => {
      tables.push({ id: child.key, ...child.val() });
    });

    res.status(200).json({ status: "OK", tables });
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET table by ID
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const snapshot = await db.ref(`mie-hoog/table/${id}`).once('value');
  
      if (!snapshot.exists()) {
        return res.status(404).json({ message: 'Table not found' });
      }
  
      res.status(200).json({ id, ...snapshot.val() });
    } catch (err) {
      console.error('Error fetching table:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// POST add new table
router.post('/add', async (req, res) => {
  try {
    const { nomor } = req.body;
    if (!nomor) {
      return res.status(400).json({ message: 'Table number is required' });
    }

    const newTableRef = db.ref('mie-hoog/table').push();
    await newTableRef.set({ nomor });

    res.status(201).json({ status: 'OK', id: newTableRef.key, nomor });
  } catch (err) {
    console.error('Error adding table:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT update table by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nomor } = req.body;

    if (!nomor) {
      return res.status(400).json({ message: 'Table number is required' });
    }

    await db.ref(`mie-hoog/table/${id}`).update({ nomor });

    res.status(200).json({ status: 'OK', message: 'Table updated', id, nomor });
  } catch (err) {
    console.error('Error updating table:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE table by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.ref(`mie-hoog/table/${id}`).remove();

    res.status(200).json({ status: 'OK', message: 'Table deleted' });
  } catch (err) {
    console.error('Error deleting table:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
