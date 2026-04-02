import { Heart, ShoppingCart } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group transition duration-300 hover:shadow-xl hover:-translate-y-2">

      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover transition duration-500 group-hover:scale-110"
        />

        {/* ❤️ WISHLIST */}
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow opacity-80 hover:opacity-100 hover:scale-110 transition">
          <Heart size={16} />
        </button>
      </div>

      {/* DETAILS */}
      <div className="p-4">

        {/* CATEGORY */}
        <p className="text-xs text-gray-500 capitalize mb-1">
          {product.category}
        </p>

        {/* NAME */}
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition">
          {product.name}
        </h3>

        {/* RATING */}
        <p className="text-sm text-yellow-500 mb-2">
          ⭐ {product.rating} ({product.reviews} reviews)
        </p>

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between mt-3">

          <span className="font-bold text-gray-900">
            ${product.price}
          </span>

          <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm transition duration-300 hover:bg-blue-700 hover:scale-105">
            <ShoppingCart size={14} />
            Add
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;