const { transactionService } = require("../services");

const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      accountId,
      accountType,
      toAccountId,
      description = "",
    } = req.body;

    const transaction = await transactionService.createTransaction({
      type,
      amount,
      accountId,
      accountType,
      toAccountId,
      description,
    });
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

const getTransactionsByAccount = async (req, res) => {
  const { accountId } = req.params;

  try {
    const transactions = await transactionService.getTransactionsByAccount(
      accountId
    );
    res.status(200).json({ transactions });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

const getTransactionById = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await transactionService.getTransactionById(
      transactionId,
      req.user.id
    );
    res.status(200).json({ transaction });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactionsByAccount,
  getTransactionById,
};
