const express = require("express");
const { generateFile } = require("../../compiler/generateFile");
const { generateInputFile } = require("../../compiler/generateInputFile");
const { executeCode } = require("../../compiler/executeCode");
const User = require("../model/User");
const Problem = require("../model/Problem");
const Submission = require("../model/Submission");
const UserSolvedProblems = require("../model/UserSolvedProblem");
const UserSolvedDate = require("../model/UserSolvedDate");
const { recomputeProfileStats } = require("../utils/userStats");

const router = express.Router();

router.post("/submit", async (req, res) => {
  const { userId, problemId, code, language, input } = req.body;

  console.log("Request body:", req.body);
  if (!language || !code || !problemId || !userId) {
    return res.status(400).json({
      success: false,
      error: "Information missing while running code",
    });
  }

  try {
    // 1. Validate user and problem
    const userinfo = await User.findById(userId);
    if (!userinfo) {
      return res
        .status(404)
        .json({ success: false, error: "Unauthorized user" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }

    // 2. Write code file
    const filePath = await generateFile(language, code);

    const isSubmit = req.body.isSubmit || false;
    // 3. If just running (not final submit), execute on provided input
    if (!isSubmit) {
      const inputPath = await generateInputFile(input);
      const output = await executeCode(language, filePath, inputPath);
      return res.json({ filePath, inputPath, output });
    }

    // 4. On final submit, run through all test cases
    let pass = 0;
    for (let i = 0; i < problem.testCases.length; i++) {
      const { input: tcIn, output: tcOut } = problem.testCases[i];
      const inputFilePath = await generateInputFile(tcIn);
      const actualOutput = await executeCode(
        language,
        filePath,
        inputFilePath
      );

      // 5. Wrong Answer on this test?
      if (actualOutput.trim() !== tcOut.trim()) {
        console.log(`Test case ${i + 1} failed`);

        // Update problem stats
        problem.total_submissions += 1;
        await problem.save();

        // Log submission
        const submission = new Submission({
          problem:      problem._id,
          user:         userinfo._id,
          code,
          language,
          problemName:  problem.title,
          verdict: `WA on TC ${pass + 1}
Wrong TestCase:
${tcIn}
Your output:
${actualOutput}
Correct output:
${tcOut}`,
        });
        await submission.save();

        // Link submission to user
        userinfo.problems_submitted.push(submission._id);
        // Mark recs stale
        userinfo.flags.recsStale = true;
        await userinfo.save();

        // Update user's solved‑problems record
        let usp = await UserSolvedProblems.findOne({ user: userId });
        if (!usp) usp = new UserSolvedProblems({ user: userId });
        const idx = usp.solvedProblems.findIndex(
          sp => sp.problem.toString() === problemId
        );
        if (idx === -1) {
          usp.solvedProblems.push({ problem: problemId, verdict: "Wrong Answer" });
        } else if (usp.solvedProblems[idx].verdict !== "Accepted") {
          usp.solvedProblems[idx].verdict = "Wrong Answer";
        }
        await usp.save();

        // Recompute content‑based profile stats (optional on WA)
        await recomputeProfileStats(userId);

        return res.json({
          wrongTC:      tcIn,
          YourOutput:   actualOutput,
          CorrectOutput:tcOut,
          pass,
          isCorrect:    false,
        });
      }

      pass++;
    }

    // 6. All test cases passed ⇒ Accepted!
    // Record solve date
    let usd = await UserSolvedDate.findOne({ user: userId });
    if (!usd) usd = new UserSolvedDate({ user: userId });
    usd.solvedDates.push(new Date());
    await usd.save();

    // Update problem stats
    problem.total_accepted += 1;
    problem.total_submissions += 1;
    await problem.save();

    // Log submission
    const submission = new Submission({
      problem:      problem._id,
      user:         userinfo._id,
      code,
      language,
      problemName:  problem.title,
      verdict:      "Accepted",
    });
    await submission.save();

    // Link submission to user
    userinfo.problems_submitted.push(submission._id);
    // Mark recs stale
    userinfo.flags.recsStale = true;
    await userinfo.save();

    // Update user's solved‑problems record
    let usp = await UserSolvedProblems.findOne({ user: userId });
    if (!usp) usp = new UserSolvedProblems({ user: userId });
    const idx = usp.solvedProblems.findIndex(
      sp => sp.problem.toString() === problemId
    );
    if (idx === -1) {
      usp.solvedProblems.push({ problem: problemId, verdict: "Accepted" });
    } else {
      usp.solvedProblems[idx].verdict = "Accepted";
    }
    await usp.save();

    // Recompute profile stats for content‑based filtering
    await recomputeProfileStats(userId);

    return res.json({
      isCorrect:       true,
      passedTestCases: problem.testCases.length,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET latest verdict for user/problem
router.get("/verdict/:userId/:problemId", async (req, res) => {
  const { userId, problemId } = req.params;
  try {
    const submission = await Submission.findOne({
      user:    userId,
      problem: problemId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!submission) {
      return res.status(200).json({ verdict: "Unsolved" });
    }
    const verdict = submission.verdict === "Accepted" ? "Solved" : "Unsolved";
    return res.status(200).json({ verdict });
  } catch (error) {
    console.error("Error fetching verdict:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
