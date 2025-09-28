const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  biography: {
    type: String,
    maxlength: 1000
  },
  birthDate: Date,
  nationality: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Author', authorSchema);