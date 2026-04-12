import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/productApi";
import { Filter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");
  const searchFromURL = queryParams.get("search");

  useEffect(() => {
    if (categoryFromURL) setCategory(categoryFromURL.toLowerCase());
    else setCategory("all");

    if (searchFromURL) setSearch(searchFromURL.toLowerCase());
    else setSearch("");
  }, [categoryFromURL, searchFromURL]);

  useEffect(() => {
    if (location.state?.from === "footer" || location.state?.from === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  let minPrice = "";
  let maxPrice = "";

  if (price === "under1000") maxPrice = 1000;
  else if (price === "1000-3000") {
    minPrice = 1000;
    maxPrice = 3000;
  } else if (price === "3000-6000") {
    minPrice = 3000;
    maxPrice = 6000;
  } else if (price === "6000+") minPrice = 6000;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const data = await fetchProducts({
          keyword: search,
          category: category !== "all" ? category : "",
          sort,
          minPrice,
          maxPrice,
        });

        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, category, sort, price]);

  return (
    <div className="bg-[#f8f4f1] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-14">

        {/* HEADER */}
        <div className="mb-10 animate-fadeIn">
          <h1 className="text-4xl font-serif text-gray-800 mb-2">
            Explore Handmade Clay Creations
          </h1>
          <p className="text-gray-500 text-sm">
            Showing {products.length} handcrafted items
          </p>
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-[#efe7e2] px-5 py-2.5 rounded-full hover:scale-105 transition"
          >
            <Filter size={16} />
            Filters
          </button>

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Search clay items..."
              className="bg-white border border-gray-200 px-5 py-2.5 rounded-full focus:outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            showFilters ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-[#fbf7f4] p-8 rounded-2xl shadow-sm grid md:grid-cols-2 gap-10">

            {/* CATEGORY */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-700">
                Category
              </h3>

              <div className="flex flex-wrap gap-3">
                {[
                  "all",
                  "keyrings",
                  "incense holder",
                  "jewellery holder",
                  "planter",
                  "table decor",
                  "brush holder",
                  "fridge magnets",
                  "candle holder",
                  "others",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      navigate(`/products?category=${cat}`);
                    }}
                    className={`px-4 py-2 rounded-full capitalize transition ${
                      category === cat
                        ? "bg-[#c07c52] text-white shadow"
                        : "bg-[#efe7e2] hover:scale-105"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE (NPR) */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-700">
                Price Range
              </h3>

              <div className="space-y-3">
                {[
                  { label: "All Prices", value: "all" },
                  { label: "Under Rs 1000", value: "under1000" },
                  { label: "Rs 1000 - Rs 3000", value: "1000-3000" },
                  { label: "Rs 3000 - Rs 6000", value: "3000-6000" },
                  { label: "Above Rs 6000", value: "6000+" },
                ].map((p) => (
                  <label
                    key={p.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={price === p.value}
                      onChange={() => setPrice(p.value)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading beautiful clay creations...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products found
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <div
                key={product._id}
                className="animate-fadeUp"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default AllProducts;