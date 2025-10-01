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
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  },

  // Obtener préstamo por ID
  getLoanById: async (req, res) => {
    try {
      const loan = await Loan.findById(req.params.id)
        .populate('user', 'name email')
        .populate('book', 'title isbn')
        .populate({
          path: 'book',
          populate: {
            path: 'author',
            select: 'name'
          }
        });

      if (!loan) {
        return res.status(404).json({ message: 'Préstamo no encontrado' });
      }

      res.json({ loan });
    } catch (error) {
      console.error('Error al obtener préstamo por ID:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  },

  // Crear nuevo préstamo
  createLoan: async (req, res) => {
    try {
      const { userId, bookId, dueDate } = req.body;

      // Validar fecha de vencimiento
      if (!dueDate) {
        return res.status(400).json({ message: 'La fecha de vencimiento es requerida' });
      }

      const dueDateObj = new Date(dueDate);
      if (isNaN(dueDateObj.getTime())) {
        return res.status(400).json({ message: 'Fecha de vencimiento inválida' });
      }

      if (dueDateObj <= new Date()) {
        return res.status(400).json({ message: 'La fecha de vencimiento debe ser futura' });
      }

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

      // Verificar límite de préstamos activos por usuario (máximo 5)
      const activeLoansCount = await Loan.countDocuments({
        user: userId,
        status: { $in: ['active', 'overdue'] }
      });
      
      if (activeLoansCount >= 5) {
        return res.status(400).json({ message: 'El usuario ha alcanzado el límite máximo de préstamos activos (5)' });
      }

      // Verificar que el usuario no tenga ya un préstamo activo para este libro
      const existingLoan = await Loan.findOne({
        user: userId,
        book: bookId,
        status: { $in: ['active', 'overdue'] }
      });
      if (existingLoan) {
        return res.status(400).json({ message: 'El usuario ya tiene un préstamo activo para este libro' });
      }

      // Crear el préstamo
      const loan = new Loan({
        user: userId,
        book: bookId,
        dueDate: dueDateObj
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
      res.status(500).json({ message: 'Error del servidor', error: error.message });
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
      const book = await Book.findById(loan.book);
      if (book) {
        book.availableCopies += 1;
        await book.save();
      }

      res.json({
        message: 'Libro devuelto exitosamente',
        loan
      });
    } catch (error) {
      console.error('Error al devolver libro:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  },

  // Actualizar préstamo
  updateLoan: async (req, res) => {
    try {
      const { user, book, dueDate, status } = req.body;

      // Obtener el préstamo actual
      const currentLoan = await Loan.findById(req.params.id);
      if (!currentLoan) {
        return res.status(404).json({ message: 'Préstamo no encontrado' });
      }

      // Validar fecha si se proporciona
      let dueDateObj;
      if (dueDate) {
        dueDateObj = new Date(dueDate);
        if (isNaN(dueDateObj.getTime())) {
          return res.status(400).json({ message: 'Fecha de vencimiento inválida' });
        }
      }

      // Si se cambia el libro, manejar las copias disponibles
      if (book && book !== currentLoan.book.toString()) {
        // Incrementar copias del libro anterior
        const oldBook = await Book.findById(currentLoan.book);
        if (oldBook) {
          oldBook.availableCopies += 1;
          await oldBook.save();
        }

        // Decrementar copias del nuevo libro
        const newBook = await Book.findById(book);
        if (!newBook) {
          return res.status(404).json({ message: 'Nuevo libro no encontrado' });
        }
        if (newBook.availableCopies <= 0) {
          return res.status(400).json({ message: 'No hay copias disponibles del nuevo libro' });
        }
        newBook.availableCopies -= 1;
        await newBook.save();
      }

      const loan = await Loan.findByIdAndUpdate(
        req.params.id,
        {
          user,
          book,
          dueDate: dueDateObj,
          status
        },
        { new: true, runValidators: true }
      ).populate('user', 'name email')
       .populate('book', 'title isbn');

      res.json({
        message: 'Préstamo actualizado exitosamente',
        loan
      });
    } catch (error) {
      console.error('Error al actualizar préstamo:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  },

  // Eliminar préstamo
  deleteLoan: async (req, res) => {
    try {
      const loan = await Loan.findById(req.params.id).populate('book');

      if (!loan) {
        return res.status(404).json({ message: 'Préstamo no encontrado' });
      }

      // Si el préstamo no ha sido devuelto, incrementar copias disponibles
      if (loan.status !== 'returned' && loan.book) {
        const book = await Book.findById(loan.book._id);
        if (book) {
          book.availableCopies += 1;
          await book.save();
        }
      }

      await Loan.findByIdAndDelete(req.params.id);

      res.json({ message: 'Préstamo eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar préstamo:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  },

  // Obtener mis préstamos
  getMyLoans: async (req, res) => {
    try {
      const loans = await Loan.find({ user: req.user.id })
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
      console.error('Error al obtener mis préstamos:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  },

  // Obtener préstamos por usuario
  getLoansByUser: async (req, res) => {
    try {
      let userId = req.params.userId;

      if (userId === 'me') {
        userId = req.user.id;
      }

      // Verificar que el usuario pueda ver sus propios préstamos o sea admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'No autorizado' });
      }

      const loans = await Loan.find({ user: userId })
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
      console.error('Error al obtener préstamos por usuario:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
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
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  },

  // Actualizar préstamos vencidos (función administrativa)
  updateOverdueLoans: async (req, res) => {
    try {
      const result = await Loan.updateOverdueLoans();
      
      res.json({
        message: 'Préstamos vencidos actualizados exitosamente',
        updated: result.modifiedCount,
        matched: result.matchedCount
      });
    } catch (error) {
      console.error('Error al actualizar préstamos vencidos:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
  }
};

module.exports = loanController;