import express from "express";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllTransactions);
router.post("/", protect, createTransaction);
router.put("/:_id", protect, updateTransaction);
router.delete("/:_id", protect, deleteTransaction);

export default router;