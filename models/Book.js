const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  isbn: {
    type: String,
    unique: true,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  publicationDate: Date,
  publisher: String,
  pages: {
    type: Number,
    min: 1
  },
  language: {
    type: String,
    default: 'Español'
  },
  description: String,
  totalCopies: {
    type: Number,
    required: true,
    min: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);