/* ============================================
   PLANORA — Express.js Places Route (MongoDB edition)
   GET  /api/places              → all places
   GET  /api/places?category=... → filtered by category
   GET  /api/places/:id          → single place by numeric id
   ============================================ */

const express = require('express');
const router  = express.Router();
const Place   = require('../models/Place');

// ── Valid categories ──────────────────────────────────────────────────────────
const VALID_CATEGORIES = ['trekking', 'nature', 'accommodation', 'food', 'entertainment'];

// ── GET /api/places ───────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    if (category && category !== 'all') {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
          error: 'Invalid category',
          validCategories: ['all', ...VALID_CATEGORIES],
        });
      }
      const places = await Place.find({ category }).sort({ id: 1 });
      return res.json({ category, count: places.length, places });
    }

    const places = await Place.find().sort({ id: 1 });
    res.json({ category: 'all', count: places.length, places });

  } catch (err) {
    console.error('GET /api/places error:', err);
    res.status(500).json({ error: 'Failed to retrieve places.' });
  }
});

// ── GET /api/places/:id ───────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Place id must be a number.' });
    }

    const place = await Place.findOne({ id });

    if (!place) {
      return res.status(404).json({ error: `Place with id ${id} not found.` });
    }

    res.json(place);

  } catch (err) {
    console.error(`GET /api/places/${req.params.id} error:`, err);
    res.status(500).json({ error: 'Failed to retrieve place.' });
  }
});

module.exports = router;
