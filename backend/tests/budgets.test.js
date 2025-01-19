const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Budget = require('../models/Budget');
const Category = require('../models/Category');
const User = require('../models/User');
const { generateToken } = require('../services/authService');

describe('Budget API', () => {
  let token;
  let userId;
  let categoryId;
  let testBudget;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI);
    
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: 'Password123!'
    });
    userId = user._id;
    token = generateToken(userId);

    // Create test category
    const category = await Category.create({
      name: 'Test Category',
      type: 'expense',
      user: userId
    });
    categoryId = category._id;
  });

  beforeEach(async () => {
    await Budget.deleteMany({});
    
    testBudget = await Budget.create({
      user: userId,
      category: categoryId,
      amount: 1000,
      period: 'monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/budgets', () => {
    it('should get all budgets for user', async () => {
      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBe(1);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/budgets');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/budgets', () => {
    it('should create a new budget', async () => {
      const newBudget = {
        category: categoryId,
        amount: 2000,
        period: 'monthly',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send(newBudget);

      expect(res.status).toBe(201);
      expect(res.body.data.amount).toBe(newBudget.amount);
      expect(res.body.data.period).toBe(newBudget.period);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/budgets/:id', () => {
    it('should update a budget', async () => {
      const update = { amount: 1500 };

      const res = await request(app)
        .patch(`/api/budgets/${testBudget._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body.data.amount).toBe(update.amount);
    });

    it('should not update budget of another user', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@test.com',
        password: 'Password123!'
      });
      const otherToken = generateToken(otherUser._id);

      const res = await request(app)
        .patch(`/api/budgets/${testBudget._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ amount: 1500 });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/budgets/alerts', () => {
    it('should get budget alerts', async () => {
      const res = await request(app)
        .get('/api/budgets/alerts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });
  });

  describe('DELETE /api/budgets/:id', () => {
    it('should delete a budget', async () => {
      const res = await request(app)
        .delete(`/api/budgets/${testBudget._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);

      const deletedBudget = await Budget.findById(testBudget._id);
      expect(deletedBudget).toBeNull();
    });
  });
}); 