const { ValidationError, NotFoundError } = require("../utils/errors");
const prismaUtils = require("../utils/prismaUtils");

const accountService = {
  async createMainAccount({
    userId,
    accountName,
    currency,
    initialBalance = 0,
  }) {
    if (!userId || !accountName || !currency) {
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
        accountName,
        balance: parseFloat(initialBalance),
        currency,
        createdAt: new Date(),
      },
      select: {
        id: true,
        accountName: true,
        balance: true,
        currency: true,
        createdAt: true,
      },
    });

    return mainAccount;
  },

  async depositToMainAccount(accountId, amount) {


    if (!accountId || amount <= 0) {
      throw new ValidationError("Account ID and positive amount are required");
    }

    const prisma = prismaUtils.getClient();
    const mainAccount = await prisma.mainAccount.update({
      where: { id: accountId },
      data: { balance: { increment: parseFloat(amount) } },
      select: { id: true, balance: true },
    });

    if (!mainAccount) {
      throw new NotFoundError("Main account not found");
    }

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
            goalName: true,
            allocatedAmount: true,
            targetAmount: true,
          },
        },
      },
    });

    return mainAccounts;
  },

  async createSubAccount({
    mainAccountId,
    goalName,
    targetAmount,
    allocatedAmount = 0,
  }) {
    if (!mainAccountId || !goalName || !targetAmount) {
      throw new ValidationError(
        "Main account ID, goal name, and target amount are required"
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

    if (allocatedAmount > mainAccount.balance) {
      throw new ValidationError(
        "Allocated amount exceeds main account balance"
      );
    }

    const subAccount = await prisma.subAccount.create({
      data: {
        mainAccountId,
        goalName,
        allocatedAmount: parseFloat(allocatedAmount),
        targetAmount: parseFloat(targetAmount),
        createdAt: new Date(),
      },
      select: {
        id: true,
        goalName: true,
        allocatedAmount: true,
        targetAmount: true,
        createdAt: true,
      },
    });

    if (allocatedAmount > 0) {
      await prisma.mainAccount.update({
        where: { id: mainAccountId },
        data: { balance: mainAccount.balance - parseFloat(allocatedAmount) },
      });
    }

    return subAccount;
  },

  async allocateFunds(subAccountId, amount) {
    if (!subAccountId || amount === undefined) {
      throw new ValidationError("Sub-account ID and amount are required");
    }

    const prisma = prismaUtils.getClient();
    const subAccount = await prisma.subAccount.findUnique({
      where: { id: subAccountId },
      select: {
        id: true,
        allocatedAmount: true,
        mainAccount: { select: { id: true, balance: true } },
      },
    });
    if (!subAccount) {
      throw new NotFoundError("Sub-account not found");
    }

    const newAmount = parseFloat(amount);
    if (newAmount < 0) {
      throw new ValidationError("Amount must be non-negative");
    }

    const mainAccountBalance = subAccount.mainAccount.balance;
    if (newAmount > mainAccountBalance) {
      throw new ValidationError("Insufficient main account balance");
    }

    const updatedSubAccount = await prisma.subAccount.update({
      where: { id: subAccountId },
      data: { allocatedAmount: subAccount.allocatedAmount + newAmount },
      select: {
        id: true,
        goalName: true,
        allocatedAmount: true,
        targetAmount: true,
      },
    });

    await prisma.mainAccount.update({
      where: { id: subAccount.mainAccount.id },
      data: { balance: mainAccountBalance - newAmount },
    });

    return updatedSubAccount;
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
        goalName: true,
        allocatedAmount: true,
        targetAmount: true,
        createdAt: true,
      },
    });

    return subAccounts;
  },
};

module.exports = accountService;
