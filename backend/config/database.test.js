const mongoose = require('mongoose');

const connectTestDB = async () => {
  try {
    const testURI = process.env.TEST_DB_URI || 'mongodb://localhost:27017/wallet_test';
    await mongoose.connect(testURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Test MongoDB connected successfully');
  } catch (error) {
    console.error('Test MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
};

const disconnectDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

module.exports = {
  connectTestDB,
  clearDatabase,
  disconnectDatabase
}; 