const authMiddleware = async (req, res, next) => {
  console.log(`🔐 Verificando autenticación para ${req.method} ${req.path}`);
  if (req.session && req.session.user) {
    req.user = req.session.user;
    console.log(`✅ Usuario autenticado: ${req.user.name} (${req.user.role})`);
    return next();
  }

  console.log('❌ Sesión no válida o expirada');
  res.status(401).json({ message: 'Sesión no válida o expirada' });
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
