const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'El libro es obligatorio']
  },
  loanDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'La fecha de vencimiento es obligatoria']
  },
  returnDate: Date,
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue'],
    default: 'active'
  },
  notes: String,
  renewalCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Middleware para calcular estado automáticamente
loanSchema.pre('save', function(next) {
  if (!this.returnDate && this.dueDate < new Date()) {
    this.status = 'overdue';
  } else if (this.returnDate) {
    this.status = 'returned';
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);