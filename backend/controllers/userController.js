const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // Prevent password update through this route
    if (req.body.password) {
      return next(new AppError('This route is not for password updates', 400));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
}; 