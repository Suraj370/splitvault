const { transactionService } = require("../services");

const createTransaction = async (req, res) => {
  const { subAccountId } = req.params;
  const { type, amount, description, destinationSubAccountId } = req.body;
  const userId = req.user.id; // Assuming authMiddleware sets req.user

  try {
    const transaction = await transactionService.createTransaction({
      subAccountId,
      type,
      amount,
      description,
      destinationSubAccountId,
      userId,
    });
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

const getTransactionsBySubAccount = async (req, res) => {
  const { subAccountId } = req.params;
  const userId = req.user.id;

  try {
    const transactions = await transactionService.getTransactionsBySubAccount(
      subAccountId,
      userId
    );
    res.status(200).json({ transactions });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

const getTransactionById = async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.user.id;

  try {
    const transaction = await transactionService.getTransactionById(
      transactionId,
      userId
    );
    res.status(200).json({ transaction });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactionsBySubAccount,
  getTransactionById,
};
