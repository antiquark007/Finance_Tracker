const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');


router.delete('/:_id', transactionController.deleteTransaction)
router.get('/', transactionController.getAllTransactions);
router.post('/', transactionController.createTransaction);
router.put('/:_id', transactionController.updateTransaction);

module.exports = router;