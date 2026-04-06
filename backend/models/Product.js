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
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    category: String,
    description: String,
    rating: {
      type: String,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    reviewsData: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: String,
        rating: Number,
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
