const express = require('express');
const bookController = require('../controllers/bookController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', bookController.getAllBooks);
router.get('/genres', bookController.getGenres);
router.get('/:id', bookController.getBookById);

// Rutas protegidas (solo admin/librarian)
router.post('/', authMiddleware, bookController.createBook);
router.put('/:id', authMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, bookController.deleteBook);

module.exports = router;