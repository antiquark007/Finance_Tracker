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
    const { amount, description, date, type,category } = req.body;
    console.log(category);

    const transaction = new Transaction({
      amount,
      description,
      date,
      type,
      category,
    });

    const savedTransaction = await transaction.save();
    res.status(201).json({ message: 'Transaction created', id: savedTransaction._id });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};

// Update an existing transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, type,category } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        amount,
        description,
        date,
        type,
        category,
      },
      { new: true } // Return the updated document
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction updated', transaction });
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
      console.log('No ID parameter provided');
      return res.status(400).json({ message: 'No ID parameter provided' });
    }
    
    // Use the correct way to query based on your schema
    // If using Mongoose:
    // const result = await Transaction.findOneAndDelete({ id: id });
    
    // If using MongoDB driver directly:
    const result = await req.db.collection('transactions').deleteOne({ id: id });
    
    console.log('Delete result:', result);
    
    if (result.deletedCount === 0) {
      console.log(`Transaction with id ${id} not found`);
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    console.log(`Successfully deleted transaction with id ${id}`);
    return res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return res.status(500).json({ 
      message: 'Failed to delete transaction', 
      error: error.message 
    });
  }
};