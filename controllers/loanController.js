const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');

const loanController = {
  // Obtener todos los préstamos
  getAllLoans: async (req, res) => {
    try {
      const loans = await Loan.find()
        .populate('user', 'name email')
        .populate('book', 'title isbn')
        .populate({
          path: 'book',
          populate: {
            path: 'author',
            select: 'name'
          }
        })
        .sort({ createdAt: -1 });

      res.json({ loans });
    } catch (error) {
      console.error('Error al obtener préstamos:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Crear nuevo préstamo
  createLoan: async (req, res) => {
    try {
      const { userId, bookId, dueDate } = req.body;

      // Verificar que el libro esté disponible
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }

      if (book.availableCopies <= 0) {
        return res.status(400).json({ message: 'No hay copias disponibles' });
      }

      // Verificar que el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Crear el préstamo
      const loan = new Loan({
        user: userId,
        book: bookId,
        dueDate: new Date(dueDate)
      });

      await loan.save();

      // Reducir copias disponibles
      book.availableCopies -= 1;
      await book.save();

      // Poblar datos para respuesta
      await loan.populate('user', 'name email');
      await loan.populate('book', 'title');

      res.status(201).json({
        message: 'Préstamo creado exitosamente',
        loan
      });
    } catch (error) {
      console.error('Error al crear préstamo:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Devolver libro
  returnBook: async (req, res) => {
    try {
      const loan = await Loan.findById(req.params.id)
        .populate('book');

      if (!loan) {
        return res.status(404).json({ message: 'Préstamo no encontrado' });
      }

      if (loan.status === 'returned') {
        return res.status(400).json({ message: 'El libro ya ha sido devuelto' });
      }

      // Actualizar préstamo
      loan.returnDate = new Date();
      loan.status = 'returned';
      await loan.save();

      // Incrementar copias disponibles
      const book = await Book.findById(loan.book._id);
      book.availableCopies += 1;
      await book.save();

      res.json({
        message: 'Libro devuelto exitosamente',
        loan
      });
    } catch (error) {
      console.error('Error al devolver libro:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener estadísticas
  getStats: async (req, res) => {
    try {
      const totalLoans = await Loan.countDocuments();
      const activeLoans = await Loan.countDocuments({ status: 'active' });
      const overdueLoans = await Loan.countDocuments({ status: 'overdue' });
      const returnedLoans = await Loan.countDocuments({ status: 'returned' });

      res.json({
        totalLoans,
        activeLoans,
        overdueLoans,
        returnedLoans
      });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

module.exports = loanController;