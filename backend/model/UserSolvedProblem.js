const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSolvedProblemsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    solvedProblems: [
      {
        problem: {
          type: Schema.Types.ObjectId,
          ref: "Problem",
          required: true,
        },
        verdict: {
          type: String,
          required: true,
          enum: ["Accepted", "Wrong Answer", "Unsolved"],
          default: "Unsolved",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSolvedProblems", UserSolvedProblemsSchema);
