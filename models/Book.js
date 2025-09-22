const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'El autor es obligatorio']
  },
  isbn: {
    type: String,
    unique: true,
    required: [true, 'El ISBN es obligatorio']
  },
  genre: {
    type: String,
    required: [true, 'El género es obligatorio']
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
  description: {
    type: String,
    maxlength: 1000
  },
  coverImage: String,
  totalCopies: {
    type: Number,
    required: [true, 'El número total de copias es obligatorio'],
    min: 1
  },
  availableCopies: {
    type: Number,
    required: [true, 'El número de copias disponibles es obligatorio'],
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsqueda
bookSchema.index({ title: 'text', genre: 'text' });

module.exports = mongoose.model('Book', bookSchema);