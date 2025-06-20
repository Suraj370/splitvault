const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});
const prismaUtils = {
  getClient: () => prisma,
  async disconnect() {
    await prisma.$disconnect();
  },
  async transaction(operations) {
    return prisma.$transaction(operations);
  },
};
module.exports = prismaUtils;