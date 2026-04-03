import Navbar from "../components/Navbar";
import { useWishlist } from "../context/WishlistContext";
import WishlistCard from "../components/WishlistCard";

function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-500">No items in wishlist 😔</p>
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
