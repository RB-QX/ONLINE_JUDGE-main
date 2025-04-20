// backend/utils/userStats.js

const Submission = require('../model/Submission');
const User       = require('../model/User');

/**
 * Recomputes and updates a user's profile statistics:
 *  - solvedCountPerTag: number of accepted solves per tag
 *  - attemptCountPerTag: total attempts per tag
 *  - successRatePerTag: ratio of solved to attempted per tag
 *  - avgDifficulty: average difficulty of accepted solves
 * Marks flags.recsStale = true so that recommendations will be regenerated.
 *
 * @param {mongoose.Types.ObjectId | string} userId
 * @returns {Promise<void>}
 */
async function recomputeProfileStats(userId) {
  // Aggregate submissions to get per-problem data
  const agg = await Submission.aggregate([
    { $match: { userId } },
    { $unwind: '$tags' },
    { $group: {
        _id: { problemId: '$problemId', tag: '$tags' },
        attempts: { $sum: 1 },
        solved:   { $sum: { $cond: [{ $eq: ['$verdict', 'Accepted'] }, 1, 0] } },
        difficulty: { $first: '$difficulty' }
    }},
    { $group: {
        _id: '$_id.tag',
        totalAttempts: { $sum: '$attempts' },
        totalSolved:   { $sum: '$solved' },
        difficulties:  { $push: '$difficulty' }
    }}
  ]);

  const solvedCountPerTag   = {};
  const attemptCountPerTag  = {};
  const successRatePerTag   = {};
  let   difficultySum       = 0;
  let   solvedProblemCount  = 0;

  for (const entry of agg) {
    const tag = entry._id;
    const attempts = entry.totalAttempts;
    const solved   = entry.totalSolved;

    solvedCountPerTag[tag]  = solved;
    attemptCountPerTag[tag] = attempts;
    successRatePerTag[tag]  = attempts > 0 ? solved / attempts : 0;

    // Sum average difficulty for each problem only once
    // We'll approximate by averaging the first difficulty per group
    const avgTagDiff = entry.difficulties.reduce((a, b) => a + b, 0) / entry.difficulties.length;
    difficultySum += avgTagDiff * solved;
    solvedProblemCount += solved;
  }

  const avgDifficulty = solvedProblemCount > 0
    ? difficultySum / solvedProblemCount
    : 0;

  // Update the user document
  await User.findByIdAndUpdate(userId, {
    'profileStats.solvedCountPerTag':  solvedCountPerTag,
    'profileStats.successRatePerTag':  successRatePerTag,
    'profileStats.avgDifficulty':      avgDifficulty,
    'flags.recsStale':                 true,
  });
}

module.exports = {
  recomputeProfileStats,
};
