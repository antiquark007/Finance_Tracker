const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Make sure this DELETE route is defined correctly
router.delete('/:id', transactionController.deleteTransaction);
router.get('/', transactionController.getAllTransactions);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);

module.exports = router;