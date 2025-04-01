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
    partA: { answers: [ {type: String, default: " "}] },
    partB: { answers: [ {type: String, default: " "}] },
    partC: { answers: [ {type: String, default: " "}] },
    partD: { answers: [ {type: String, default: " "}] },
    partE: { answers: [ {type: String, default: " "}] },
    partF: { answers: [ {type: String, default: " "}] }
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
    enum: [ 'not started', 'started', 'completed'],
    default: 'not started'
  }
}, { timestamps: true });

module.exports = mongoose.model('TestAttempt', TestAttemptSchema);