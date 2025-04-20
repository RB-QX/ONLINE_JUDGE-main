// backend/routes/recommendation.js

const express = require('express');
const router = express.Router();
const Recommendation = require('../model/Recommendation');
const auth = require('../middlewares/auth'); // your JWT/auth middleware

/**
 * @route   GET /api/recommendations
 * @desc    Fetch all recommendation categories for the logged-in user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    // Look up the user's Recommendation doc
    let recs = await Recommendation.findOne({ userId: req.user.id })
      .lean()
      // Populate problem details
      .populate({
        path: 'problems.itemId',
        select: 'title difficulty tags'
      })
      // Populate contest details
      .populate({
        path: 'contests.itemId',
        select: 'name startDate endDate format organizer'
      })
      // Populate peer user details
      .populate({
        path: 'peers.itemId',
        select: 'username rating solvedCountPerTag'
      });
    
    // If none found, return empty arrays
    if (!recs) {
      return res.json({
        problems: [],
        contests: [],
        peers: [],
        tags: []
      });
    }

    // Return the document (tags are simple fields, no populate needed)
    return res.json(recs);
  } catch (err) {
    console.error('Error in GET /api/recommendations:', err);
    return res.status(500).json({ message: 'Server error while fetching recommendations.' });
  }
});

module.exports = router;
