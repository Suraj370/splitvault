const { ValidationError, NotFoundError } = require("../utils/errors");
const prismaUtils = require("../utils/prismaUtils");

const transactionService = {
  async createTransaction({
    subAccountId,
    type,
    amount,
    description,
    destinationSubAccountId,
    userId,
  }) {
    if (!subAccountId || !type || !amount) {
      throw new ValidationError("Sub-account ID, type, and amount are required");
    }

    const validTypes = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'];
    if (!validTypes.includes(type)) {
      throw new ValidationError("Invalid transaction type");
    }

    if (amount <= 0) {
      throw new ValidationError("Amount must be greater than zero");
    }

    if (type === 'TRANSFER' && !destinationSubAccountId) {
      throw new ValidationError("Destination sub-account ID is required for TRANSFER");
    }

    const prisma = prismaUtils.getClient();

    // Check if source sub-account exists and belongs to the user
    const sourceSubAccount = await prisma.subAccount.findFirst({
      where: {
        id: subAccountId,
        mainAccount: {
          userId: userId,
        },
      },
      select: {
        id: true,
        allocatedAmount: true,
        mainAccount: {
          select: {
            id: true,
            balance: true,
            userId: true,
          },
        },
      },
    });

    if (!sourceSubAccount) {
      throw new NotFoundError("Source sub-account not found or unauthorized");
    }

    if ((type === 'WITHDRAWAL' || type === 'TRANSFER') && sourceSubAccount.allocatedAmount < amount) {
      throw new ValidationError("Insufficient funds in sub-account");
    }

    let destinationSubAccount;
    if (type === 'TRANSFER') {
      destinationSubAccount = await prisma.subAccount.findFirst({
        where: {
          id: destinationSubAccountId,
          mainAccount: {
            userId: userId,
          },
        },
        select: {
          id: true,
          allocatedAmount: true,
          mainAccount: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!destinationSubAccount) {
        throw new NotFoundError("Destination sub-account not found or unauthorized");
      }

      if (sourceSubAccount.id === destinationSubAccount.id) {
        throw new ValidationError("Source and destination sub-accounts must be different");
      }
    }

    const parsedAmount = parseFloat(amount);
    const transaction = await prisma.$transaction(async (prisma) => {
      const newTransaction = await prisma.transaction.create({
        data: {
          subAccountId,
          type,
          amount: parsedAmount,
          description,
          createdAt: new Date(),
        },
        select: {
          id: true,
          subAccountId: true,
          type: true,
          amount: true,
          description: true,
          createdAt: true,
        },
      });

      if (type === 'DEPOSIT') {
        await prisma.subAccount.update({
          where: { id: subAccountId },
          data: { allocatedAmount: sourceSubAccount.allocatedAmount + parsedAmount },
        });
        await prisma.mainAccount.update({
          where: { id: sourceSubAccount.mainAccount.id },
          data: { balance: sourceSubAccount.mainAccount.balance + parsedAmount },
        });
      } else if (type === 'WITHDRAWAL') {
        await prisma.subAccount.update({
          where: { id: subAccountId },
          data: { allocatedAmount: sourceSubAccount.allocatedAmount - parsedAmount },
        });
        await prisma.mainAccount.update({
          where: { id: sourceSubAccount.mainAccount.id },
          data: { balance: sourceSubAccount.mainAccount.balance - parsedAmount },
        });
      } else if (type === 'TRANSFER') {
        await prisma.subAccount.update({
          where: { id: subAccountId },
          data: { allocatedAmount: sourceSubAccount.allocatedAmount - parsedAmount },
        });
        await prisma.subAccount.update({
          where: { id: destinationSubAccountId },
          data: { allocatedAmount: destinationSubAccount.allocatedAmount + parsedAmount },
        });
      }

      return newTransaction;
    });

    return transaction;
  },

  async getTransactionsBySubAccount(subAccountId, userId) {
    if (!subAccountId || !userId) {
      throw new ValidationError("Sub-account ID and user ID are required");
    }

    const prisma = prismaUtils.getClient();
    const subAccount = await prisma.subAccount.findFirst({
      where: {
        id: subAccountId,
        mainAccount: {
          userId: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!subAccount) {
      throw new NotFoundError("Sub-account not found or unauthorized");
    }

    const transactions = await prisma.transaction.findMany({
      where: { subAccountId },
      select: {
        id: true,
        subAccountId: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions;
  },

  async getTransactionById(transactionId, userId) {
    if (!transactionId || !userId) {
      throw new ValidationError("Transaction ID and user ID are required");
    }

    const prisma = prismaUtils.getClient();
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        subAccount: {
          mainAccount: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        subAccountId: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true,
        subAccount: {
          select: {
            goalName: true,
            mainAccount: {
              select: {
                accountName: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundError("Transaction not found or unauthorized");
    }

    return transaction;
  },
};

module.exports = transactionService;