const express = require('express');
const router = express.Router();
const { createSavingsAccount, getSavingsAccounts } = require('../controllers/savingsController');

router.post('/', createSavingsAccount);
router.get('/:userId', getSavingsAccounts);

module.exports = router;