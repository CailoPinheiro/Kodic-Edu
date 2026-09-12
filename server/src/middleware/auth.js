const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kodic_edu_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Access forbidden: requires ${role} role` });
    }
    next();
  };
}

function requireLeaderOrTeacher(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.user.role === 'teacher' || req.user.is_leader === 1) {
    return next();
  }

  return res.status(403).json({ error: 'Requires class leader or teacher privileges' });
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole,
  requireLeaderOrTeacher
};
