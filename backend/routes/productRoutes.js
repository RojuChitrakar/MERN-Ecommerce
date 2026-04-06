import express from "express";
import { getProducts, getProductById, addProductReview } from "../controllers/productController.js";
import {protect} from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/:id/reviews",protect,addProductReview);
export default router;