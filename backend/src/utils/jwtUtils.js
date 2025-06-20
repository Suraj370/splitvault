const jwt = require('jsonwebtoken');

const jwtUtils = {
  signToken(payload, expiresIn = '1h') {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  },

  verifyToken(token) {
    if (!token) {
      throw new Error('Token is required');
    }
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },
};

module.exports = jwtUtils;