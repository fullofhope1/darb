const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// List requests
router.get('/', async (req, res) => {
  try {
    const { category, city, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT r.*, u.name as user_name, u.avatar_url, u.rating as user_rating,
                 c.name_ar as category_name,
                 (SELECT COUNT(*) FROM offers WHERE request_id = r.id) as offer_count
                 FROM requests r
                 JOIN users u ON r.user_id = u.id
                 JOIN categories c ON r.category_id = c.id
                 WHERE r.status = 'open'`;
    const params = [];
    let p = 1;

    if (category) {
      query += ` AND (r.category_id = $${p} OR c.parent_id = $${p})`;
      params.push(category); p++;
    }
    if (city) {
      query += ` AND r.city = $${p}`;
      params.push(city); p++;
    }
    if (search) {
      query += ` AND (r.title ILIKE $${p} OR r.description ILIKE $${p})`;
      params.push(`%${search}%`); p++;
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${p} OFFSET $${p + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// My requests
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, c.name_ar as category_name,
              (SELECT COUNT(*) FROM offers WHERE request_id = r.id) as offer_count
       FROM requests r JOIN categories c ON r.category_id = c.id
       WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single request
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.avatar_url, u.rating as user_rating,
              u.city as user_city, c.name_ar as category_name
       FROM requests r
       JOIN users u ON r.user_id = u.id
       JOIN categories c ON r.category_id = c.id
       WHERE r.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    await pool.query('UPDATE requests SET views = views + 1 WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add request
router.post('/', auth, async (req, res) => {
  try {
    const { category_id, title, description, images, budget_min, budget_max, duration, city } = req.body;
    const result = await pool.query(
      `INSERT INTO requests (user_id, category_id, title, description, images, budget_min, budget_max, duration, city)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.userId, category_id, title, description, JSON.stringify(images || []), budget_min, budget_max, duration, city]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const check = await pool.query('SELECT user_id FROM requests WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (check.rows[0].user_id !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    const { title, description, images, budget_min, budget_max, duration, city, status } = req.body;
    const result = await pool.query(
      `UPDATE requests SET title = COALESCE($1, title), description = COALESCE($2, description),
       images = COALESCE($3, images), budget_min = COALESCE($4, budget_min),
       budget_max = COALESCE($5, budget_max), duration = COALESCE($6, duration),
       city = COALESCE($7, city), status = COALESCE($8, status)
       WHERE id = $9 RETURNING *`,
      [title, description, images ? JSON.stringify(images) : null, budget_min, budget_max, duration, city, status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const check = await pool.query('SELECT user_id FROM requests WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (check.rows[0].user_id !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    await pool.query('DELETE FROM requests WHERE id = $1', [req.params.id]);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
