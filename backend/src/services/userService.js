const { ValidationError, NotFoundError } = require("../utils/errors");
const jwtUtils = require("../utils/jwtUtils");
const passwordUtils = require("../utils/passwordUtils");
const prismaUtils = require("../utils/prismaUtils");

const userService = {
  async register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new ValidationError('Name, email, and password are required');
    }

    const prisma = prismaUtils.getClient();
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    const hashedPassword = await passwordUtils.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: { id: true, name: true, email: true },
    });

    const accessToken = jwtUtils.signToken({ userId: user.id }, '15m');
    const refreshToken = jwtUtils.signToken({ userId: user.id }, '7d');

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { user, accessToken, refreshToken };
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const prisma = prismaUtils.getClient();
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValidPassword = await passwordUtils.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new ValidationError('Invalid credentials');
    }

    const accessToken = jwtUtils.signToken({ userId: user.id }, '15m');
    const refreshToken = jwtUtils.signToken({ userId: user.id }, '7d');

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { user: { id: user.id, name: user.name, email }, accessToken, refreshToken };
  },

  async getUserById(userId) {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const prisma = prismaUtils.getClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const prisma = prismaUtils.getClient();
    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new ValidationError('Invalid or expired refresh token');
    }

    try {
      const decoded = jwtUtils.verifyToken(refreshToken);
      if (decoded.userId !== storedToken.userId) {
        throw new ValidationError('Invalid refresh token');
      }

      const newAccessToken = jwtUtils.signToken({ userId: storedToken.userId }, '15m');
      const newRefreshToken = jwtUtils.signToken({ userId: storedToken.userId }, '7d');

      // Update refresh token in database
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      });

      return {
        user: storedToken.user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new ValidationError('Invalid refresh token');
    }
  },
};

module.exports = userService;