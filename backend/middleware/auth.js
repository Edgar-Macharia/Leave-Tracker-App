require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {
  authenticateUser: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.APP_SECRET);

      req.user = {
        _id: decodedToken.userId, roles: decodedToken.roles, companyId: decodedToken.companyId,
      };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        error: 'Invalid token',
      });
    }
  },

  requireAdmin: (req, res, next) => {
    if (req.user.roles.includes('ADMIN')) {
      next();
    } else {
      res.status(403).json({
        error: 'No permissions to access this route',
      });
    }
  },

  requireLineManager: (req, res, next) => {
    if (req.user.roles.includes('LINE_MANAGER')) {
      next();
    } else {
      res.status(403).json({
        error: 'No permissions to access this route',
      });
    }
  }
};
