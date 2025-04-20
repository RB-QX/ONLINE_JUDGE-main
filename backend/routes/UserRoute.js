const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const router  = express.Router();
const User    = require('../model/User');
const Activity= require('../model/Activity');
const auth    = require('../middleware/auth');

// POST /register
router.post('/register', async (req, res) => {
  const { username, email, password, role, avatarUrl } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hash, role, avatarUrl });
    await Activity.create({ user: user.username, action: 'Registered' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
       .json({ user: { username, email, role, avatarUrl } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    await Activity.create({ user: user.username, action: 'Logged in' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
       .json({ user: { username: user.username, email: user.email, role: user.role, avatarUrl: user.avatarUrl } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /me
router.get('/me', auth, async (req, res) => {
  const u = req.user;
  res.json({ username: u.username, email: u.email, role: u.role, avatarUrl: u.avatarUrl });
});

// POST /logout
router.post('/logout', auth, (req, res) => {
  res.clearCookie('token').json({ success: true });
});

module.exports = router;
