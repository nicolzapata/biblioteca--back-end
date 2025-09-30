const User = require('../models/User');

const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });

      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener usuario por ID
  getUserById: async (req, res) => {
    try {
      if (req.params.id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'No autorizado' });
      }

      const user = await User.findById(req.params.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Actualizar usuario
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id && req.params.id !== 'undefined' ? req.params.id : req.user.id;

      const { password, username, nombre, email, telefono, address, bio, ...otherData } = req.body;

      const updateData = {};
      if (username !== undefined && username.trim() !== '') updateData.username = username.trim().toLowerCase();
      if (nombre !== undefined && nombre.trim() !== '') updateData.name = nombre.trim();
      if (email !== undefined && email.trim() !== '') updateData.email = email.trim().toLowerCase();
      if (telefono !== undefined && telefono.trim() !== '') updateData.phone = telefono.trim();
      if (address !== undefined && address.trim() !== '') updateData.address = address.trim();

      // Verificar que haya al menos un campo para actualizar
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'No hay campos válidos para actualizar' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Actualizar la sesión con los nuevos datos
      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      };

      res.json({
        message: 'Usuario actualizado exitosamente',
        user
      });
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ message: 'El username o email ya está en uso' });
      }
      console.error('Error en updateUser:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Activar/desactivar usuario
  toggleUserStatus: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const newIsActive = !user.isActive;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: newIsActive },
        { new: true, runValidators: false }
      );

      // Actualizar la sesión si es el usuario actual
      if (req.params.id === req.user.id) {
        req.session.user = {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address
        };
      }

      res.json({
        message: `Usuario ${updatedUser.isActive ? 'activado' : 'desactivado'} exitosamente`,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isActive: updatedUser.isActive
        }
      });
    } catch (error) {
      console.error('Error en toggleUserStatus:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Cambiar contraseña
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Contraseña actual y nueva son requeridas' });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const isValid = await user.comparePassword(oldPassword);
      if (!isValid) {
        return res.status(400).json({ message: 'Contraseña actual incorrecta' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Actualizar perfil del usuario actual
  updateProfile: async (req, res) => {
      try {
          const { password, username, nombre, email, telefono, address, ...otherData } = req.body;

          const updateData = {};
          if (username !== undefined && username.trim() !== '') updateData.username = username.trim().toLowerCase();
          if (nombre !== undefined && nombre.trim() !== '') updateData.name = nombre.trim();
          if (email !== undefined && email.trim() !== '') updateData.email = email.trim().toLowerCase();
          if (telefono !== undefined && telefono.trim() !== '') updateData.phone = telefono.trim();
          if (address !== undefined && address.trim() !== '') updateData.address = address.trim();

          // Verificar que haya al menos un campo para actualizar
          if (Object.keys(updateData).length === 0) {
              return res.status(400).json({ message: 'No hay campos válidos para actualizar' });
          }

          const user = await User.findByIdAndUpdate(
              req.user.id,
              updateData,
              { new: true, runValidators: true }
          ).select('-password');

          if (!user) {
              return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          // Actualizar la sesión con los nuevos datos
          req.session.user = {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
              address: user.address,
              bio: user.bio,
              foto: user.foto
          };

          res.json({
              message: 'Perfil actualizado exitosamente',
              user
          });
      } catch (error) {
          if (error.code === 11000) { // Duplicate key error
              return res.status(400).json({ message: 'El username o email ya está en uso' });
          }
          console.error('Error en updateProfile:', error);
          res.status(500).json({ message: 'Error del servidor' });
      }
  }
};

module.exports = userController;