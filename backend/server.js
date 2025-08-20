import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config()
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import metadataRoutes from "./routes/metadataRoutes.js";
console.log("GEMINI KEY IN SERVER.JS:", process.env.GEMINI_API_KEY);


const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/aura";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/metadata", metadataRoutes);

app.get("/", (req, res) => {
  res.json({ name: "Aura Backend", status: "running" });
});

async function connectToMongo() {
  try {
    await mongoose.connect(MONGODB_URI,{family:4});
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

async function start() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

start();


