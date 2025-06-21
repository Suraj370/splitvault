const { ValidationError, NotFoundError } = require("../utils/errors");
const prismaUtils = require("../utils/prismaUtils");

const transactionService = {
  async createTransaction({
    type,
    amount,
    accountId,
    accountType,
    toAccountId,
    description = "",
  }) {
    if (!amount || amount <= 0) throw new Error("Amount must be positive");
    if (!type || !accountId || !accountType)
      throw new Error("Missing required fields");

    const prisma = prismaUtils.getClient();

    switch (type) {
      case "DEPOSIT":
        if (accountType !== "main")
          throw new Error("DEPOSIT allowed only on main accounts");
        break;

      case "WITHDRAWAL":
        if (!["main", "sub"].includes(accountType)) {
          throw new Error("WITHDRAWAL allowed only on main or sub accounts");
        }
        break;

      case "TRANSFER":
        if (accountType !== "sub")
          throw new Error("TRANSFER allowed only from sub accounts");
        if (!toAccountId) throw new Error("TRANSFER requires toAccountId");
        break;

      case "ALLOCATION":
        if (accountType !== "sub")
          throw new Error("ALLOCATION allowed only on sub accounts");
        break;

      default:
        throw new Error(`Invalid transaction type: ${type}`);
    }

    return await prisma.$transaction(async (tx) => {
      let fromAccountId = null;
      let actualToAccountId = null;

      if (type === "ALLOCATION") {
        const subAccount = await tx.subAccount.findUnique({
          where: { id: accountId },
          select: { mainAccountId: true },
        });

        if (!subAccount)
          throw new Error("Sub account not found for ALLOCATION");

        fromAccountId = subAccount.mainAccountId;
        actualToAccountId = accountId;

        // ✅ Check if main account has enough balance
        const mainAccount = await tx.mainAccount.findUnique({
          where: { id: fromAccountId },
          select: { balance: true },
        });

        if (mainAccount.balance < amount) {
          throw new Error(
            "Insufficient balance in main account for allocation"
          );
        }
      }

      if (type === "WITHDRAWAL") {
        const model = accountType === "main" ? tx.mainAccount : tx.subAccount;
        const account = await model.findUnique({
          where: { id: accountId },
          select: { balance: true },
        });

        if (!account) throw new Error("Account not found for withdrawal");

        if (account.balance < amount) {
          throw new Error("Insufficient balance for withdrawal");
        }
      }

      if (type === "TRANSFER") {
        const fromSubAccount = await tx.subAccount.findUnique({
          where: { id: accountId },
          select: { balance: true },
        });

        if (!fromSubAccount)
          throw new Error("Sub account not found for transfer");

        if (fromSubAccount.balance < amount) {
          throw new Error("Insufficient balance in sub account for transfer");
        }
      }

      const transaction = await tx.transaction.create({
        data: {
          type,
          amount,
          description,
          accountId,
          accountType,
          fromAccountId:
            type === "TRANSFER"
              ? accountId
              : type === "ALLOCATION"
              ? fromAccountId
              : undefined,
          toAccountId:
            type === "TRANSFER"
              ? toAccountId
              : type === "ALLOCATION"
              ? actualToAccountId
              : undefined,
        },
      });

      // === Balance Update Logic ===
      switch (type) {
        case "DEPOSIT":
          await tx.mainAccount.update({
            where: { id: accountId },
            data: { balance: { increment: amount } },
          });
          break;

        case "WITHDRAWAL":
          const withdrawModel =
            accountType === "main" ? tx.mainAccount : tx.subAccount;
          await withdrawModel.update({
            where: { id: accountId },
            data: { balance: { decrement: amount } },
          });
          break;

        case "TRANSFER":
          await tx.subAccount.update({
            where: { id: accountId },
            data: { balance: { decrement: amount } },
          });

          await tx.subAccount.update({
            where: { id: toAccountId },
            data: { balance: { increment: amount } },
          });
          break;

        case "ALLOCATION":
          await tx.mainAccount.update({
            where: { id: fromAccountId },
            data: { balance: { decrement: amount } },
          });

          await tx.subAccount.update({
            where: { id: accountId },
            data: { balance: { increment: amount } },
          });
          break;
      }

      return transaction;
    });
  },


  async getTransactionsByAccount(accountId) {
    try {
      const prisma = prismaUtils.getClient();

      const transactions = await prisma.transaction.findMany({
        where: {
          accountId: accountId,
          accountType: "sub",
        },
        orderBy: {
          timestamp: "desc",
        },
      });
      return transactions;
    } catch (error) {
      throw new ValidationError("Account ID is required");
    }
  },

  async getTransactionById(transactionId) {
    if (!transactionId) {
      throw new ValidationError("Transaction ID  is required");
    }

    const prisma = prismaUtils.getClient();
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        timestamp: true,
        accountId: true,
        accountType: true,
        fromAccountId: true,
        toAccountId: true,
      },
    });

    if (!transaction) {
      throw new NotFoundError("Transaction not found or unauthorized");
    }

    return transaction;
  },
};

module.exports = transactionService;
