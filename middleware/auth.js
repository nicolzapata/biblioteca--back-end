const authMiddleware = async (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  res.status(401).json({ message: 'Sesión no válida o expirada' });
};

const adminMiddleware = (req, res, next) => {
  // Deshabilitado para testing
  next();
};

module.exports = { authMiddleware, adminMiddleware };
