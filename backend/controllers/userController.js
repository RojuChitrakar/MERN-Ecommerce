import User from "../models/User.js";

export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  const productId = req.params.id;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const exists = user.wishlist.includes(productId);

  if (exists) {
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId,
    );
  } else {
    user.wishlist.push(productId);
  }

  await user.save();

  res.json(user.wishlist);
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.json(user.wishlist);
};

export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const user = await User.findById(req.user._id);

    // 🔥 FIX: ensure cart exists
    if (!user.cart) {
      user.cart = [];
    }

    const exist = user.cart.find(
      (item) => item.product.toString() === productId,
    );

    if (exist) {
      exist.qty += qty;
    } else {
      user.cart.push({ product: productId, qty });
    }

    await user.save();

    const updatedUser = await User.findById(user._id).populate("cart.product");

    res.json(updatedUser.cart);
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");

  res.json(user.cart);
};

export const updateCartQty = async (req, res) => {
  const { qty } = req.body;
  const productId = req.params.id;

  const user = await User.findById(req.user._id);

  const item = user.cart.find((item) => item.product.toString() === productId);

  if (item) {
    item.qty = qty;
  }
  await user.save();

  const updatedUser = await User.findById(user._id).populate("cart.product");

  res.json(updatedUser.cart);
};

export const removeFromCart = async (req, res) => {
  const productId = req.params.id;

  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter((item) => item.product.toString() !== productId);

  await user.save();

  const updatedUser = await User.findById(user._id).populate("cart.product");

  res.json(updatedUser.cart);
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    user.address = {
      fullName: req.body.address?.fullName || "",
      phone: req.body.address?.phone || "",
      street: req.body.address?.street || "",
      city: req.body.address?.city || "",
      state: req.body.address?.state || "",
      postalCode: req.body.address?.postalCode || "",
      country: req.body.address?.country || "",
    };
    const updatedUser = await user.save();
    
    // 🔥 RETURN CLEAN USER OBJECT
    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address, // 🔥 THIS FIXES YOUR ISSUE
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  console.log("REQ BODY:", req.body);
};
