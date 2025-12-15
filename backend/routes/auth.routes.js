import express from "express";
import { signup, signin, signout, validateToken } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", verifyToken, signout);
router.get("/validate", validateToken);

export default router;
