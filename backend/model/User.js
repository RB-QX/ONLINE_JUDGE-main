const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  // references to submission documents
  problems_submitted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],

  // cached statistics for content‑based filtering
  profileStats: {
    solvedCountPerTag: { type: Map, of: Number, default: {} },
    successRatePerTag: { type: Map, of: Number, default: {} },
    avgDifficulty:     { type: Number, default: 0 },
    ratingHistory:     [{ rating: Number, at: Date }],
  },

  // flag for stale recommendations
  flags: {
    recsStale: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model("User", userSchema);
