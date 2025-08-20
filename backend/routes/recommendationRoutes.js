import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

// POST / - Get university recommendations based on user preferences
router.post("/", getRecommendations);

export default router;
