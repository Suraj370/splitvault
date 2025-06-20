const path = require("path");
const { accountService } = require("../services");
const { NotFoundError } = require("../utils/errors");

const accountController = {
  async createMainAccount(req, res) {
    try {
      const { accountName, currency, initialBalance } = req.body;

      const mainAccount = await accountService.createMainAccount({
        userId: req.user.id,
        accountName,
        currency,
        initialBalance,
      });
      res.status(201).json({ status: "success", data: mainAccount });
    } catch (error) {
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json({ status: "error", message: error.message });
    }
  },

  async depositToMainAccount(req, res) {
    try {
      const { amount } = req.body;
      const mainAccount = await accountService.depositToMainAccount(
        req.params.mainAccountId,
        amount
      );
      res.status(200).json({ status: "success", data: mainAccount });
    } catch (error) {
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json({ status: "error", message: error.message });
    }
  },

  async getMainAccounts(req, res) {
    try {
      const mainAccounts = await accountService.getMainAccountsByUserId(
        req.user.id
      );
      res.status(200).json({ status: "success", data: mainAccounts });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ status: "error", message: error.message });
    }
  },

  async getMainAccountById(req, res) {
    try {
      const mainAccounts = await accountService.getMainAccountsByUserId(
        req.user.id
      );
      const account = mainAccounts.find((acc) => acc.id === req.params.id);
      if (!account) {
        throw new NotFoundError("Main account not found");
      }
      res.status(200).json({ status: "success", data: account });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ status: "error", message: error.message });
    }
  },

  async createSubAccount(req, res) {
    try {
      const { goalName, targetAmount, allocatedAmount } = req.body;
      const subAccount = await accountService.createSubAccount({
        mainAccountId: req.params.mainAccountId,
        goalName,
        targetAmount,
        allocatedAmount,
      });
      res.status(201).json({ status: "success", data: subAccount });
    } catch (error) {
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json({ status: "error", message: error.message });
    }
  },

  async allocateFunds(req, res) {
    try {
      const { amount } = req.body;
      const subAccount = await accountService.allocateFunds(
        req.params.id,
        amount
      );
      res.status(200).json({ status: "success", data: subAccount });
    } catch (error) {
      const statusCode = error.statusCode || 400;
      res.status(statusCode).json({ status: "error", message: error.message });
    }
  },

  async getSubAccountsByMainAccountId(req, res) {
    try {
      const subAccounts = await accountService.getSubAccountsByMainAccountId(
        req.params.mainAccountId
      );
      res.status(200).json({ status: "success", data: subAccounts });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ status: "error", message: error.message });
    }
  },
};

module.exports = accountController;
