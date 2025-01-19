const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { JWT_EXPIRES_IN } = require('../utils/constants');

class AuthService {
  static generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        throw new AppError('User no longer exists', 401);
      }
      
      return user;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }

  static async validateCredentials(email, password) {
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    
    return user;
  }

  static async resetPasswordRequest(email) {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new AppError('No user found with this email', 404);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    return resetToken;
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return user;
  }
}

module.exports = AuthService;