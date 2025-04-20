// backend/services/recommendationService.js

const User           = require('../model/User');
const Problem        = require('../model/Problem');
const Contest        = require('../model/ContestProblem');
const Recommendation = require('../model/Recommendation');

//
// Utility functions
//

/**
 * Cosine similarity between two equal-length numerical arrays.
 */
function cosineSimilarity(a = [], b = []) {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Normalize a map of scores to the range [0,1].
 */
function normalizeScores(scoreMap) {
  const values = Object.values(scoreMap);
  if (values.length === 0) return {};
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const normalized = {};
  for (const [key, val] of Object.entries(scoreMap)) {
    normalized[key] = (val - min) / range;
  }
  return normalized;
}

/**
 * Merge two score maps with given weights.
 */
function mergeScores(mapA = {}, mapB = {}, weightA = 0.5, weightB = 0.5) {
  const merged = {};
  const allKeys = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);
  for (const k of allKeys) {
    const a = mapA[k] || 0;
    const b = mapB[k] || 0;
    merged[k] = a * weightA + b * weightB;
  }
  return merged;
}

/**
 * Pick top N entries from a score map, return array of { itemId, score }.
 */
function topN(scoreMap, N = 10) {
  return Object.entries(scoreMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, N)
    .map(([itemId, score]) => ({ itemId, score }));
}

//
// Recommendation computations
//

/**
 * Compute problem recommendations for a user.
 */
async function computeProblemRecs(user) {
  // 1. Content-based: tag affinity + difficulty proximity
  const unsolved = await Problem.find({ _id: { $nin: user.solvedProblems } }).lean();
  const tagWeights   = user.profileStats.solvedCountPerTag || {};
  const avgDiff      = user.profileStats.avgDifficulty || 0;

  const cbScores = {};
  for (const p of unsolved) {
    let tagScore = 0;
    for (const t of p.tags || []) tagScore += (tagWeights[t] || 0);
    const diffScore = 1 - Math.abs(p.difficulty - avgDiff) / 10;
    cbScores[p._id] = tagScore * 0.7 + diffScore * 0.3;
  }
  const normCb = normalizeScores(cbScores);

  // 2. Collaborative filtering (user-based KNN)
  const neighbors = await User.find({ _id: { $ne: user._id } })
    .select('solvedProblems')
    .lean();

  // Pre-build binary vectors keyed by problem ID
  const userSolvedSet = new Set(user.solvedProblems.map(String));

  // Compute similarities
  const sims = [];
  for (const n of neighbors) {
    const nSolvedSet = new Set((n.solvedProblems || []).map(String));
    const intersection = [...userSolvedSet].filter(x => nSolvedSet.has(x));
    const sim = intersection.length /
      Math.sqrt(userSolvedSet.size * nSolvedSet.size || 1);
    if (sim > 0.2) sims.push({ userId: n._id, sim });
  }
  sims.sort((a, b) => b.sim - a.sim);
  const topNeighbors = sims.slice(0, 25);

  // Aggregate neighbor solves
  const cfScores = {};
  for (const { userId, sim } of topNeighbors) {
    const n = neighbors.find(x => x._id.equals(userId));
    for (const pid of (n.solvedProblems || []).map(String)) {
      if (!userSolvedSet.has(pid)) {
        cfScores[pid] = (cfScores[pid] || 0) + sim;
      }
    }
  }
  const normCf = normalizeScores(cfScores);

  // 3. Merge and pick top
  const merged = mergeScores(normCb, normCf, 0.5, 0.5);
  return topN(merged, 10);
}

/**
 * Compute contest recommendations for a user.
 */
async function computeContestRecs(user) {
  const upcoming = await Contest.find({ startTime: { $gte: new Date() } }).lean();

  // Content-based: match by format, duration, preferred times
  const preferredFormats = user.profileStats.preferredContestFormats || [];
  const cbScores = {};
  for (const c of upcoming) {
    let score = 0;
    if (preferredFormats.includes(c.format)) score += 1;
    const durScore = 1 - Math.abs(c.duration / 60 - (user.profileStats.avgContestLength || 0)) / 24;
    score += durScore * 0.5;
    cbScores[c._id] = score;
  }
  const normCb = normalizeScores(cbScores);

  // Collaborative: boost contests your peers are joining
  // Simplification: count how many top-10 similar users registered
  const peers = await computePeerIds(user);
  const regCounts = {};
  for (const peerId of peers) {
    const peer = await User.findById(peerId).select('registeredContests').lean();
    for (const cid of peer.registeredContests || []) {
      if (!regCounts[cid]) regCounts[cid] = 0;
      regCounts[cid]++;
    }
  }
  const normCf = normalizeScores(regCounts);

  const merged = mergeScores(normCb, normCf, 0.6, 0.4);
  return topN(merged, 5);
}

/**
 * Compute peer (user) recommendations for a user.
 */
async function computePeerRecs(user) {
  // Build feature vectors: solved-per-tag and avgDifficulty
  const allUsers = await User.find({ _id: { $ne: user._id } })
    .select('profileStats.ratingHistory profileStats.solvedCountPerTag')
    .lean();

  // User's vector
  const userTags = user.profileStats.solvedCountPerTag || {};
  const userVec  = Object.values(userTags);

  const scores = {};
  for (const u of allUsers) {
    const vec = Object.values(u.profileStats.solvedCountPerTag || {});
    const sim = cosineSimilarity(userVec, vec);
    if (sim > 0.3) scores[u._id] = sim;
  }
  const normalized = normalizeScores(scores);
  return topN(normalized, 5).map(x => ({
    itemId: x.itemId,
    score:  x.score
  }));
}

/**
 * Compute tag/topic recommendations for a user.
 */
async function computeTagRecs(user) {
  // Need score = many unsolved easy problems * (1 - successRate)
  const allTags = Object.keys(user.profileStats.solvedCountPerTag || {});
  const tagScores = {};
  for (const tag of allTags) {
    const solved    = user.profileStats.solvedCountPerTag[tag] || 0;
    const success   = user.profileStats.successRatePerTag[tag] || 0.5;
    const unsolvedCount = await Problem.countDocuments({
      tags: tag,
      _id:  { $nin: user.solvedProblems }
    });
    tagScores[tag] = unsolvedCount * (1 - success);
  }
  const normalized = normalizeScores(tagScores);
  return Object.entries(normalized)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 5)
    .map(([tag, score]) => ({ tag, score }));
}

/**
 * Helper to compute peer IDs only.
 */
async function computePeerIds(user) {
  const peerRecs = await computePeerRecs(user);
  return peerRecs.map(p => p.itemId);
}

//
// Main generator
//

/**
 * Generate and save all recommendation categories for one user.
 */
exports.generateForUser = async (user) => {
  const problems = await computeProblemRecs(user);
  const contests = await computeContestRecs(user);
  const peers    = await computePeerRecs(user);
  const tags     = await computeTagRecs(user);

  await Recommendation.findOneAndUpdate(
    { userId: user._id },
    { userId: user._id, problems, contests, peers, tags, generatedAt: new Date() },
    { upsert: true }
  );
};

/**
 * Generate for all users with stale flag.
 */
exports.generateForAllStale = async () => {
  const staleUsers = await User.find({ 'flags.recsStale': true });
  for (const u of staleUsers) {
    await this.generateForUser(u);
    u.flags.recsStale = false;
    await u.save();
  }
};
