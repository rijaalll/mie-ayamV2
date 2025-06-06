const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/firebase');

// POST /users/add - Only admin and kasir levels
router.post('/add', async (req, res) => {
  try {
    const { name, username, password, level } = req.body;

    if (!name || !username || !password || !level) {
      return res.status(400).json({ message: 'Name, username, password, and level are required' });
    }

    // Only allow admin and kasir levels
    if (level !== 'admin' && level !== 'kasir') {
      return res.status(400).json({ message: 'Level must be either "admin" or "kasir"' });
    }

    const usersRef = db.ref('mie-hoog/user');
    const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');

    if (snapshot.exists()) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUserRef = usersRef.push();

    const newUser = {
      id: newUserRef.key,
      name,
      username,
      password,
      level,
      createdAt: Date.now()
    };

    await newUserRef.set(newUser);

    res.status(201).json({ message: 'User added', userId: newUser.id });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /user/get/:id
router.get('/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userRef = db.ref(`mie-hoog/user/${id}`);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = snapshot.val();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET all users (admin and kasir only)
router.get('/all', async (req, res) => {
  try {
    const snapshot = await db.ref('mie-hoog/user').once('value');
    const users = [];
    snapshot.forEach(child => {
      users.push(child.val());
    });

    res.status(200).json({ status: "OK", users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /user/login - Only admin and kasir can login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const usersRef = db.ref('mie-hoog/user');
    const snapshot = await usersRef.orderByChild('username').equalTo(username).once('value');

    if (!snapshot.exists()) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    let user;
    snapshot.forEach(child => {
      const userData = child.val();
      if (userData.password === password) {
        // Only allow admin and kasir to login
        if (userData.level === 'admin' || userData.level === 'kasir') {
          user = userData;
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password, or insufficient privileges' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /user/update
router.post('/update', async (req, res) => {
  try {
    const { id, updates } = req.body;

    if (!id || !updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    // If level is being updated, validate it
    if (updates.level && updates.level !== 'admin' && updates.level !== 'kasir') {
      return res.status(400).json({ message: 'Level must be either "admin" or "kasir"' });
    }

    const userRef = db.ref(`mie-hoog/user/${id}`);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userRef.update(updates);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /user/delete
router.post('/delete', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const userRef = db.ref(`mie-hoog/user/${id}`);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    await userRef.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;