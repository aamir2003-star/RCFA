import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  registerSchema,
  loginSchema,

} from "../validations/auth.validation.js";
import authenticate from "../middleware/authenticate.js";
import { getMe, refresh, logout, updateProfile, updateAvatar } from "../controllers/auth.controller.js";
import { uploadAvatar } from "../utils/upload.utils.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
// Protected routes
router.get("/me", authenticate, getMe);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.put("/profile", authenticate, updateProfile);
router.post("/avatar", authenticate, uploadAvatar.single('avatar'), updateAvatar);



export default router;
