const express = require('express');
const loanController = require('../controllers/loanController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rutas protegidas
router.get('/', authMiddleware, loanController.getAllLoans);
router.get('/:id', authMiddleware, loanController.getLoanById);
router.get('/stats', authMiddleware, loanController.getStats);
router.post('/', authMiddleware, loanController.createLoan);
router.put('/:id', authMiddleware, adminMiddleware, loanController.updateLoan);
router.patch('/:id/return', authMiddleware, loanController.returnBook);

module.exports = router;