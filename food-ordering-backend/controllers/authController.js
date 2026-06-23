const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/tokenUtils');

// @route POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password, phone, address } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });

    const user = await User.create({ name, email, password, phone, address, isVerified: true });
    sendTokenResponse(user, 201, res, 'Registration successful! Welcome to Foodie 🎉');
  } catch (error) { next(error); }
};

// @route POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });

    sendTokenResponse(user, 200, res, 'Login successful!');
  } catch (error) { next(error); }
};

// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

// @route PUT /api/auth/update-profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, address }, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Profile updated.', data: user });
  } catch (error) { next(error); }
};

// @route PUT /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) { next(error); }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
