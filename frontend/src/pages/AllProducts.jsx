import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import productsData from "../data/products";
import { Filter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function AllProducts() {
  const [products] = useState(productsData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  //  GET FROM URL
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");
  const searchFromURL = queryParams.get("search");

  //  SYNC CATEGORY + SEARCH
  useEffect(() => {
    if (categoryFromURL) {
      setCategory(categoryFromURL.toLowerCase());
    } else {
      setCategory("all");
    }

    if (searchFromURL) {
      setSearch(searchFromURL.toLowerCase());
    } else {
      setSearch("");
    }
  }, [categoryFromURL, searchFromURL]);

  useEffect(() => {
  if (
    location.state?.from === "footer" ||
    location.state?.from === "home"
  ) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [location]);

  // 🔍 FILTER LOGIC (UPDATED )
  const filteredProducts = products.filter((p) => {
    const searchText = search.toLowerCase();

    const matchSearch =
      p.name.toLowerCase().includes(searchText) ||
      p.description.toLowerCase().includes(searchText); //  NEW

    const matchCategory =
      category === "all" || p.category.toLowerCase() === category.toLowerCase();

    let matchPrice = true;
    if (price === "under50") matchPrice = p.price < 50;
    if (price === "50-100") matchPrice = p.price >= 50 && p.price <= 100;
    if (price === "100-200") matchPrice = p.price > 100 && p.price <= 200;
    if (price === "200+") matchPrice = p.price > 200;

    return matchSearch && matchCategory && matchPrice;
  });

  //  SORT
  let sortedProducts = [...filteredProducts];

  if (sort === "low") {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">All Products</h1>

        <p className="text-gray-500 mb-6">
          Showing {sortedProducts.length} products
        </p>

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <Filter size={16} />
            Filters
          </button>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="border px-4 py-2 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border px-4 py-2 rounded-lg"
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
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow mb-6 grid md:grid-cols-2 gap-10">
            {/* CATEGORY */}
            <div>
              <h3 className="font-semibold mb-3">Category</h3>

              <div className="flex flex-wrap gap-3">
                {[
                  "all",
                  "electronics",
                  "fashion",
                  "clothing",
                  "home",
                  "beauty",
                  "others",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      navigate(`/products?category=${cat}`);
                    }}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>

              <div className="space-y-2">
                {[
                  { label: "All Prices", value: "all" },
                  { label: "Under $50", value: "under50" },
                  { label: "$50 - $100", value: "50-100" },
                  { label: "$100 - $200", value: "100-200" },
                  { label: "Over $200", value: "200+" },
                ].map((p) => (
                  <label key={p.value} className="flex items-center gap-2">
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
        )}

        {/* PRODUCTS */}
        {sortedProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No products found 😔
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProducts;
