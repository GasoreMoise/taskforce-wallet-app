module.exports = {
    validUser: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    },
    
    invalidUser: {
      name: 'T',
      email: 'invalid-email',
      password: '123'
    },
    
    updateData: {
      name: 'Updated User',
      email: 'updated@example.com'
    },
    
    loginCredentials: {
      email: 'test@example.com',
      password: 'Password123!'
    },
    
    tokens: {
      valid: 'valid-jwt-token',
      expired: 'expired-jwt-token',
      invalid: 'invalid-token'
    }
  }; 