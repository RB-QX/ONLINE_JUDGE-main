// backend/routes/activity.js
const express = require('express');
const router = express.Router();
const Activity = require('../model/Activity');

// GET /activity/recent -> [{ id, user, action, time }, ...]
router.get('/recent', async (req, res) => {
  try {
    const items = await Activity.find()
      .sort({ time: -1 })
      .limit(20)
      .lean();
    const data = items.map(a => ({
      id:    a._id,
      user:  a.user,
      action:a.action,
      time:  a.time.toISOString(),
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

module.exports = router;