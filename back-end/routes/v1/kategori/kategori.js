const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/firebase');

// GET all categories
router.get('/all', async (req, res) => {
  try {
    const snapshot = await db.ref('mie-hoog/category').once('value');
    const kategori = [];
    snapshot.forEach(child => {
      kategori.push({ id: child.key, ...child.val() });
    });

    res.status(200).json({ status: "OK", kategori });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST add a new category
router.post('/add', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const newCategoryRef = db.ref('mie-hoog/category').push();
    await newCategoryRef.set({ name });

    res.status(201).json({ status: 'OK', id: newCategoryRef.key, name });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.ref(`mie-hoog/category/${id}`).remove();

    res.status(200).json({ status: 'OK', message: 'Category deleted' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
