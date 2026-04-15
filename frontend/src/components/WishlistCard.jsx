import { ShoppingCart, X } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function WishlistCard({ product }) {
   if (!product) return null;
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (e) => {
    e.preventDefault(); // 🔥 STOP navigation
    e.stopPropagation();

    addToCart(product, 1);
    toggleWishlist(product);
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer">

        {/* IMAGE */}
        <div className="relative">
          <img
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => (e.target.src = "/placeholder.png")}
          />

          {/* REMOVE */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur p-1.5 rounded-full shadow hover:scale-110 transition"
          >
            <X size={14} />
          </button>

          {/* OUT OF STOCK */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded-full text-xs shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="p-4 space-y-2">

          <h3 className="text-sm font-medium text-gray-800">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600">
            Rs {product.price}
          </p>

          {/* BUTTON */}
          {isOutOfStock ? (
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full bg-gray-200 text-gray-500 py-2 rounded-full text-sm"
            >
              Notify When Available
            </button>
          ) : (
            <button disabled={isOutOfStock}
              onClick={handleMoveToCart}
              className="w-full flex items-center justify-center gap-2 bg-[#c07c52] text-white py-2 rounded-full text-sm hover:scale-105 transition"
            >
              <ShoppingCart size={14} />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default WishlistCard;