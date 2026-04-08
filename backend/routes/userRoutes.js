import { toggleWishlist, getWishlist } from "../controllers/userController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addToCart, updateCartQty, getCart, removeFromCart } from "../controllers/userController.js";

const router= express.Router();

router.post("/wishlist/:id", protect, toggleWishlist);

router.get("/wishlist", protect, getWishlist);

router.post("/cart", protect, addToCart);

router.get("/cart", protect, getCart);

router.put("/cart/:id", protect, updateCartQty);

router.delete("/cart/:id", protect, removeFromCart);

export default router;