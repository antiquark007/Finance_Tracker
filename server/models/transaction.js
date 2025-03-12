const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Add client-side ID
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, default: 'uncategorized' },
});

module.exports = mongoose.model('Transaction', transactionSchema);