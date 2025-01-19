const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const rateLimiter = require('./middlewares/rateLimiter');
require('dotenv').config();

const app = express();

//Handle decpreciation warning
mongoose.set('strictQuery', false);

//Function to connect to MongoDB
const connectDB = async () => {
    try {
      // Add SSL/TLS options
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        retryWrites: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };
  
      // Force TLS version
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      
      const conn = await mongoose.connect(process.env.MONGODB_URI, options);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };

//connect to database with retry mechanism  
const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
    connectDB().catch(err => {
      console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
      setTimeout(connectWithRetry, 5000);
    });
  };
  
  connectWithRetry();

// Middleware
app.use(cors());
app.use(express.json());

app.use(rateLimiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    retryWrites: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

//Hnadle MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });
  
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

// Routes (to be implemented)
app.use('/api/auth', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/reports', require('./routes/reports'));

//Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 

//Handle unhandled promise rejection
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
  });