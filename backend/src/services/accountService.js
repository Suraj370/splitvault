const { ValidationError, NotFoundError } = require("../utils/errors");
const prismaUtils = require("../utils/prismaUtils");

const accountService = {
  async createMainAccount({ userId, name, currency, initialBalance = 0 }) {
    if (!userId || !name || !currency) {
      throw new ValidationError(
        "User ID, account name, and currency are required"
      );
    }

    const prisma = prismaUtils.getClient();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const mainAccount = await prisma.mainAccount.create({
      data: {
        userId,
        name,
        balance: parseFloat(initialBalance),
        currency,
        createdAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        balance: true,
        currency: true,
        createdAt: true,
      },
    });

    return mainAccount;
  },

  async getMainAccountsByUserId(userId) {
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    const prisma = prismaUtils.getClient();
    const mainAccounts = await prisma.mainAccount.findMany({
      where: { userId },
      include: {
        subAccounts: {
          select: {
            id: true,
            name: true,
            description: true,
            balance: true,
            targetAmount: true,
            scheme: true,
          },
        },
      },
    });

    return mainAccounts;
  },

  async createSubAccount({
    mainAccountId,
    name,
    targetAmount,
    scheme,
    balance = 0,
    description = "",
  }) {
    if (!name || !balance || !targetAmount || !description) {
      throw new ValidationError(
        "Main account ID, goal name, description and target amount are required"
      );
    }

    const prisma = prismaUtils.getClient();
    const mainAccount = await prisma.mainAccount.findUnique({
      where: { id: mainAccountId },
      select: { id: true, balance: true },
    });
    if (!mainAccount) {
      throw new NotFoundError("Main account not found");
    }

    if (balance > targetAmount) {
      balance = targetAmount;
    }

    if (balance > mainAccount.balance) {
      throw new ValidationError(
        "Allocated amount exceeds main account balance"
      );
    }

    const subAccount = await prisma.subAccount.create({
      data: {
        mainAccountId,
        name,
        scheme,
        description,
        balance: parseFloat(balance),
        targetAmount: parseFloat(targetAmount),
        createdAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        description: true,
        targetAmount: true,
        balance: true,
        createdAt: true,
      },
    });

    if (balance > 0) {
      await prisma.mainAccount.update({
        where: { id: mainAccountId },
        data: { balance: mainAccount.balance - parseFloat(balance) },
      });
    }

    return subAccount;
  },

  async getSubAccountsByMainAccountId(mainAccountId) {
    if (!mainAccountId) {
      throw new ValidationError("Main account ID is required");
    }

    const prisma = prismaUtils.getClient();
    const mainAccount = await prisma.mainAccount.findUnique({
      where: { id: mainAccountId },
      select: { id: true },
    });
    if (!mainAccount) {
      throw new NotFoundError("Main account not found");
    }

    const subAccounts = await prisma.subAccount.findMany({
      where: { mainAccountId },
      select: {
        id: true,
        name: true,
        description: true,
        balance: true,
        targetAmount: true,
        createdAt: true,
      },
    });

    return subAccounts;
  },
};

module.exports = accountService;
