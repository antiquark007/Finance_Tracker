const express = require('express');
const mongoose =require('mongoose')
const cors = require('cors');
const dotenv = require('dotenv').config();
const transactionRoutes = require('./src/routes/transactionRoutes');
const userRoutes =require('./src/routes/userRoutes');
const {protect}=require('./src/middleware/authMiddleware')

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "";

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
})
  .then(() => {
    console.log('Connected to MongoDB with Mongoose');

    // Routes
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/user', userRoutes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });