const Author = require('../models/Author');
const Book = require('../models/Book');

const authMiddleware = async (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  res.status(401).json({ message: 'Sesión no válida o expirada' });
};
// Middleware opcional que no rechaza si no hay sesión
const optionalAuthMiddleware = async (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  // Continúa sin rechazar aunque no haya sesión
  next();
};


const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Sesión no válida' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
  
  next();
};

// Middleware para verificar que el usuario sea el propietario del autor o administrador
const checkAuthorOwnership = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    
    if (!author) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }

    // El administrador puede editar cualquier autor
    if (req.user.role === 'admin') {
      return next();
    }

    // El creador puede editar su propio autor
    if (author.createdBy.toString() === req.user.id) {
      return next();
    }

    return res.status(403).json({
      message: 'No tienes permisos para modificar este autor. Solo el creador o un administrador puede editarlo.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Middleware para verificar que el usuario sea el propietario del libro o administrador
const checkBookOwnership = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // El administrador puede editar cualquier libro
    if (req.user.role === 'admin') {
      return next();
    }

    // El creador puede editar su propio libro
    if (book.createdBy.toString() === req.user.id) {
      return next();
    }

    return res.status(403).json({
      message: 'No tienes permisos para modificar este libro. Solo el creador o un administrador puede editarlo.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  adminMiddleware,
  checkAuthorOwnership,
  checkBookOwnership
};
