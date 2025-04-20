// In your routes file (e.g., routes/solvedDates.js)
const express = require("express");
const UserSolvedDate = require("../model/UserSolvedDate");
const mongoose = require("mongoose");
exports.solvedate = async (req, res) => {
  try {
    const { userId } = req.params;
    // Validate and convert the userId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid user ID format" });
    }
    const userSolvedDate = await UserSolvedDate.findOne({ user: userId });

    if (!userSolvedDate) {
      return res
        .status(404)
        .json({ success: false, message: "No solved dates found for user." });
    }

    res.json({ success: true, solvedDates: userSolvedDate.solvedDates });
  } catch (error) {
    console.error("Error fetching solved dates:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
