import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import path from "path";

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
  origin: "http://localhost:8080",   // frontend origin
  credentials: true,                 // allows cookies
}));



// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", libraryRoutes);
app.use("/api/hots", hotsRoutes);
app.use("/api/scout", scoutRoutes);
app.use("/api", paperRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
} else {
  app.get('/', (req, res) => {
    res.send("Welcome to PaperHunt");
  });
}

app.listen(PORT, () => {
  connectDB();
  connectRedis();
  console.log(`Server is running on port ${PORT}`);
});