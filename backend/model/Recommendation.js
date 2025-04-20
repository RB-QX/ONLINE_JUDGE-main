const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  problems: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
      score:  { type: Number, required: true }
    }
  ],
  contests: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
      score:  { type: Number, required: true }
    }
  ],
  peers: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      score:  { type: Number, required: true }
    }
  ],
  tags: [
    {
      tag:   { type: String, required: true },
      score: { type: Number, required: true }
    }
  ],
  generatedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Ensure one Recommendation document per user
recommendationSchema.index({ userId: 1 }, { unique: true });

// Optionally, add a small helper method to check staleness
recommendationSchema.methods.isStale = function(thresholdMinutes = 60) {
  const ageMs = Date.now() - this.generatedAt.getTime();
  return ageMs > thresholdMinutes * 60 * 1000;
};

module.exports = mongoose.model('Recommendation', recommendationSchema);
