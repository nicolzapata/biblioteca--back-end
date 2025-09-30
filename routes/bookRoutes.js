const express = require('express');
const multer = require('multer');
const path = require('path');
const bookController = require('../controllers/bookController');
const { authMiddleware, adminMiddleware, checkBookOwnership } = require('../middleware/auth');

const router = express.Router();

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rutas públicas (solo lectura)
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, bookController.createBook);
router.put('/:id', authMiddleware, checkBookOwnership, upload.single('image'), bookController.updateBook);
router.delete('/:id', authMiddleware, checkBookOwnership, bookController.deleteBook);

module.exports = router;