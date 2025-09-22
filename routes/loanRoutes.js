const express = require('express');
const loanController = require('../controllers/loanController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/', loanController.getAllLoans);
router.get('/stats', loanController.getStats);
router.get('/user/:userId', loanController.getUserLoans);
router.post('/', loanController.createLoan);
router.patch('/:id/return', loanController.returnBook);
router.patch('/:id/renew', loanController.renewLoan);

module.exports = router;