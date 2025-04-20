// backend/model/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user:      { type: String, required: true },
  action:    { type: String, required: true },
  time:      { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);