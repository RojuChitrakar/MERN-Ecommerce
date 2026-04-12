import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { fetchProducts } from "../api/productApi";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const featured = products.slice(0, 8);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadProducts();
  }, []);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.isAdmin) navigate("/admin");
  }, [user, navigate]);

  return (
    <div className="bg-[#fdf8f6] min-h-screen">
      <Navbar />

      {/* 🌸 HERO */}
      <section className="bg-[#f7ebe8]">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-semibold text-gray-800 mb-6">
            Handmade with love, crafted in clay
          </h1>

          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Discover unique handmade clay creations designed to bring warmth,
            charm, and personality into your everyday spaces.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#d8a48f] text-white px-8 py-3 rounded-full shadow hover:scale-105 transition"
          >
            Explore Collection
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 🌼 QUOTE SECTION */}
      <div className="text-center py-16 px-6">
        <p className="text-xl italic text-gray-600 max-w-2xl mx-auto">
          “Every piece tells a story — shaped by hand, inspired by heart.”
        </p>
      </div>

      {/* 🪴 CATEGORIES */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Keyrings", slug: "keyrings", image: "clay keyrings handmade aesthetic" },
            { name: "Planters", slug: "planter", image: "small clay planters aesthetic" },
            { name: "Candle Holders", slug: "candle holder", image: "clay candle holders cozy" },
            { name: "Fridge Magnets", slug: "fridge magnets", image: "cute clay fridge magnets" },
            { name: "Jewellery Holder", slug: "jewellery holder", image: "clay jewellery holder aesthetic" },
            { name: "Incense Holder", slug: "incense holder", image: "clay incense holder aesthetic" },
            { name: "Brush Holder", slug: "brush holder", image: "clay brush holder desk aesthetic" },
            { name: "Table Decor", slug: "table decor", image: "clay table decor aesthetic" },
          ].map((cat) => (
            <div
              key={cat.name}
              onClick={() =>
                navigate(`/products?category=${cat.slug}`)
              }
              className="cursor-pointer text-center group"
            >
              <div className="w-full h-40 bg-gray-200 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition">
                <img
                  src={`https://source.unsplash.com/400x400/?${cat.image}`}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <p className="mt-3 text-sm text-gray-700 font-medium">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🌿 FEATURED */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            Featured Creations
          </h2>
          <p className="text-gray-500 mt-2">
            Handpicked pieces our customers love
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-3">
              <ProductCard key={product._id} product={product} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/products"
            className="bg-[#d8a48f] text-white px-6 py-3 rounded-full hover:scale-105 transition"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* 🌸 FINAL QUOTE */}
      <div className="bg-[#f7ebe8] py-16 text-center px-6">
        <p className="text-lg text-gray-600 italic max-w-xl mx-auto">
          Handmade pieces that make your space feel a little more like home.
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default Home;