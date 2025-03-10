const mongoose = require('mongoose');

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
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to auto-generate TIN if not provided
studentSchema.pre('save', function(next) {
  if (!this.tin) {
    this.tin = Math.floor(1000000000 + Math.random() * 9000000000);
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
