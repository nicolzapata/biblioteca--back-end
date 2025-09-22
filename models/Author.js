const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del autor es obligatorio'],
    trim: true
  },
  biography: {
    type: String,
    maxlength: 1000
  },
  birthDate: Date,
  nationality: String,
  website: String,
  photo: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual para obtener libros del autor
authorSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author'
});

authorSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Author', authorSchema);