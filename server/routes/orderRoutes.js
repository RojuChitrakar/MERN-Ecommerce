import express from 'express';
import {addOrderItems,getMyOrders,getOrderById,updateOrderToPaid,updateOrderToDelivered} from "../controllers/orderController.js";
import {admin,protect} from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/",protect, addOrderItems);

router.get("/my",protect,getMyOrders);

router.get("/:id",protect,getOrderById);

router.put("/:id/pay",protect,updateOrderToPaid);

router.put("/:id/deliver", protect, admin, updateOrderToDelivered);


export default router;