// backend/model/Problem.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const TestCaseSchema = new Schema({
  input:  { type: String },
  output: { type: String }
}, { _id: false });

const ProblemSchema = new Schema({
  // from CF API
  contestId:  { type: Number, required: true },
  index:      { type: String, required: true },
  title:      { type: String, required: true },           // problem name
  // derived from rating
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Unknown' },
  topics:     { type: [String], default: [] },             // CF tags

  // scraped from HTML
  description:  { type: String, default: 'No description.' },
  constraints:  { type: String, default: 'None' },        // TL · ML
  inputExample: { type: String, default: 'N/A' },
  outputExample:{ type: String, default: 'N/A' },
  testCases:    { type: [TestCaseSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Problem', ProblemSchema);
