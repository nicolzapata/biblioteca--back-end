const User = require('../models/User');
const { validateEmail, validatePassword } = require('../utils/validations');

const authController = {
  // Registro simple
  register: async (req, res) => {
    try {
      const { name, username, email, password, phone, address } = req.body;

      // Validar campos requeridos
      if (!name || !username || !email || !password) {
        return res.status(400).json({ message: 'Nombre, username, email y password son requeridos' });
      }

      // Validar email
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Email inválido' });
      }

      // Validar password
      if (!validatePassword(password)) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número' });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Crear nuevo usuario
      const user = new User({
        name,
        username,
        email,
        password,
        phone,
        address
      });

      await user.save();

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Login con sesiones
  login: async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const input = email || username;
      if (!input) {
        return res.status(400).json({ message: 'Debe proporcionar email o username' });
      }
      const normalizedInput = input.toLowerCase();

      // Buscar usuario por email o username
      const user = await User.findOne({ $or: [{ email: normalizedInput }, { username: normalizedInput }] });
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Guardar usuario en sesión
      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      res.json({
        message: 'Login exitoso',
        user: req.session.user
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Logout
  logout: async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Sesión cerrada exitosamente' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener usuario actual de la sesión
  getCurrentUser: async (req, res) => {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ message: 'No hay sesión activa' });
    }
  }
};

module.exports = authController;