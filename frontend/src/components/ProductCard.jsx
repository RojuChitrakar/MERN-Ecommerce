import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isOutOfStock = product.countInStock === 0;
  const liked = isInWishlist(product._id);

  const totalReviews = product.reviewsData?.length || 0;

  const averageRating =
    totalReviews > 0
      ? (
          product.reviewsData.reduce((acc, item) => acc + item.rating, 0) /
          totalReviews
        ).toFixed(1)
      : 0;

  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white rounded-2xl overflow-hidden group transition hover:shadow-lg">

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-56 object-cover transition duration-500 group-hover:scale-105"
          />

          {/* ❤️ WISHLIST */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:scale-110 transition"
          >
            <Heart
              size={16}
              className={`transition ${
                liked
                  ? "fill-[#c07c52] text-[#c07c52]"
                  : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* DETAILS */}
        <div className="p-4 space-y-2">

          {/* CATEGORY */}
          <p className="text-xs text-gray-400 capitalize">
            {product.category}
          </p>

          {/* NAME */}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
            {product.name}
          </h3>

          {/* RATING */}
          <p className="text-xs text-gray-500">
            ⭐ {averageRating} ({totalReviews})
          </p>

          {/* PRICE + BUTTON */}
          <div className="flex justify-between items-center mt-2">

            <span className="font-semibold text-gray-800">
              Rs {product.price}
            </span>

            <button disabled={isOutOfStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="flex items-center gap-1 bg-[#c07c52] text-white px-3 py-1.5 rounded-full text-xs hover:scale-105 transition"
            >
              <ShoppingCart size={14} />
               {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;