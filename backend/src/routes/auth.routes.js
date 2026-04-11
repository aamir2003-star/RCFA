import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  registerSchema,
  loginSchema,

} from "../validations/auth.validation.js";
import authenticate from "../middleware/authenticate.js";
import { getMe, refresh, logout, updateProfile } from "../controllers/auth.controller.js";
import { uploadAvatar } from "../utils/upload.utils.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
// Protected routes
router.get("/me", authenticate, getMe);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.put("/profile", authenticate, updateProfile);
// Avatar upload is now handled by upload.routes.js



export default router;
