import { ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function WishlistCard({ product }) {
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // 🔥 MOVE TO CART FUNCTION
  const handleMoveToCart = () => {
    addToCart(product, 1);        // add to cart
    toggleWishlist(product);   // remove from wishlist
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">

      {/* IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
      />

      {/* DETAILS */}
      <div className="p-4">

        <p className="text-sm text-gray-500 capitalize">
          {product.category}
        </p>

        <h3 className="font-semibold text-lg">
          {product.name}
        </h3>

        <p className="text-yellow-500 text-sm mt-1">
          ⭐ {product.rating} ({product.reviews})
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-lg">
            ${product.price}
          </span>

          <span className="text-green-600 text-sm">
            In Stock
          </span>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-3 mt-4">

          {/* 🔵 ADD TO CART */}
          <button
            onClick={handleMoveToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingCart size={16} />
            Add
          </button>

          {/* 🔴 REMOVE */}
          <button
            onClick={() => toggleWishlist(product)}
            className="p-2 border rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 className="text-red-500" size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}

export default WishlistCard;