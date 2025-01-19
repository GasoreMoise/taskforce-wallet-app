const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

let mongod;

// Connect to the in-memory database before running tests
module.exports.connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.TEST_DB_URI = uri;

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

// Clear all test data after each test
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

// Remove and close the db and server
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

// Mock services
module.exports.mockServices = {
  emailService: {
    sendEmail: jest.fn().mockResolvedValue(true)
  },
  cacheService: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }
};

// Test user data
module.exports.testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!'
};

// Global test timeout
jest.setTimeout(30000); 