import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-16">

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* 🔵 BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            ShopHub
          </h2>
          <p className="text-sm text-gray-600">
            Discover the best products across electronics, fashion, home, and more — all in one place.
          </p>
        </div>

        {/* 🟡 LINKS */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-600 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-blue-600 transition">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-blue-600 transition">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* 🟣 CATEGORIES */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">
            Categories
          </h3>
          <ul className="space-y-2 text-gray-600">
            {["electronics", "home", "beauty", "clothing", "others"].map(
              (cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat}`}
                    className="hover:text-blue-600 capitalize transition"
                  >
                    {cat}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* 🔴 SOCIAL */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">
            Follow Us
          </h3>

          <div className="flex gap-3">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, index) => (
                <div
                  key={index}
                  className="p-2 rounded-full bg-white shadow hover:shadow-md hover:text-blue-600 cursor-pointer transition"
                >
                  <Icon size={16} />
                </div>
              )
            )}
          </div>
        </div>

      </div>

      {/* 🔽 BOTTOM */}
      <div className="text-center py-4 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} ShopHub. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;