const UserProblem = require("../model/Adduserproblem");
const Problem = require("../model/Problem"); // Main problem model

// POST /api/problems
exports.adduserproblems = async (req, res) => {
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
    const newProblem = new UserProblem({
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

//to show all user problems to admin dashboard
exports.alluserproblems = async (req, res) => {
  try {
    const problems = await UserProblem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveproblem = async (req, res) => {
  try {
    const userProblemId = req.params.id;
    const userProblem = await UserProblem.findById(userProblemId);

    if (!userProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    if (!userProblem.topics) {
      return res.status(400).json({ error: "Topics field is required" });
    }

    // Create a new problem in the main problem collection
    const newProblem = new Problem({
      title: userProblem.title,
      description: userProblem.description,
      difficulty: userProblem.difficulty,
      inputExample: userProblem.inputExample,
      outputExample: userProblem.outputExample,
      constraints: userProblem.constraints,
      testCases: userProblem.testCases,
      topics: userProblem.topics,
    });

    await newProblem.save();
    await UserProblem.findByIdAndDelete(userProblemId);

    res
      .status(200)
      .json({ message: "Problem approved and added to main collection" });
  } catch (error) {
    console.error("Error approving problem:", error); // Detailed error logging
    res.status(500).json({ error: "Server error" });
  }
};

// Reject a problem
exports.rejectproblem = async (req, res) => {
  try {
    const userProblemId = req.params.id;
    const userProblem = await UserProblem.findById(userProblemId);

    if (!userProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    await UserProblem.findByIdAndDelete(userProblemId);

    res.status(200).json({ message: "Problem rejected and deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
