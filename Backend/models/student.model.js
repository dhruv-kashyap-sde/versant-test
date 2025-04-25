const mongoose = require('mongoose');
const generateTin = require('../utils/generateTin');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  alternateId: {
    type: String,
  },
  phone: {
    type: Number,
    required: true
  },
  tin: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10 digit TIN!`
    }
  },
  testScore: {
    total:{
      type: Number,
      default: 0
    },
    partA:{
      type: Number,
      default: 0
    },
    partB:{
      type: Number,
      default: 0
    },
    partC:{
      type: Number,
      default: 0
    },
    partD:{
      type: Number,
      default: 0
    },
    partE:{
      type: Number,
      default: 0
    },
    partF:{
      type: Number,
      default: 0
    },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  testStatus:{
    type: String,
    enum: [ 'not started', 'started', 'completed'],
    default: 'not started'
  }
});

// Pre-save hook to auto-generate TIN if not provided
studentSchema.pre('save', function(next) {
  if (!this.tin) {
    this.tin = generateTin();
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
