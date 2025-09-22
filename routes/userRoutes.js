const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de administrador
router.get('/', adminMiddleware, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.patch('/:id/role', adminMiddleware, userController.changeUserRole);
router.patch('/:id/toggle-status', adminMiddleware, userController.toggleUserStatus);

module.exports = router;