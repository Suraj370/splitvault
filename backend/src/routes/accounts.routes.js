const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const accountController = require('../controllers/accountController');

// Main Account Routes
router.post('/', authMiddleware, accountController.createMainAccount);
router.get('/', authMiddleware, accountController.getMainAccounts);
router.get('/:id', authMiddleware, accountController.getMainAccountById);

// Sub-Account Routes
router.post('/:mainAccountId/sub-accounts', authMiddleware, accountController.createSubAccount);
router.get('/:mainAccountId/sub-accounts', authMiddleware, accountController.getSubAccountsByMainAccountId);

module.exports = router;