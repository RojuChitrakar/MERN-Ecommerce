import Product from "../models/Product.js";

/* =========================
   🔍 GET ALL PRODUCTS
========================= */
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
      query.category = { $regex: category, $options: "i" };
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 🔽 Sorting
    let sortOption = {};
    if (sort === "low") sortOption = { price: 1 };
    if (sort === "high") sortOption = { price: -1 };
    if (sort === "new") sortOption = { createdAt: -1 };

    const products = await Product.find(query).sort(sortOption);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   🔍 GET SINGLE PRODUCT
========================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ⭐ ADD REVIEW
========================= */
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviewsData.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      images: images || [],
    };

    product.reviewsData.push(review);

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
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ➕ CREATE PRODUCT (ADMIN)
========================= */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      images,
      countInStock,
    } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      images, // 🔥 array
      countInStock,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ✏️ UPDATE PRODUCT (ADMIN)
========================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name ?? product.name;
    product.price = req.body.price ?? product.price;
    product.description = req.body.description ?? product.description;
    product.category = req.body.category ?? product.category;
    product.images = req.body.images ?? product.images;
    product.countInStock =
      req.body.countInStock ?? product.countInStock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ❌ DELETE PRODUCT (ADMIN)
========================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product removed" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};