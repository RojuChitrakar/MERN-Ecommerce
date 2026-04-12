import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { fetchProducts } from "../api/productApi";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const featured = products.slice(0, 4);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.isAdmin) navigate("/admin");
  }, [user, navigate]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="bg-[#fdf8f6] min-h-screen">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT */}
        <div className="space-y-6 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-800 leading-tight">
            Handcrafted Clay Creations
          </h1>

          <p className="text-gray-600 text-lg">
            Each piece tells a story, shaped by hand with love and care
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#c07c52] text-white px-6 py-3 rounded-full shadow hover:scale-105 transition"
          >
            Explore Collection
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-lg animate-slideIn">
          <img
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"
            className="w-full h-[400px] object-cover"
          />
        </div>
      </section>

      {/* ================= QUOTE STRIP ================= */}
      <div className="bg-[#c07c52] text-white text-center py-4 text-sm tracking-wide">
        "The earth has music for those who listen"
      </div>

      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Shop by Category
        </h2>
        <p className="text-center text-gray-500 mb-10 text-sm">
          Find the perfect handcrafted piece for every need
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              name: "Keyrings",
              slug: "keyrings",
              image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400",
            },
            {
              name: "Planters",
              slug: "planter",
              image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400",
            },
            {
              name: "Jewellery Holder",
              slug: "jewellery holder",
              image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400",
            },
            {
              name: "Incense Holder",
              slug: "incense holder",
              image: "https://images.unsplash.com/photo-1603201667141-7f7b6c9b9b02?w=400",
            },
            {
              name: "Candle Holder",
              slug: "candle holder",
              image: "https://images.unsplash.com/photo-1602874801006-e26b8d8b6a5c?w=400",
            },
            {
              name: "Table Decor",
              slug: "table decor",
              image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400",
            },
            {
              name: "Fridge Magnets",
              slug: "fridge magnets",
              image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400",
            },
            {
              name: "Brush Holder",
              slug: "brush holder",
              image: "https://images.unsplash.com/photo-1585386959984-a41552231658?w=400",
            },
          ].map((cat) => (
            <div
              key={cat.name}
              onClick={() =>
                navigate(`/products?category=${cat.slug}`)
              }
              className="relative h-36 rounded-2xl overflow-hidden cursor-pointer group"
            >
              <img
                src={cat.image}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>

              <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STORY SECTION ================= */}
      <section className="bg-[#f7ebe8] py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          
          <img
            src="https://images.unsplash.com/photo-1590080877777-95b78c3c3c9f?w=600"
            className="rounded-2xl shadow"
          />

          <div>
            <p className="text-sm text-[#c07c52] mb-2">By Handmade</p>
            <h2 className="text-2xl font-semibold mb-4">
              Crafted with passion
            </h2>
            <p className="text-gray-600 text-sm">
              Every piece is lovingly shaped by skilled artisans, bringing
              warmth and character to your home. No two items are exactly alike.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl text-center font-semibold mb-2">
          Featured Items
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          Handpicked favorites from our collection
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition">
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL QUOTE ================= */}
      <div className="text-center py-12 text-sm text-gray-600">
        "Made by hand, treasured by heart"
      </div>

      <Footer />
    </div>
  );
}

export default Home;