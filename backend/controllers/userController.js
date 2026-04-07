import User from "../models/User.js"

export const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  const productId = req.params.id;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const exists = user.wishlist.includes(productId);

  if (exists) {
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
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