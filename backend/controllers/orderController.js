import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/* =========================
   ➕ CREATE ORDER
========================= */
export const createOrder = async (req, res) => {
  try {
    const { cartItems, shippingAddress, paymentMethod, total } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,

      items: cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        qty: item.qty,
      })),

      shippingAddress,
      paymentMethod,
      total,
    });

    const createdOrder = await order.save();

    await User.findByIdAndUpdate(req.user._id, {
      cart: [],
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   📦 USER: GET MY ORDERS
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   👑 ADMIN: GET ALL ORDERS
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    console.log("ORDERS:", JSON.stringify(orders, null, 2)); // 🔥 DEBUG

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   🚚 MARK ORDER DELIVERED
========================= */
export const markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.isDelivered) {
      return res.status(400).json({ message: "Order already delivered" });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();

    res.json({
      message: "Order marked as delivered",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("DELIVER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   📊 BASIC ADMIN STATS
========================= */
export const getAdminStats = async (req, res) => {
  try {
    const orders = await Order.find();

    const totalOrders = orders.length;
    const productStats = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (productStats[item.name]) {
          productStats[item.name] += item.qty;
        } else {
          productStats[item.name] = item.qty;
        }
      });
    });

    res.json({
      totalOrders,
      productStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   📊 FULL ADMIN DASHBOARD
========================= */
export const getFullAdminStats = async (req, res) => {
  try {
    const products = await Product.find();
    const orders = await Order.find();

    const totalOrders = orders.length;
    const totalProducts = products.length;

    let totalSold = 0;

    const productMap = {};
    const categoryMap = {};

    // 🧠 Initialize products
    products.forEach((p) => {
      productMap[p._id] = {
        name: p.name,
        stock: p.countInStock || 0,
        sold: 0,
      };

      if (categoryMap[p.category]) {
        categoryMap[p.category]++;
      } else {
        categoryMap[p.category] = 1;
      }
    });

    // 🧾 Process orders
    orders.forEach((order) => {
      order.items.forEach((item) => {
        totalSold += item.qty;

        if (productMap[item.product]) {
          productMap[item.product].sold += item.qty;
        }
      });
    });

    // 🔥 Final stats
    const productStats = Object.values(productMap).map((p) => ({
      ...p,
      remaining: p.stock - p.sold,
    }));

    res.json({
      totalOrders,
      totalProducts,
      totalSold,
      productStats,
      categoryStats: categoryMap,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
