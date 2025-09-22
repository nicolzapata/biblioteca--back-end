const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Log del body para POST/PUT (sin passwords)
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    const bodyLog = { ...req.body };
    if (bodyLog.password) bodyLog.password = '[HIDDEN]';
    console.log('Body:', JSON.stringify(bodyLog, null, 2));
  }

  next();
};

module.exports = logger;