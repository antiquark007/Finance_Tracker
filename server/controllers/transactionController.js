const Transaction = require('../models/transaction');

/**
 * Get all transactions
 * @route GET /api/transactions
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

/**
 * Create a new transaction
 * @route POST /api/transactions
 */
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();
    
    return res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ message: 'Failed to create transaction' });
  }
};

/**
 * Update an existing transaction
 * @route PUT /api/transactions/:id
 */
exports.updateTransaction = async (req, res) => {
  try {
    const { _id } = req.params;
    
    if (!_id) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({ message: 'Failed to update transaction' });
  }
};

/**
 * Delete a transaction
 * @route DELETE /api/transactions/:id
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const { _id } = req.params;
    
    if (!_id) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }
    
    const result = await Transaction.findOneAndDelete({ _id });
    
    if (!result) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    return res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return res.status(500).json({ message: 'Failed to delete transaction' });
  }
};