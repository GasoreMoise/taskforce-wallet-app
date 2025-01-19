const Redis = require('ioredis');
const { promisify } = require('util');

class CacheService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      keyPrefix: 'wallet:'
    });

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, expirySeconds = 3600) {
    try {
      await this.redis.set(
        key,
        JSON.stringify(value),
        'EX',
        expirySeconds
      );
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async clearUserCache(userId) {
    try {
      const keys = await this.redis.keys(`wallet:user:${userId}:*`);
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  generateKey(prefix, identifier) {
    return `${prefix}:${identifier}`;
  }
}

module.exports = new CacheService(); 