import express from "express";
import {
  getProducts,
  getProductById,
  addProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/:id/reviews", protect, addProductReview);

// 🔥 CREATE PRODUCT
router.post("/", protect, admin, upload.array("images", 5), createProduct);

// 🔥 UPDATE PRODUCT (FIXED)
router.put("/:id", protect, admin, upload.array("images", 5), updateProduct);

// DELETE
router.delete("/:id", protect, admin, deleteProduct);

export default router;