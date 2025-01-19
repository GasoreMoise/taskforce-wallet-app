const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { generateToken } = require('../services/authService');

describe('Transaction API', () => {
  let token;
  let userId;
  let testTransaction;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_DB_URI);
    
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: 'Password123!'
    });
    userId = user._id;
    token = generateToken(userId);
  });

  beforeEach(async () => {
    await Transaction.deleteMany({});
    
    // Create test transaction
    testTransaction = await Transaction.create({
      user: userId,
      amount: 100,
      type: 'expense',
      category: mongoose.Types.ObjectId(),
      account: 'bank',
      description: 'Test transaction'
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/transactions', () => {
    it('should get all transactions for user', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBe(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/transactions');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const newTransaction = {
        amount: 200,
        type: 'income',
        category: mongoose.Types.ObjectId(),
        account: 'cash',
        description: 'New test transaction'
      };

      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send(newTransaction);

      expect(res.status).toBe(201);
      expect(res.body.data.amount).toBe(newTransaction.amount);
      expect(res.body.data.type).toBe(newTransaction.type);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/transactions/:id', () => {
    it('should update a transaction', async () => {
      const update = { amount: 150 };

      const res = await request(app)
        .patch(`/api/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body.data.amount).toBe(update.amount);
    });

    it('should not update transaction of another user', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@test.com',
        password: 'Password123!'
      });
      const otherToken = generateToken(otherUser._id);

      const res = await request(app)
        .patch(`/api/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ amount: 150 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    it('should delete a transaction', async () => {
      const res = await request(app)
        .delete(`/api/transactions/${testTransaction._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);

      const deletedTransaction = await Transaction.findById(testTransaction._id);
      expect(deletedTransaction).toBeNull();
    });
  });
}); 