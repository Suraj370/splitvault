const path = require("path");
const { accountService } = require("../services");
const { NotFoundError } = require("../utils/errors");

const accountController = {
  async createMainAccount(req, res) {
    try {
      const { name, currency, initialBalance } = req.body;

      const mainAccount = await accountService.createMainAccount({
        userId: req.user.id,
        name,
        currency,
        initialBalance,
      });
      res.status(201).json({ status: "success", data: mainAccount });
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
      const { name, targetAmount, balance, scheme, description} = req.body;
      const subAccount = await accountService.createSubAccount({
        mainAccountId: req.params.mainAccountId,
        name,
        targetAmount,
        scheme,
        balance,
        description
      });
      res.status(201).json({ status: "success", data: subAccount });
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
