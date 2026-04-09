import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort } = req.query;

    let query = {};

    // 🔍 Search
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // 🗂️ Category
    if (category) {
      query.category = {
        $regex: category,
        $options: "i", // makes it case-insensitive
      };
    }
    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🔽 Sorting (MongoDB way)
    let sortOption = {};

    if (sort === "low") sortOption = { price: 1 };
    if (sort === "high") sortOption = { price: -1 };
    if (sort === "new") sortOption = { createdAt: -1 };

    const products = await Product.find(query).sort(sortOption);

    res.json(products);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔐 1. CHECK IF USER ALREADY REVIEWED
    const alreadyReviewed = product.reviewsData.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    // 📦 2. CHECK IF USER PURCHASED & RECEIVED PRODUCT
    const orders = await Order.find({ user: req.user._id });

    const hasPurchased = orders.some((order) =>
      order.items.some(
        (item) =>
          item.product.toString() === req.params.id &&
          order.status === "Delivered"
      )
    );

    if (!hasPurchased) {
      return res.status(400).json({
        message: "You can only review products you have purchased and received",
      });
    }

    // ⭐ 3. CREATE REVIEW
    const review = {
      user: req.user._id,
      name: req.user.fullName,
      rating: Number(rating),
      comment,
    };

    product.reviewsData.push(review);

    // 🔢 UPDATE STATS
    product.reviews = product.reviewsData.length;

    product.rating =
      product.reviewsData.reduce((acc, item) => acc + item.rating, 0) /
      product.reviewsData.length;

    await product.save();

    res.status(201).json({
      message: "Review added",
      reviewsData: product.reviewsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;

    const product = new Product({
      name,
      price,
      image,
      category,
      description,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.image = req.body.image || product.image;
      product.category = req.body.category || product.category;
      product.description = req.body.description || product.description;

      const updatedProduct = await product.save();

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};