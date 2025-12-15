import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";

import authRoutes from "./routes/auth.routes.js";
import libraryRoutes from "./routes/library.routes.js";
import hotsRoutes from "./routes/hots.routes.js";
import scoutRoutes from "./routes/scout.routes.js";
import paperRoutes from "./routes/paper.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:8080",   // your frontend origin
  credentials: true,                 // 👈 allows cookies
}));

app.get('/', (req, res) => {
  res.send("Welcome to PaperHunt");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", libraryRoutes);
app.use("/api/hots", hotsRoutes);
app.use("/api/scout", scoutRoutes);
app.use("/api", paperRoutes);

app.listen(PORT, () => {
  connectDB();
  connectRedis();
  console.log(`Server is running on port ${PORT}`);
});