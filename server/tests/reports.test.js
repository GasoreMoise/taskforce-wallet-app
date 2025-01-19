const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const User = require('../models/User');
const { generateToken } = require('../services/authService');

describe('Report API', () => {
  let token;
  let userId;
  let categoryId;

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
    await Transaction.deleteMany({});
    
    // Create test transactions
    await Transaction.create([
      {
        user: userId,
        amount: 100,
        type: 'expense',
        category: categoryId,
        account: 'bank',
        date: new Date()
      },
      {
        user: userId,
        amount: 200,
        type: 'income',
        category: categoryId,
        account: 'bank',
        date: new Date()
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/reports/summary', () => {
    it('should get transaction summary', async () => {
      const res = await request(app)
        .get('/api/reports/summary')
        .query({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });

    it('should validate date range', async () => {
      const res = await request(app)
        .get('/api/reports/summary')
        .query({
          startDate: 'invalid-date',
          endDate: new Date()
        })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/reports/analytics/spending-trends', () => {
    it('should get spending trends', async () => {
      const res = await request(app)
        .get('/api/reports/analytics/spending-trends')
        .query({
          period: 'monthly',
          year: new Date().getFullYear()
        })
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('POST /api/reports/export', () => {
    it('should generate CSV export', async () => {
      const res = await request(app)
        .post('/api/reports/export')
        .set('Authorization', `Bearer ${token}`)
        .send({
          format: 'csv',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
    });

    it('should generate PDF export', async () => {
      const res = await request(app)
        .post('/api/reports/export')
        .set('Authorization', `Bearer ${token}`)
        .send({
          format: 'pdf',
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date()
        });

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/pdf');
    });
  });
}); 