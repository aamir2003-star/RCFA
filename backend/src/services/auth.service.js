import bcrypt from "bcrypt";
import User from "../models/user/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
  });

  // 🔥 Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token and set online status
  user.refreshToken = refreshToken;
  user.isOnline = true;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  user.isOnline = true;
  await user.save();

  return { user, accessToken, refreshToken };
};
