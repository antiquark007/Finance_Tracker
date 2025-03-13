const Transaction = require('../models/transaction');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    const savedTransaction = await transaction.save();
    
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndUpdate(
      { id }, // Find by client-side ID field
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete transaction with id: ${id}`);
    
    if (!id) {
      return res.status(400).json({ message: 'Transaction ID is required' });
    }
    
    // Use Mongoose model to delete
    const result = await Transaction.findOneAndDelete({ id });
    
    if (!result) {
      console.log(`Transaction with id ${id} not found`);
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    console.log(`Successfully deleted transaction with id ${id}`);
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
};