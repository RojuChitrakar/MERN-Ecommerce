import Navbar from "../components/Navbar";
import { useWishlist } from "../context/WishlistContext";
import WishlistCard from "../components/WishlistCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-[#fdf8f6] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* TITLE */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-1">
          Your Wishlist
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {wishlist.length} items saved
        </p>

        {/* EMPTY */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24">
            <Heart size={80} className="text-gray-300 mb-6" />

            <h2 className="text-2xl font-medium text-gray-800 mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mb-6 max-w-md">
              Save items you love to revisit later
            </p>

            <Link to="/products">
              <button className="bg-[#c07c52] text-white px-6 py-3 rounded-full hover:scale-105 transition">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <WishlistCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default Wishlist;