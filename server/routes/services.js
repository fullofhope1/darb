const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// List services (with search + filters)
router.get('/', async (req, res) => {
  try {
    const { category, city, min_price, max_price, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT s.*, u.name as user_name, u.avatar_url, u.rating as user_rating,
                 c.name_ar as category_name
                 FROM services s
                 JOIN users u ON s.user_id = u.id
                 JOIN categories c ON s.category_id = c.id
                 WHERE s.status = 'active'`;
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND (s.category_id = $${paramIndex} OR c.parent_id = $${paramIndex})`;
      params.push(category);
      paramIndex++;
    }
    if (city) {
      query += ` AND s.city = $${paramIndex}`;
      params.push(city);
      paramIndex++;
    }
    if (min_price) {
      query += ` AND s.price >= $${paramIndex}`;
      params.push(min_price);
      paramIndex++;
    }
    if (max_price) {
      query += ` AND s.price <= $${paramIndex}`;
      params.push(max_price);
      paramIndex++;
    }
    if (search) {
      query += ` AND (s.title ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// My services
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, c.name_ar as category_name
       FROM services s JOIN categories c ON s.category_id = c.id
       WHERE s.user_id = $1 ORDER BY s.created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as user_name, u.avatar_url, u.rating as user_rating,
              u.city as user_city, u.completed_orders, u.id_verified,
              c.name_ar as category_name
       FROM services s
       JOIN users u ON s.user_id = u.id
       JOIN categories c ON s.category_id = c.id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Increment views
    await pool.query('UPDATE services SET views = views + 1 WHERE id = $1', [req.params.id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add service
router.post('/', auth, async (req, res) => {
  try {
    const { category_id, title, description, price, price_type, images, city } = req.body;
    const result = await pool.query(
      `INSERT INTO services (user_id, category_id, title, description, price, price_type, images, city)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.userId, category_id, title, description, price, price_type || 'fixed', JSON.stringify(images || []), city]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update service
router.put('/:id', auth, async (req, res) => {
  try {
    const check = await pool.query('SELECT user_id FROM services WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (check.rows[0].user_id !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    const { title, description, price, price_type, images, city, status } = req.body;
    const result = await pool.query(
      `UPDATE services SET title = COALESCE($1, title), description = COALESCE($2, description),
       price = COALESCE($3, price), price_type = COALESCE($4, price_type),
       images = COALESCE($5, images), city = COALESCE($6, city),
       status = COALESCE($7, status), updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [title, description, price, price_type, images ? JSON.stringify(images) : null, city, status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete service
router.delete('/:id', auth, async (req, res) => {
  try {
    const check = await pool.query('SELECT user_id FROM services WHERE id = $1', [req.params.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (check.rows[0].user_id !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
