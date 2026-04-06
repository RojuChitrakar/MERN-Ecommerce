import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const liked = isInWishlist(product._id);
  const { addToCart } = useCart();
  console.log(product);
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-xl transition">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={product.image}
            className="w-full h-52 object-cover"
            alt={product.name}
          />

          {/* ❤️ HEART */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
          >
            <Heart
              size={18}
              className={`transition ${
                liked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* DETAILS */}
        <div className="p-4">
          <p className="text-sm text-gray-500 capitalize">{product.category}</p>

          <h3 className="font-semibold">{product.name}</h3>

          <p className="text-yellow-500 text-sm">
           ⭐ {averageRating} ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </p>

          <div className="flex justify-between items-center mt-3">
            <span className="font-bold">${product.price}</span>

            <button
              onClick={(e) => {
                e.preventDefault(); // ❗ stops Link navigation
                e.stopPropagation(); // ❗ stops bubbling
                addToCart(product);
              }}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              <ShoppingCart size={14} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
