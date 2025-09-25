const express = require('express');
const loanController = require('../controllers/loanController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rutas protegidas
router.get('/', authMiddleware, adminMiddleware, loanController.getAllLoans);
router.get('/stats', authMiddleware, adminMiddleware, loanController.getStats);
router.post('/', authMiddleware, loanController.createLoan);
router.patch('/:id/return', authMiddleware, loanController.returnBook);

module.exports = router;