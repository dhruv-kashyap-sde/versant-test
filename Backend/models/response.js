// models/Response.js
const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  userId: String,
  questionId: String,
  transcription: String,
  similarityScore: Number,
  pronunciationScore: Number,
  fluencyScore: Number,
  totalScore: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Response', ResponseSchema);
