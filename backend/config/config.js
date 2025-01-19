require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.DB_URI,
  jwtSecret: process.env.JWT_SECRET,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    service: 'gmail'
  },
  corsOptions: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
}; 