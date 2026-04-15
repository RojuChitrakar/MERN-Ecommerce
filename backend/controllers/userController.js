import User from "../models/User.js";
import Product from "../models/Product.js"
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 GET PRODUCT
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 OUT OF STOCK CHECK
    if (product.countInStock === 0) {
      return res.status(400).json({
        message: "Product is out of stock",
      });
    }

    // 🔥 FIND EXISTING ITEM
    const exist = user.cart.find(
      (item) => item.product.toString() === productId
    );

    const currentQty = exist ? exist.qty : 0;
    const newQty = currentQty + qty;

    // 🔥 STOCK LIMIT CHECK
    if (newQty > product.countInStock) {
      return res.status(400).json({
        message: `Only ${product.countInStock} items available`,
      });
    }

    // 🔥 UPDATE CART
    if (exist) {
      exist.qty = newQty;
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
  const user = await User.findById(req.user._id)
  .populate({
    path: "cart.product",
    select: "name price images countInStock",
  });

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
    console.log("REQ BODY:", req.body);

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // 🔥 FIXED ADDRESS MERGE
    user.address = {
      fullName: req.body.address?.fullName || user.address?.fullName || "",
      phone: req.body.address?.phone || user.address?.phone || "",
      street: req.body.address?.street || user.address?.street || "",
      city: req.body.address?.city || user.address?.city || "",
      state: req.body.address?.state || user.address?.state || "",
      postalCode: req.body.address?.postalCode || user.address?.postalCode || "",
      country: req.body.address?.country || user.address?.country || "",
    };

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      isAdmin: updatedUser.isAdmin,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};