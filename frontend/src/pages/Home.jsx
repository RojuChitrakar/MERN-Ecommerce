import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

function Home() {
  const navigate = useNavigate();

  const featured = products.slice(0, 8);
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 🔵 NAVBAR */}
      <Navbar />

      {/* 🟣 HERO BANNER */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl mb-6">Discover Amazing Products</h1>
            <p className="text-xl mb-8 text-blue-100">
              Shop the latest trends in electronics, fashion, sports, and home
              goods. Quality products at unbeatable prices.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 🟡 CATEGORIES SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {[
            {
              name: "Electronics",
              slug: "electronics",
              image:
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            },
            {
              name: "Home",
              slug: "home",
              image:
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            },
            {
              name: "Beauty",
              slug: "beauty",
              image:
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
            },
            {
              name: "Clothing",
              slug: "clothing",
              image:
                "https://images.unsplash.com/photo-1445205170230-053b83016050",
            },
            {
              name: "Others",
              slug: "others",
              image:
                "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a",
            },
          ].map((cat) => (
            <div
              key={cat.name}
              onClick={() =>
                navigate(`/products?category=${cat.slug}`, {
                  state: { from: "home" }, 
                })
              }
              className="relative rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition duration-300"
            >
              {/* IMAGE */}
              <img
                src={`${cat.image}?auto=format&fit=crop&w=800&q=100`}
                alt={cat.name}
                className="w-full h-56 object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-110"
              />

              {/* LIGHT GRADIENT OVERLAY (instead of dark dull overlay) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition duration-300"></div>

              {/* TEXT */}
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-lg font-semibold tracking-wide drop-shadow-md">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔵 EXTRA SECTION (OPTIONAL LOOK LIKE AMAZON) */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* 🔵 HEADER */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
          <p className="text-gray-500 mt-2">
            Check out our hand-picked selection of trending items
          </p>
        </div>

        {/* 🟡 GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* 🔘 BUTTON */}
        <div className="flex justify-center mt-12 ">
          <Link
            to="/products"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition group"
          >
            View All Products
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
