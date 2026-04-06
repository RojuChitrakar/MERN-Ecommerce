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
