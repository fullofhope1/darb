const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { adminAuth } = require('../middleware/auth');

// Get all categories (main + sub)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order, name_ar'
    );
    const categories = result.rows;

    // Organize into parent-child structure
    const parents = categories.filter(c => !c.parent_id);
    const children = categories.filter(c => c.parent_id);

    const tree = parents.map(parent => ({
      ...parent,
      subcategories: children.filter(c => c.parent_id === parent.id),
    }));

    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Add category
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name_ar, name_en, icon, parent_id, sort_order } = req.body;
    const result = await pool.query(
      `INSERT INTO categories (name_ar, name_en, icon, parent_id, sort_order)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name_ar, name_en, icon, parent_id, sort_order]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update category
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name_ar, name_en, icon, is_active } = req.body;
    const result = await pool.query(
      `UPDATE categories SET name_ar = COALESCE($1, name_ar), name_en = COALESCE($2, name_en),
       icon = COALESCE($3, icon), is_active = COALESCE($4, is_active)
       WHERE id = $5 RETURNING *`,
      [name_ar, name_en, icon, is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Delete category
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
