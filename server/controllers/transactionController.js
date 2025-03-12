const { ObjectId } = require('mongodb');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await req.db.collection('transactions').find().sort({ date: -1 }).toArray();
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { amount, description, date, type, category } = req.body;

    const result = await req.db.collection('transactions').insertOne({
      amount,
      description,
      date: new Date(date),
      type,
      category,
    });

    res.status(201).json({ message: 'Transaction created', id: result.insertedId });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};

// Update an existing transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, type, category } = req.body;

    const result = await req.db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          amount,
          description,
          date: new Date(date),
          type,
          category,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction updated' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await req.db.collection('transactions').deleteOne({ id });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};