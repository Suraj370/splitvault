const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post("/", authMiddleware, transactionController.createTransaction);

router.get('/subaccount/:accountid', authMiddleware, transactionController.getTransactionsByAccount);

router.get('/:transactionId', authMiddleware, transactionController.getTransactionById);

router.get('/subaccounts/:mainAccountId', authMiddleware, transactionController.getAllSubAccountTransactions);

module.exports = router;