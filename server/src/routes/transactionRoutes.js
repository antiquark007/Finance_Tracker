const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, transactionController.getAllTransactions);
router.post("/", protect, transactionController.createTransaction);
router.put("/:_id", protect, transactionController.updateTransaction);
router.delete("/:_id", protect, transactionController.deleteTransaction);

module.exports = router;