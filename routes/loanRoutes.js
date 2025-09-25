const express = require('express');
const loanController = require('../controllers/loanController');

const router = express.Router();

router.get('/', loanController.getAllLoans);
router.get('/stats', loanController.getStats);
router.post('/', loanController.createLoan);
router.patch('/:id/return', loanController.returnBook);

module.exports = router;