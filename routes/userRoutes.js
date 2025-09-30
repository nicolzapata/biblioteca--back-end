const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rutas protegidas (requieren autenticación y permisos de admin)
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser);
router.patch('/:id/toggle-status', authMiddleware, adminMiddleware, userController.toggleUserStatus);
router.put('/change-password', authMiddleware, userController.changePassword);

module.exports = router;
