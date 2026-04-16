import { Link } from "react-router-dom";

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

function Footer() {
  return (
    <footer className="bg-[#f6eee9] mt-16 border-t border-[#eaded8]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {/* <img
              src="/clay-icon.png"
              alt="ClayCove"
              className="w-6 h-6 object-contain"
            /> */}
            <h2 className="text-xl font-serif text-[#c07c52]">ClayCove</h2>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Handmade clay creations crafted with care, bringing warmth and charm
            into your everyday life.
          </p>

          {/* INSTAGRAM */}
          <a
            href="https://instagram.com/rojuchitrakar"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 mt-4 text-sm text-gray-600 hover:text-[#c07c52] transition"
          >
            {/* Instagram SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M7.75 2C4.575 2 2 4.575 2 7.75v8.5C2 19.425 4.575 22 7.75 22h8.5C19.425 22 22 19.425 22 16.25v-8.5C22 4.575 19.425 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm8.75 1.5a.75.75 0 100 1.5.75.75 0 000-1.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
            @rojuchitrakar
          </a>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-800">Explore</h3>
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            <Link to="/" className="hover:text-[#c07c52] transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-[#c07c52] transition">
              Shop
            </Link>
            <Link to="/cart" className="hover:text-[#c07c52] transition">
              Cart
            </Link>
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-800">Categories</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="hover:text-[#c07c52] capitalize transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-xs text-gray-500 py-3 border-t border-[#eaded8]">
        © {new Date().getFullYear()} ClayCove • Handmade with care 🤍
      </div>
    </footer>
  );
}

export default Footer;
