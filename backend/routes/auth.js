import express from "express";
import { signup, login, oauthAuth } from "../controllers/authController.js";

const router = express.Router();

// POST /auth/signup
router.post("/signup", signup);

// POST /auth/login
router.post("/login", login);

// POST /auth/oauth (for Firebase/Google authentication)
router.post("/oauth", oauthAuth);

export default router;
