import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, Heart, ShoppingCart, User, ChevronDown } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const categories = [
  "keyrings",
  "incense holder",
  "jewellery holder",
  "planter",
  "table decor",
  "brush holder",
  "fridge magnets",
  "candle holder",
  "others",
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/products?search=${search}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fdf8f6] border-b">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-semibold text-[#d8a48f]"
        >
          {/* <img
            src="/clay-icon.png"
            alt="ClayCove"
            className="w-20 h-20 object-contain"
          /> */}
          <span>ClayCove</span>
        </Link>

        {/* CENTER */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="hover:text-[#d8a48f]">
            Home
          </NavLink>

          <NavLink to="/products" className="hover:text-[#d8a48f]">
            Shop
          </NavLink>

          {/* CATEGORIES */}
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="flex items-center gap-1 hover:text-[#d8a48f]"
            >
              Categories <ChevronDown size={16} />
            </button>

            {categoryOpen && (
              <div className="absolute top-10 bg-white rounded-2xl shadow-lg w-52 p-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    onClick={() => setCategoryOpen(false)}
                    className="block px-4 py-2 rounded-xl hover:bg-[#f7ebe8] capitalize"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 mx-8 max-w-md">
          <input
            type="text"
            placeholder="Search handmade items..."
            className="w-full bg-white border rounded-full px-4 py-2 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/wishlist" className="relative">
            <Heart />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d8a48f] text-white text-xs px-1.5 rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d8a48f] text-white text-xs px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          {/* PROFILE */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)}>
                <User />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow p-3">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-2 py-2 hover:bg-[#f7ebe8] rounded"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="block w-full text-left px-2 py-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>

        {/* MOBILE */}
        <button className="md:hidden" onClick={() => setMenuOpen(true)}>
          <Menu />
        </button>
      </div>
      {menuOpen && (
  <>
    {/* BACKDROP */}
    <div
      className="fixed inset-0 bg-black/30 z-40"
      onClick={() => setMenuOpen(false)}
    />

    {/* SIDE MENU */}
    <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 p-6 shadow-lg transform transition-transform duration-300">
      
      {/* CLOSE BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={() => setMenuOpen(false)}>
          <X size={24} />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex flex-col gap-5 text-base">

        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

        <Link to="/products" onClick={() => setMenuOpen(false)}>Shop</Link>

        {/* CATEGORIES DROPDOWN */}
        <div>
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex justify-between w-full"
          >
            Categories <ChevronDown size={16} />
          </button>

          {categoryOpen && (
            <div className="ml-3 mt-2 flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  onClick={() => {
                    setMenuOpen(false);
                    setCategoryOpen(false);
                  }}
                  className="capitalize text-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
          Wishlist
        </Link>

        <Link to="/cart" onClick={() => setMenuOpen(false)}>
          Cart
        </Link>

       {user ? (
  <Link to="/profile" onClick={() => setMenuOpen(false)}>
    Account ({user.name})
  </Link>
) : (
  <Link to="/login" onClick={() => setMenuOpen(false)}>
    Login / Sign Up
  </Link>
)}
      </div>
    </div>
  </>
)}
    </nav>
  );
}

export default Navbar;
