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
  genre: String,
  language: String,
  photo: {
    type: String,
    default: 'https://via.placeholder.com/150x200?text=Autor'
  },
  works: String,
  awards: String,
  socialMedia: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Author', authorSchema);