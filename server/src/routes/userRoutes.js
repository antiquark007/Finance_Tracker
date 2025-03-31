import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/current", protect, getCurrentUser);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;