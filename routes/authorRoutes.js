const express = require('express');
const authorController = require('../controllers/authorController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

// Rutas protegidas
router.post('/', authMiddleware, authorController.createAuthor);
router.put('/:id', authMiddleware, authorController.updateAuthor);
router.delete('/:id', authMiddleware, adminMiddleware, authorController.deleteAuthor);

module.exports = router;