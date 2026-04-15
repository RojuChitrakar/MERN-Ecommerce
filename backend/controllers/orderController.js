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

    // 🔥 STEP 1: FETCH ALL PRODUCTS ONCE
    const productIds = cartItems.map(
      (item) => item.product._id || item.product,
    );

    const products = await Product.find({ _id: { $in: productIds } });

    // 🔥 STEP 2: VALIDATE STOCK
    for (const item of cartItems) {
      const product = products.find(
        (p) =>
          p._id.toString() === (item.product._id || item.product).toString(),
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({
          message: `${product.name} only has ${product.countInStock} in stock`,
        });
      }
    }

    // 🔥 STEP 3: REDUCE STOCK
    for (const item of cartItems) {
      const product = products.find(
        (p) =>
          p._id.toString() === (item.product._id || item.product).toString(),
      );

      product.countInStock -= item.qty;
      await product.save();
    }

    // 🔥 STEP 4: CREATE ORDER AFTER VALIDATION
    const order = new Order({
      user: req.user._id,

      items: cartItems.map((item) => ({
        product: item.product._id || item.product,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        image: item.product?.images?.[0] || item.image || "",
        qty: item.qty,
      })),

      shippingAddress,
      paymentMethod,
      total,
    });

    const createdOrder = await order.save();

    // 🔥 STEP 5: CLEAR CART
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

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
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product") // 🔥 THIS LINE
      .sort({ createdAt: -1 });
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
      .populate("items.product") // 🔥 ADD THIS
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
      name: p.name,
      stock: p.stock,
      sold: p.sold,
      remaining: p.stock, // ✅ FIXED
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
