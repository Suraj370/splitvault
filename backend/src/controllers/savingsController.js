const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSavingsAccount = async (req, res) => {
  try {
    const { userId, accounts } = req.body;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const savings = await prisma.savings.create({
      data: {
        userId,
        totalBalance,
        accounts: {
          create: accounts.map(account => ({
            schemeName: account.schemeName,
            balance: account.balance,
            allocationPercentage: account.allocationPercentage,
          })),
        },
      },
    });

    res.status(201).json(savings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create savings account' });
  }
};

const getSavingsAccounts = async (req, res) => {
  try {
    const savings = await prisma.savings.findFirst({
      where: { userId: req.params.userId },
      include: { accounts: true },
    });
    res.json(savings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch savings accounts' });
  }
};

module.exports = { createSavingsAccount, getSavingsAccounts };