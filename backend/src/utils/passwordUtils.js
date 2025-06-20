const bcrypt = require('bcrypt');

const passwordUtils = {
  async hashPassword(password) {
    if (!password) throw new Error('Password is required');
    return bcrypt.hash(password, 10);
  },

  async comparePassword(password, hashedPassword) {
    if (!password || !hashedPassword) throw new Error('Password and hashed password are required');
    return bcrypt.compare(password, hashedPassword);
  },
};

module.exports = passwordUtils;