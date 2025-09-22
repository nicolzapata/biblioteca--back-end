const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.get('/stats', dashboardController.getStats);
router.get('/recent-loans', dashboardController.getRecentLoans);
router.get('/low-stock', dashboardController.getLowStockBooks);

module.exports = router;