const express = require('express');
const loanController = require('../controllers/loanController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rutas protegidas
router.get('/', authMiddleware, loanController.getAllLoans);
router.get('/my', authMiddleware, loanController.getMyLoans);
router.get('/stats', authMiddleware, loanController.getStats);
router.get('/user/:userId', authMiddleware, loanController.getLoansByUser);
router.get('/:id', authMiddleware, loanController.getLoanById);
router.post('/', authMiddleware, loanController.createLoan);
router.post('/update-overdue', authMiddleware, adminMiddleware, loanController.updateOverdueLoans);
router.put('/:id', authMiddleware, adminMiddleware, loanController.updateLoan);
router.patch('/:id/return', authMiddleware, loanController.returnBook);
router.delete('/:id', authMiddleware, adminMiddleware, loanController.deleteLoan);
module.exports = router;