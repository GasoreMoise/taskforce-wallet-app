const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Category = require('../models/Category');
const User = require('../models/User');
const { generateToken } = require('../services/authService');

describe('Category API', () => {
  let token;
  let userId;
  let testCategory;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI);
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: 'Password123!'
    });
    userId = user._id;
    token = generateToken(userId);
  });

  beforeEach(async () => {
    await Category.deleteMany({});
    
    testCategory = await Category.create({
      name: 'Test Category',
      type: 'expense',
      user: userId
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/categories', () => {
    it('should get all categories for user', async () => {
      const res = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toBe(1);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'New Category',
        type: 'income'
      };

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(newCategory);

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe(newCategory.name);
      expect(res.body.data.type).toBe(newCategory.type);
    });

    it('should validate category name', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'income' });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('should update a category', async () => {
      const update = { name: 'Updated Category' };

      const res = await request(app)
        .patch(`/api/categories/${testCategory._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(update.name);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const res = await request(app)
        .delete(`/api/categories/${testCategory._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);

      const deletedCategory = await Category.findById(testCategory._id);
      expect(deletedCategory).toBeNull();
    });
  });
}); 