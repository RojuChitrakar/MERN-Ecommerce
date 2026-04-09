import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  markDelivered,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { getAdminStats } from "../controllers/orderController.js";

const router = express.Router();

// USER
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

// ADMIN
router.get("/", protect, admin, getAllOrders);
router.put("/:id/deliver", protect, admin, markDelivered);
router.get("/stats", protect, admin, getAdminStats);

export default router;