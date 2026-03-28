import exppress from 'express';
import {getProducts, getProductById, createProduct, updateProduct, deleteProduct} from "../controllers/productController.js";
import { admin, protect } from '../middleware/authMiddleware.js';

const router=exppress.Router();

router.get("/",getProducts);
router.get("/:id",getProductById);

router.post("/",protect,admin,createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id",protect, admin, deleteProduct);

export default router;