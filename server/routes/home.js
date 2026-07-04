const express = require('express');
const router = express.Router();
const HomeContent = require('../models/HomeContent');
const { protect } = require('../middleware/auth');

// GET /api/home
router.get('/', async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) content = await HomeContent.create({});
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/home
router.put('/', protect, async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) content = new HomeContent();
    Object.assign(content, req.body);
    const updated = await content.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/home/view
router.post('/view', async (req, res) => {
  try {
    const content = await HomeContent.findOneAndUpdate(
      {}, { $inc: { portfolioViews: 1 } }, { new: true, upsert: true }
    );
    res.json({ portfolioViews: content.portfolioViews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
