const mongoose = require('mongoose');

const TestAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  questions: {
    partA: [{
      question: { type: String, required: true }
    }],
    partB: [{
      question: { type: String, required: true },
      rearranged: { type: String, required: true }
    }],
    partC: [{
      dialog: [{
        speaker: { type: String, required: true },
        text: { type: String, required: true }
      }],
      question: { type: String, required: true },
      keywords: [{ type: String, required: true }]
    }],
    partD: [{
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }],
    partE: [{
      question: { type: String, required: true }
    }],
    partF: [{
      question: { type: String, required: true }
    }]
  },
  answers: {
    partA: [{ type: String }],
    partB: [{ type: String }],
    partC: [{ type: String }],
    partD: [{ type: String }],
    partE: [{ type: String }],
    partF: [{ type: String }]
  },
  scores: {
    partA: { type: Number, default: 0 },
    partB: { type: Number, default: 0 },
    partC: { type: Number, default: 0 },
    partD: { type: Number, default: 0 },
    partE: { type: Number, default: 0 },
    partF: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['started', 'completed', 'abandoned'],
    default: 'started'
  }
}, { timestamps: true });

module.exports = mongoose.model('TestAttempt', TestAttemptSchema);