const mongoose = require('mongoose');
const Book = require('../models/Book');
const Author = require('../models/Author');
const { validateISBN } = require('../utils/validations');

const bookController = {
  // Obtener todos los libros
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find({ isActive: true })
        .populate('author', 'name')
        .sort({ createdAt: -1 });

      res.json({ books });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener libro por ID
  getBookById: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate('author');
      
      if (!book) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }

      res.json({ book });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Crear nuevo libro
  createBook: async (req, res) => {
    try {
      const {
        title,
        author,
        isbn,
        genre,
        publicationDate,
        publisher,
        pages,
        language,
        description,
        image,
        availableCopies
      } = req.body;

      // Validar ISBN
      if (!validateISBN(isbn)) {
        return res.status(400).json({ message: 'ISBN inválido' });
      }

      // Verificar que el autor existe
      const authorExists = await Author.findById(author);
      if (!authorExists) {
        return res.status(400).json({ message: 'Autor no encontrado' });
      }

      const book = new Book({
        title,
        author,
        isbn,
        genre,
        publicationDate,
        publisher,
        pages,
        language,
        description,
        image,
        totalCopies: 1,
        availableCopies
      });

      await book.save();
      await book.populate('author');

      res.status(201).json({
        message: 'Libro creado exitosamente',
        book
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'El ISBN ya existe' });
      }
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Actualizar libro
  updateBook: async (req, res) => {
    try {
      // Filtrar campos undefined para evitar problemas con validaciones
      const updateData = Object.fromEntries(
        Object.entries(req.body).filter(([key, value]) => value !== undefined && value !== '')
      );

      // Si hay archivo de imagen, agregar la ruta
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      // Si author es un string (nombre), buscar el autor por nombre
      if (updateData.author && typeof updateData.author === 'string' && !mongoose.Types.ObjectId.isValid(updateData.author)) {
        const author = await Author.findOne({ name: updateData.author });
        if (!author) {
          return res.status(400).json({ message: 'Autor no encontrado' });
        }
        updateData.author = author._id;
      }

      const book = await Book.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('author');

      if (!book) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }

      res.json({
        message: 'Libro actualizado exitosamente',
        book
      });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Eliminar libro
  deleteBook: async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!book) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }

      res.json({ message: 'Libro eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

module.exports = bookController;