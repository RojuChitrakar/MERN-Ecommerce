import express from 'express';
import { registerUser,loginUser } from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { createProduct } from '../controllers/productController.js';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/userController.js';

const router=express.Router();

router.post("/register",registerUser);

router.post("/login",loginUser);

router.post("/product", protect, admin,createProduct);

router.post("/wishlist/:id",protect,addToWishlist);

router.delete("/wishlist/:id",protect,removeFromWishlist);

router.get("/wishlist", protect, getWishlist);

export default router;