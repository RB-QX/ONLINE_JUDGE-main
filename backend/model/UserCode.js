const mongoose = require("mongoose");

const UserCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
});

const UserCode = mongoose.model("UserCode", UserCodeSchema);

module.exports = UserCode;
