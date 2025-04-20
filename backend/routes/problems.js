// backend/routes/problems.js

const express = require("express");
const router = express.Router();
const Problem = require("../model/Problem");
const { isAdmin } = require("../middlewares/role");

// POST /addproblems
// Create a new problem (admin only)
router.post("/addproblems", isAdmin, async (req, res) => {
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
    !Array.isArray(testCases) ||
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
    console.error("Error adding problem:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /allproblems
// List up to 100 problems
router.get("/allproblems", async (req, res) => {
  try {
    const problems = await Problem.find()
      .limit(100);
    res.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /problemsdifficulty?difficulty=Easy
// Filter problems by difficulty
router.get("/problemsdifficulty", async (req, res) => {
  try {
    const { difficulty } = req.query;
    const filter = difficulty ? { difficulty } : {};
    const problems = await Problem.find(filter);
    res.json(problems);
  } catch (error) {
    console.error("Error filtering problems:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /allproblems/:id
// Retrieve a single problem by its MongoDB _id
router.get("/allproblems/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    console.error(`Error fetching problem ${id}:`, error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid problem ID" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /allproblems/:id
// Update a problem by its _id
router.put("/allproblems/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Problem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error(`Error updating problem ${id}:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /allproblems/:id
// Remove a problem by its _id
router.delete("/allproblems/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Problem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error(`Error deleting problem ${id}:`, error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
