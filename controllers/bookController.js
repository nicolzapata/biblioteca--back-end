const Book = require('../models/Book');
const Author = require('../models/Author');

const bookController = {
  // Obtener todos los libros
  getAllBooks: async (req, res) => {
    try {
      const { page = 1, limit = 10, search, genre } = req.query;
      const query = { isActive: true };

      // Filtros
      if (search) {
        query.$text = { $search: search };
      }
      if (genre) {
        query.genre = genre;
      }

      const books = await Book.find(query)
        .populate('author', 'name')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await Book.countDocuments(query);

      res.json({
        books,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      console.error('Error al obtener libros:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener un libro por ID
  getBookById: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).populate('author');
      
      if (!book) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }

      res.json(book);
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
        totalCopies
      } = req.body;

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
        totalCopies,
        availableCopies: totalCopies
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
      console.error('Error al crear libro:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Actualizar libro
  updateBook: async (req, res) => {
    try {
      const book = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
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
      console.error('Error al actualizar libro:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Eliminar libro (soft delete)
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
  },

  // Obtener géneros disponibles
  getGenres: async (req, res) => {
    try {
      const genres = await Book.distinct('genre', { isActive: true });
      res.json(genres);
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

module.exports = bookController;