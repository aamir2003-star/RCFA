import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  registerSchema,
  loginSchema,

} from "../validations/auth.validation.js";
import authenticate from "../middleware/authenticate.js";
import { getMe } from "../controllers/auth.controller.js";
import { refresh } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
// Protected route
router.get("/me", authenticate, getMe);
router.post("/refresh", refresh);
router.post("/logout", logout);


export default router;
