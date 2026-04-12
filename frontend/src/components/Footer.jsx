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
    <footer className="bg-[#f7ebe8] mt-16">

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-semibold text-[#d8a48f] mb-3">
            ClayCove
          </h2>
          <p className="text-sm text-gray-600">
            Handmade clay creations crafted with care, bringing warmth and charm
            into your everyday life.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="font-medium mb-3 text-gray-800">Explore</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#d8a48f]">Home</Link>
            <Link to="/products" className="hover:text-[#d8a48f]">Shop</Link>
            <Link to="/cart" className="hover:text-[#d8a48f]">Cart</Link>
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="font-medium mb-3 text-gray-800">Categories</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="hover:text-[#d8a48f] capitalize"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        © {new Date().getFullYear()} ClayCove. Handmade with care.
      </div>
    </footer>
  );
}

export default Footer;