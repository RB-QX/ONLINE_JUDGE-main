const express = require("express");

const Problem = require("../model/Problem");

// POST /api/problems
exports.addproblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    inputExample,
    outputExample,
    constraints,
    testCases,
    topics,
  } = req.body;

  if (
    !title ||
    !description ||
    !difficulty ||
    !inputExample ||
    !outputExample ||
    !constraints ||
    !testCases ||
    !topics
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newProblem = new Problem({
      title,
      description,
      difficulty,
      inputExample,
      outputExample,
      constraints,
      testCases,
      topics,
    });

    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getproblem = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getproblemdifficulty = async (req, res) => {
  try {
    const { difficulty } = req.query;
    const query = {};
    if (difficulty) {
      query.difficulty = difficulty;
    }
    const problems = await Problem.find(query);
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteproblem = async (req, res) => {
  const { id } = req.params;
  try {
    await Problem.findByIdAndDelete(id);
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res
      .status(500)
      .json({ message: "Failed to delete problem", error: error.message });
  }
};
