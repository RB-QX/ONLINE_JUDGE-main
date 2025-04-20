const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const generateFile      = require('../../compiler/generateFile');
const generateInputFile = require('../../compiler/generateInputFile');
const executeCode       = require('../../compiler/executeCode');
const User    = require('../model/User');
const Problem = require('../model/Problem');
const Submission = require('../model/Submission');
const UserSolvedProblems = require('../model/UserSolvedProblem');
const UserSolvedDate     = require('../model/UserSolvedDate');
const { recomputeProfileStats } = require('../utils/userStats');
const Activity = require('../model/Activity');

// POST /submit
router.post('/submit', auth, async (req, res) => {
  const { code, language, problemId } = req.body;
  const userId = req.user.id;

  if (!code || !language || !problemId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const userinfo = await User.findById(userId);
    const problem  = await Problem.findById(problemId);
    if (!userinfo || !problem) {
      return res.status(404).json({ error: 'User or problem not found' });
    }

    // 1. Write code file
    const filePath = await generateFile(language, code);

    // 2. If just running, not final submit
    if (!req.body.isSubmit) {
      const inputPath = await generateInputFile(req.body.input || '');
      const output = await executeCode(language, filePath, inputPath);
      return res.json({ output });
    }

    // 3. Final submission: test all cases
    let passCount = 0;
    for (const tc of problem.testCases) {
      const inPath = await generateInputFile(tc.input);
      const out    = await executeCode(language, filePath, inPath);

      if (out.trim() !== tc.output.trim()) {
        // Wrong Answer
        problem.total_submissions++;
        await problem.save();

        await Submission.create({
          problem:     problem._id,
          user:        userinfo._id,
          code, language,
          verdict:     `WA on TC ${passCount + 1}`,
          problemName: problem.title,
        });

        // flag stale recs + log activity + update stats
        userinfo.flags.recsStale = true;
        await userinfo.save();

        await recordUserSolved(userId, problemId, 'Wrong Answer');
        await Activity.create({
          user:   userinfo.username,
          action: `WA on ${problem.title}`
        });
        await recomputeProfileStats(userId);

        return res.json({ isCorrect: false, failedCase: passCount + 1 });
      }
      passCount++;
    }

    // Accepted
    problem.total_accepted++;
    problem.total_submissions++;
    await problem.save();

    await Submission.create({
      problem:     problem._id,
      user:        userinfo._id,
      code, language,
      verdict:     'Accepted',
      problemName: problem.title,
    });

    userinfo.flags.recsStale = true;
    await userinfo.save();

    await recordUserSolved(userId, problemId, 'Accepted');
    await UserSolvedDate.updateOne(
      { user: userId },
      { $push: { solvedDates: new Date() } },
      { upsert: true }
    );
    await Activity.create({
      user:   userinfo.username,
      action: `Solved ${problem.title}`
    });
    await recomputeProfileStats(userId);

    return res.json({ isCorrect: true, passedTestCases: passCount });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// GET /verdict/:userId/:problemId
router.get('/verdict/:userId/:problemId', async (req, res) => {
  const { userId, problemId } = req.params;
  try {
    const sub = await Submission.findOne({ user: userId, problem: problemId })
                                .sort({ createdAt: -1 })
                                .lean();
    const verdict = sub && sub.verdict === 'Accepted' ? 'Solved' : 'Unsolved';
    return res.json({ verdict });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

async function recordUserSolved(userId, problemId, verdict) {
  const m = await UserSolvedProblems.findOne({ user: userId });
  if (!m) {
    await UserSolvedProblems.create({
      user:           userId,
      solvedProblems: [{ problem: problemId, verdict }]
    });
  } else {
    const idx = m.solvedProblems.findIndex(x => x.problem.toString() === problemId);
    if (idx === -1) {
      m.solvedProblems.push({ problem: problemId, verdict });
    } else {
      m.solvedProblems[idx].verdict = verdict;
    }
    await m.save();
  }
}

module.exports = router;
