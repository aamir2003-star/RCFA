import { registerUser, loginUser } from '../services/auth.service.js';
import User from '../models/user/user.model.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';

// ─── Register ────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    // Map fullName to name if needed
    if (!req.body.name && req.body.fullName) {
      req.body.name = req.body.fullName;
    }
    const { user, accessToken, refreshToken } = await registerUser(req.body);
    const { password, ...safeUser } = user.toObject();

    res.status(201).json({
      message: 'User registered successfully',
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);
    const { password, ...safeUser } = user.toObject();

    res.json({
      message: 'Login successful',
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(new AppError(err.message, 401));
  }
};

// ─── Get Current User ────────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the authenticate middleware
    res.json({
      user: req.user,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ─── Refresh Token ───────────────────────────────────────────────────────────
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token required', 401));
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and validate stored refresh token
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token', 403));
    }

    // Issue new access token (and rotate refresh token)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(new AppError('Invalid or expired refresh token', 403));
  }
};

// ─── Logout ──────────────────────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('Refresh token required', 400));
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return next(new AppError('Invalid refresh token', 400));
    }

    user.refreshToken = null;
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

// ─── Update Profile ──────────────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    safeUser.id = user._id.toString();

    res.json({
      message: 'Profile updated successfully',
      user: safeUser,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

// ─── Update Avatar ───────────────────────────────────────────────────────────
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload an image', 400));
    }

    const userId = req.user._id;
    // Store relative path for frontend to serve
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    user.avatar = avatarPath;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    safeUser.id = user._id.toString();

    res.json({
      message: 'Avatar updated successfully',
      user: safeUser,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

