import express from "express";
import { scoutOpportunities } from "../controllers/scout.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route will be mounted at /api/scout
router.post("/", verifyToken, scoutOpportunities);

export default router;
