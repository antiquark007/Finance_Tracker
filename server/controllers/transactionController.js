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
    const { amount, description, date, type } = req.body;

    const transaction = new Transaction({
      amount,
      description,
      date,
      type,
      //category
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
    const { amount, description, date, type } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        amount,
        description,
        date,
        type,
        //category
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
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};