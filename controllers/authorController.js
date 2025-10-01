const Author = require('../models/Author');

const authorController = {
  // Obtener todos los autores
  getAllAuthors: async (req, res) => {
    try {
      const authors = await Author.find({ isActive: true })
        .populate('createdBy', 'name username')
        .sort({ name: 1 });

      // Agregar información de permisos si el usuario está autenticado
      const authorsWithPermissions = authors.map(author => {
        const authorObj = author.toObject();
        
        // Determinar si el usuario puede editar este autor
        if (req.user) {
          authorObj.canEdit = req.user.role === 'admin' || (author.createdBy && author.createdBy._id.toString() === req.user.id);
        } else {
          authorObj.canEdit = false;
        }
        
        return authorObj;
      });

      res.json({ authors: authorsWithPermissions });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener autor por ID
  getAuthorById: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id)
        .populate('createdBy', 'name username');
      
      if (!author) {
        return res.status(404).json({ message: 'Autor no encontrado' });
      }

      const authorObj = author.toObject();
      
      // Agregar información de permisos si el usuario está autenticado
      if (req.user) {
        authorObj.canEdit = req.user.role === 'admin' || (author.createdBy && author.createdBy._id.toString() === req.user.id);
      } else {
        authorObj.canEdit = false;
      }

      res.json({ author: authorObj });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Crear nuevo autor
  createAuthor: async (req, res) => {
    try {
      const authorData = {
        ...req.body,
        createdBy: req.user.id
      };
      
      const author = new Author(authorData);
      await author.save();

      res.status(201).json({
        message: 'Autor creado exitosamente',
        author
      });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Actualizar autor
  updateAuthor: async (req, res) => {
    try {
      // Filtrar campos undefined para evitar problemas con validaciones
      const updateData = Object.fromEntries(
        Object.entries(req.body).filter(([key, value]) => value !== undefined && value !== '')
      );

      // Si hay archivo de foto, agregar la ruta
      if (req.file) {
        updateData.photo = `/uploads/${req.file.filename}`;
      }

      const author = await Author.findByIdAndUpdate(
        req.params.id,
        updateData,
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