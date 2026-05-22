const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, city } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone, and password are required' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, phone, password_hash, city)
       VALUES ($1, $2, $3, $4) RETURNING id, name, phone, city, created_at`,
      [name, phone, hashedPassword, city || null]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { userId: user.id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    const result = await pool.query(
      'SELECT id, name, phone, password_hash, role, city, avatar_url, id_verified, rating, completed_orders FROM users WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    delete user.password_hash;
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, phone, role, city, avatar_url, id_verified,
              rating, completed_orders, created_at
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, city } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), city = COALESCE($2, city), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING id, name, phone, role, city, avatar_url, rating, completed_orders`,
      [name, city, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await pool.query('INSERT INTO otp_codes (id, phone, code, expires_at) VALUES ($1, $2, $3, $4)',
      [Math.random().toString(36).slice(2, 10), phone, code, expiresAt]);

    console.log(`\n📱 OTP for ${phone}: ${code}\n`);

    res.json({ message: 'OTP sent', ttl: 300, devCode: code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code required' });

    const result = await pool.query(
      `SELECT * FROM otp_codes WHERE phone = $1 AND code = $2 AND used = 0 AND expires_at > datetime('now') ORDER BY created_at DESC LIMIT 1`,
      [phone, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    await pool.query('UPDATE otp_codes SET used = 1 WHERE id = $1', [result.rows[0].id]);
    await pool.query('UPDATE users SET phone_verified = 1 WHERE phone = $1', [phone]);

    res.json({ message: 'Phone verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
