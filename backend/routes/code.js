const express = require("express");
const router = express.Router();
const UserCode = require("../model/UserCode");

// POST endpoint to save user code
router.post("/save-code", async (req, res) => {
  const { userId, problemId, code, language } = req.body;

  try {
    if (!userId || !problemId) {
      return res
        .status(400)
        .json({ message: "userId and problemId are required" });
    }

    let userCode = await UserCode.findOne({ userId, problemId, language });
    if (userCode) {
      // Update existing user code
      userCode.code = code;
      //userCode.language = language;
    } else {
      // Create new user code entry
      userCode = new UserCode({ userId, problemId, code, language });
    }
    await userCode.save();
    res.status(200).json({ message: "Code saved successfully" });
  } catch (error) {
    console.error("Error saving code:", error.message);
    res.status(500).json({ message: "Failed to save code", error });
  }
});

// GET endpoint to retrieve user code
router.get("/get-code", async (req, res) => {
  const { userId, problemId, language } = req.query;

  console.log(
    "Received request with userId:",
    userId,
    "and problemId:",
    problemId
  );

  try {
    const userCode = await UserCode.findOne({ userId, problemId, language });

    if (!userCode) {
      console.log(
        "No code found for this problem with userId:",
        userId,
        "and problemId:",
        problemId,
        "and language:",
        language
      );
      return res
        .status(200)
        .json({ message: "No code found for this problem" });
    }

    res.status(200).json({ code: userCode.code, language: userCode.language });
  } catch (error) {
    console.error("Error fetching user code:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch code", error: error.message });
  }
});

module.exports = router;
