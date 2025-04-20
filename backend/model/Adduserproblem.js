const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserProblemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  inputExample: {
    type: String,
    required: true,
  },
  outputExample: {
    type: String,
    required: true,
  },
  constraints: {
    type: String,
    required: true,
  },
  testCases: [
    {
      input: String,
      output: String,
    },
  ],
  topics: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Userproblem", UserProblemSchema);
