const Author = require('../models/Author');

const authorController = {
  // Obtener todos los autores
  getAllAuthors: async (req, res) => {
    try {
      const authors = await Author.find({ isActive: true })
        .sort({ name: 1 });

      res.json({ authors });
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

      res.json({ author });
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
      console.log('Datos recibidos para actualizar autor:', req.body);
      // Filtrar campos vacíos para evitar problemas con validaciones en campos opcionales
      const updateData = Object.fromEntries(
        Object.entries(req.body).filter(([key, value]) => value !== "")
      );
      console.log('Datos filtrados para actualizar:', updateData);
      const author = await Author.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!author) {
        console.log('Autor no encontrado');
        return res.status(404).json({ message: 'Autor no encontrado' });
      }

      console.log('Autor actualizado:', author);
      res.json({
        message: 'Autor actualizado exitosamente',
        author
      });
    } catch (error) {
      console.error('Error al actualizar autor:', error);
      console.error('Stack:', error.stack);
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