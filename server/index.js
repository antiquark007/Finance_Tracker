import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());


app.use("/api/transactions", transactionRoutes);
app.use("/api/user", userRoutes);


const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(frontendPath, "index.html"));
});

mongoose
  .connect(MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB with Mongoose");
    app.listen(PORT, () => {
      console.log(`https://finance-tracker-08zz.onrender.com`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });