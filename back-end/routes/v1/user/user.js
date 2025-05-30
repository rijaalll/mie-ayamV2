const express = require('express');
const router = express.Router();
const { db } = require('../../../utils/firebase');

// POST /users/add
router.post('/add', async (req, res) => {
  try {
    const { name, username, password, level } = req.body;
    const userLevel = level || 'user';

    if (!name || !username || !password) {
      return res.status(400).json({ message: 'Name, username, and password are required' });
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
      level: userLevel,
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

// POST /user/login
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
      if (child.val().password === password) {
        user = child.val();
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;