import express from 'express';
import { registerUser,loginUser } from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router=express.Router();

router.post("/register",registerUser);

router.post("/login",loginUser);

router.post("/product", protect, admin,createProduct);

export default router;