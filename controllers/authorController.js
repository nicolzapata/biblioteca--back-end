const Author = require('../models/Author');

const authorController = {
  // Obtener todos los autores
  getAllAuthors: async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const query = { isActive: true };

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      const authors = await Author.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ name: 1 });

      const total = await Author.countDocuments(query);

      res.json({
        authors,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener autor por ID
  getAuthorById: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      
      if (!author) {
        return res.status(404).json({ message: 'Autor no encontrado' });
      }

      res.json(author);
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Crear nuevo autor
  createAuthor: async (req, res) => {
    try {
      const author = new Author(req.body);
      await author.save();

      res.status(201).json({
        message: 'Autor creado exitosamente',
        author
      });
    } catch (error) {
      console.error('Error al crear autor:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Actualizar autor
  updateAuthor: async (req, res) => {
    try {
      const author = await Author.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!author) {
        return res.status(404).json({ message: 'Autor no encontrado' });
      }

      res.json({
        message: 'Autor actualizado exitosamente',
        author
      });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Eliminar autor
  deleteAuthor: async (req, res) => {
    try {
      const author = await Author.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!author) {
        return res.status(404).json({ message: 'Autor no encontrado' });
      }

      res.json({ message: 'Autor eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

module.exports = authorController;