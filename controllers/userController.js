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

      user.isActive = !user.isActive;
      await user.save();

      res.json({
        message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

module.exports = userController;