import Navbar from "../components/Navbar";
import { useWishlist } from "../context/WishlistContext";
import WishlistCard from "../components/WishlistCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            {/* ICON */}
            <Heart size={80} className="text-gray-300 mb-6" />

            {/* TITLE */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>

            {/* SUBTEXT */}
            <p className="text-gray-500 mb-6 max-w-md">
              Save items you love for later by adding them to your wishlist.
            </p>

            {/* BUTTON */}
            <Link to="/products">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
