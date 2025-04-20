// UserSolvedDate.js

const mongoose = require("mongoose");

const userSolvedDateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  solvedDates: [
    {
      type: Date,
      default: Date.now,
    },
  ],
});

const UserSolvedDate = mongoose.model("UserSolvedDate", userSolvedDateSchema);
module.exports = UserSolvedDate;
