const Book = require('../models/Book');
const Author = require('../models/Author');
const User = require('../models/User');
const Loan = require('../models/Loan');

const dashboardController = {
  // Obtener estadísticas generales
  getStats: async (req, res) => {
    try {
      const totalBooks = await Book.countDocuments({ isActive: true });
      const totalAuthors = await Author.countDocuments({ isActive: true });
      const totalUsers = await User.countDocuments({ isActive: true });
      const totalLoans = await Loan.countDocuments();
      const activeLoans = await Loan.countDocuments({ status: 'active' });
      const overdueLoans = await Loan.countDocuments({ status: 'overdue' });

      // Copias totales y disponibles
      const bookStats = await Book.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalCopies: { $sum: '$totalCopies' },
            availableCopies: { $sum: '$availableCopies' }
          }
        }
      ]);

      // Géneros más populares
      const popularGenres = await Book.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Usuarios más activos (más préstamos)
      const activeUsers = await Loan.aggregate([
        {
          $group: {
            _id: '$user',
            loanCount: { $sum: 1 }
          }
        },
        { $sort: { loanCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            name: '$user.name',
            email: '$user.email',
            loanCount: 1
          }
        }
      ]);

      res.json({
        summary: {
          totalBooks,
          totalAuthors,
          totalUsers,
          totalLoans,
          activeLoans,
          overdueLoans,
          totalCopies: bookStats[0]?.totalCopies || 0,
          availableCopies: bookStats[0]?.availableCopies || 0
        },
        popularGenres,
        activeUsers
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener préstamos recientes
  getRecentLoans: async (req, res) => {
    try {
      const recentLoans = await Loan.find()
        .populate('user', 'name email')
        .populate('book', 'title')
        .sort({ createdAt: -1 })
        .limit(10);

      res.json(recentLoans);
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener libros con pocas copias disponibles
  getLowStockBooks: async (req, res) => {
    try {
      const lowStockBooks = await Book.find({
        isActive: true,
        availableCopies: { $lte: 2 }
      })
      .populate('author', 'name')
      .sort({ availableCopies: 1 })
      .limit(10);

      res.json(lowStockBooks);
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

module.exports = dashboardController;