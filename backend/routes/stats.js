// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const Submission = require('../model/Submission');

// GET /stats/dau  -> [{ date: '2025-04-14', count: 123 }, ...]
router.get('/dau', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));

    const pipeline = [
      { $match: { createdAt: { $gte: start } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          users: { $addToSet: '$userId' }
      }},
      { $project: { _id: 0, date: '$_id', count: { $size: '$users' } } },
      { $sort: { date: 1 } },
    ];

    const data = await Submission.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute DAU' });
  }
});

// GET /stats/lang-distribution -> [{ name: 'Python', value: 34 }, ...]
router.get('/lang-distribution', async (req, res) => {
  try {
    const pipeline = [
      { $group: { _id: '$language', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } },
    ];
    const data = await Submission.aggregate(pipeline);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute language distribution' });
  }
});

module.exports = router;