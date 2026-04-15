import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    rating: Number,
    comment: String,

    // 🔥 NEW: multiple images
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    // 🔥 MULTIPLE IMAGES
    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      required: true,
    },

    description: String,

    // 🔥 STOCK SYSTEM
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    reviewsData: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
