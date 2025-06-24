
const { NotFoundError, ValidationError } = require('../utils/errors');
const jwtUtils = require('../utils/jwtUtils');
const prismaUtils = require('../utils/prismaUtils');


const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ValidationError('No token provided');
    }
    

    const token = authHeader.split(' ')[1];
    const decoded = jwtUtils.verifyToken(token);

    // Verify user exists
    const prisma = prismaUtils.getClient();
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    const statusCode = error instanceof NotFoundError || error instanceof ValidationError ? error.statusCode : 401;
    res.status(statusCode).json({ status: 'error', message: error.message });
  }
};

module.exports = authMiddleware;