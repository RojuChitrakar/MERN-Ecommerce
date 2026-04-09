import Order from "../models/Order.js";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { cartItems, shippingAddress, paymentMethod, total } = req.body;

    console.log("CART ITEMS:", cartItems); // 🔥 DEBUG

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,

      // ✅ FIXED MAPPING
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

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ USER: GET MY ORDERS
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

// ✅ ADMIN: GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN: MARK AS DELIVERED
export const markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
