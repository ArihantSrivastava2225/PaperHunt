import express from "express";
import {
    addResearchOpportunity,
    getResearchOpportunities,
    getNews,
    getAcademicResearchNews,
} from "../controllers/hots.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/research-opportunites/add", verifyToken, addResearchOpportunity);
router.get("/research-opportunities/get", verifyToken, getResearchOpportunities);
router.get("/news", getNews);
router.get("/academic-research-news", getAcademicResearchNews);

export default router;
