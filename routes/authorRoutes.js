const express = require('express');
const multer = require('multer');
const path = require('path');
const authorController = require('../controllers/authorController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Configuración de multer para subir fotos
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
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

// Rutas protegidas (requieren autenticación y admin)
router.post('/', authMiddleware, adminMiddleware, authorController.createAuthor);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('photo'), authorController.updateAuthor);
router.delete('/:id', authMiddleware, adminMiddleware, authorController.deleteAuthor);

module.exports = router;