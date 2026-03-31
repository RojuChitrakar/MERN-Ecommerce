import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const getDashboardStats=async (req,res)=>{
  try{
    const totalUsers=await User.countDocuments();
    const totalProducts= await Product.countDocuments();
    const totalOrders= await Order.countDocuments();

    const orders=await Order.find();

    const totalRevenue= orders.reduce((acc,order)=>acc+order.totalPrice,0);

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    });
  }catch(error){
    console.error(error);
    res.status(500).json({message:"Server Error"});
    
  }
}