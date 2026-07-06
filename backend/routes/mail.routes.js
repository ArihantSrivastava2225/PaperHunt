import express from "express";
import { sendFeedback } from "../controllers/mail.controller.js";

const router = express.Router();

router.post("/feedback", sendFeedback);

export default router;
