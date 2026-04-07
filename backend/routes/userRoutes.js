import { toggleWishlist, getWishlist } from "../controllers/userController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router= express.Router();

router.post("/wishlist/:id", protect, toggleWishlist);


router.get("/wishlist", protect, getWishlist);

export default router;