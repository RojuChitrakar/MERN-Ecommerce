import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Heart, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const categories = ["electronics", "home", "beauty", "clothing", "others"];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/products?search=${search}`);
    }
  };
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b w-full ">
      <div className="w-full px-8 py-3 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-12">
          <NavLink to="/" className="text-2xl font-bold text-blue-600">
            ShopHub
          </NavLink>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              All Products
            </NavLink>

            {/* CATEGORY DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                Categories <ChevronDown size={16} />
              </button>

              {categoryOpen && (
                <div className="absolute top-10 left-0 bg-white shadow-lg rounded w-48 border z-50">
                  {categories.map((cat) => (
                    <NavLink
                      key={cat}
                      to={`/products?category=${cat}`}
                      onClick={() => setCategoryOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 capitalize ${
                          isActive
                            ? "bg-blue-100 text-blue-600 font-semibold"
                            : "hover:bg-gray-100"
                        }`
                      }
                    >
                      {cat}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 mx-10 max-w-2xl">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-full px-4 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-6 pr-2">
          <User className="cursor-pointer hover:text-blue-600" />
          <Link to="/wishlist" className="relative">
            <Heart className="cursor-pointer hover:text-blue-600" size={22} />

            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="cursor-pointer" />

            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
        </div>
      </div>

      {/* 📱 SIDE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold">ShopHub</h1>
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-4">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-full px-4 py-2"
          />

          {/* LINKS */}
          <div className="flex flex-col gap-4 mt-4">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              All Products
            </NavLink>

            <hr />

            {/* CATEGORIES */}
            <p className="text-gray-500">Categories</p>

            {categories.map((cat) => (
              <NavLink
                key={cat}
                to={`/products?category=${cat}`}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `capitalize px-2 py-1 rounded transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                {cat}
              </NavLink>
            ))}

            <hr />

            <p className="hover:text-blue-600 cursor-pointer">My Profile</p>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
