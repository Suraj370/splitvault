const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new transaction (DEPOSIT, WITHDRAWAL, or TRANSFER)
router.post('/:subAccountId', authMiddleware, transactionController.createTransaction);

// Get all transactions for a specific sub-account
router.get('/subaccount/:subAccountId', authMiddleware, transactionController.getTransactionsBySubAccount);

// Get a specific transaction by ID
router.get('/:transactionId', authMiddleware, transactionController.getTransactionById);

module.exports = router;