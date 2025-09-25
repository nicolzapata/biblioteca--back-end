const express = require('express');
const authorController = require('../controllers/authorController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas (solo lectura)
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

// Rutas protegidas (requieren autenticación y admin)
router.post('/', authMiddleware, adminMiddleware, authorController.createAuthor);
router.put('/:id', authMiddleware, adminMiddleware, authorController.updateAuthor);
router.delete('/:id', authMiddleware, adminMiddleware, authorController.deleteAuthor);

module.exports = router;