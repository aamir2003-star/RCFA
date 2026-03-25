import { registerUser, loginUser } from "../services/auth.service.js";
import User from "../models/user/user.model.js";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import { AppError } from "../utils/AppError.js";

export const register = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(req.body);

    const { password, ...safeUser } = user.toObject();

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json({ message: "Login success" });
  } catch (err) {
    next(err); // 👈 send to global handler
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token required",
      });
    }

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(400).json({
        message: "Invalid refresh token",
      });
    }

    // Remove refresh token
    user.refreshToken = null;
    await user.save();

    res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


