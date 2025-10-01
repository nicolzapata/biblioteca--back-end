const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Conectar a MongoDB
connectDB();

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto_de_sesion',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 horas
    sameSite: 'lax'
  }
}));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://localhost:5173', 'http://127.0.0.1:5173', 'null'], // Origins permitidos (incluyendo 'null' para archivos locales)
  credentials: true // Permitir cookies de sesión
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(logger);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Biblioteca Digital funcionando!',
    version: '1.0.0',
    status: 'OK'
  });
});

const PORT = process.env.PORT || 5000;

console.log(`Starting server on port ${PORT}...`);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;