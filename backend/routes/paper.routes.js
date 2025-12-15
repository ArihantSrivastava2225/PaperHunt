import express from "express";
import { searchPapers, summarizePaper } from "../controllers/paper.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/search", verifyToken, searchPapers);
router.post("/summary", verifyToken, summarizePaper);

export default router;
