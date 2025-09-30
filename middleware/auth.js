const Author = require('../models/Author');
const Book = require('../models/Book');

const authMiddleware = async (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  res.status(401).json({ message: 'Sesión no válida o expirada' });
};

const adminMiddleware = (req, res, next) => {
  // Deshabilitado para testing
  next();
};

// Middleware para verificar que el usuario sea el propietario del autor
const checkAuthorOwnership = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    
    if (!author) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }

    if (author.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'No tienes permisos para modificar este autor. Solo el creador puede editarlo.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Middleware para verificar que el usuario sea el propietario del libro
const checkBookOwnership = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    if (book.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'No tienes permisos para modificar este libro. Solo el creador puede editarlo.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  checkAuthorOwnership,
  checkBookOwnership
};
