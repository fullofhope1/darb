const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Unified search (services + requests)
router.get('/', async (req, res) => {
  try {
    const { q, category, city, type, page = 1, limit = 20 } = req.query;

    const results = { services: [], requests: [] };

    // Search services
    if (!type || type === 'services') {
      let sQuery = `SELECT s.id, s.title, s.description, s.price, s.images, s.city, s.created_at,
                    u.name as user_name, u.rating, c.name_ar as category_name, 'service' as type
                    FROM services s JOIN users u ON s.user_id = u.id
                    JOIN categories c ON s.category_id = c.id WHERE s.status = 'active'`;
      const sParams = [];
      let p = 1;

      if (q) { sQuery += ` AND (s.title ILIKE $${p} OR s.description ILIKE $${p})`; sParams.push(`%${q}%`); p++; }
      if (category) { sQuery += ` AND s.category_id = $${p}`; sParams.push(category); p++; }
      if (city) { sQuery += ` AND s.city = $${p}`; sParams.push(city); p++; }

      sQuery += ` ORDER BY s.created_at DESC LIMIT $${p} OFFSET $${p + 1}`;
      sParams.push(limit, (page - 1) * limit);
      const svc = await pool.query(sQuery, sParams);
      results.services = svc.rows;
    }

    // Search requests
    if (!type || type === 'requests') {
      let rQuery = `SELECT r.id, r.title, r.description, r.budget_min, r.budget_max, r.city, r.created_at,
                    u.name as user_name, c.name_ar as category_name, 'request' as type,
                    (SELECT COUNT(*) FROM offers WHERE request_id = r.id) as offer_count
                    FROM requests r JOIN users u ON r.user_id = u.id
                    JOIN categories c ON r.category_id = c.id WHERE r.status = 'open'`;
      const rParams = [];
      let p = 1;

      if (q) { rQuery += ` AND (r.title ILIKE $${p} OR r.description ILIKE $${p})`; rParams.push(`%${q}%`); p++; }
      if (category) { rQuery += ` AND r.category_id = $${p}`; rParams.push(category); p++; }
      if (city) { rQuery += ` AND r.city = $${p}`; rParams.push(city); p++; }

      rQuery += ` ORDER BY r.created_at DESC LIMIT $${p} OFFSET $${p + 1}`;
      rParams.push(limit, (page - 1) * limit);
      const reqs = await pool.query(rQuery, rParams);
      results.requests = reqs.rows;
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
