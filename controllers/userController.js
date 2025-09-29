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
      const { password, ...updateData } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json({
        message: 'Usuario actualizado exitosamente',
        user
      });
    } catch (error) {
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
  }
};

module.exports = userController;