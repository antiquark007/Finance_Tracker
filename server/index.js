const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vedp5585:hacker69@cluster0.yx9ik.mongodb.net/finance-tracker?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('Connected to MongoDB');
    app.use((req, res, next) => {
      req.db = client.db();
      next();
    });

    // Routes
    app.use('/api/transactions', transactionRoutes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });