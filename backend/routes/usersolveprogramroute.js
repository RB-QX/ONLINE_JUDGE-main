const express = require("express");
const router = express.Router();
const UserSolvedProblems = require("../model/UserSolvedProblem");

// Route to fetch verdict based on userId and problemId
router.get("/verdict/:userId/:problemId", async (req, res) => {
  const { userId, problemId } = req.params;

  try {
    const userSolvedProblem = await UserSolvedProblems.findOne({
      user: userId,
      "solvedProblems.problem": problemId,
    });

    if (!userSolvedProblem) {
      return res.status(404).json({
        success: false,
        message: "Verdict not found for the user and problem combination",
      });
    }

    // Find the specific solved problem within the array
    const solvedProblem = userSolvedProblem.solvedProblems.find(
      (item) => item.problem.toString() === problemId
    );

    if (!solvedProblem) {
      return res.status(404).json({
        success: false,
        message: "Verdict not found for the user and problem combination",
      });
    }

    res.json({ success: true, verdict: solvedProblem.verdict });
  } catch (error) {
    console.error("Error fetching verdict:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch verdict" });
  }
});

module.exports = router;
