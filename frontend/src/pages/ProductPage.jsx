import { useParams } from "react-router-dom";
import products from "../data/products";
import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function ProductPage() {
  const reviewRef = useRef(null);
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]); // ✅ ADD id

  const product = products.find((p) => String(p.id) === String(id));

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [qty, setQty] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState(product.reviewsData || []);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.comment) return;

    const review = {
      ...newReview,
    };

    setReviews([review, ...reviews]); // add on top
    setShowForm(false);

    // reset form
    setNewReview({
      name: "",
      rating: 5,
      comment: "",
    });
  };
  if (!product) {
    return <h1>Product not found</h1>;
  }

  const liked = isInWishlist(product.id);

  // ⭐ LIMIT REVIEWS
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  // 🔥 RELATED PRODUCTS
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* 🔵 TOP SECTION */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* IMAGE */}
          <img
            src={product.image}
            className="w-full h-[450px] object-cover rounded-xl"
          />

          {/* DETAILS */}
          <div>
            <p className="text-sm text-gray-500 uppercase">
              {product.category}
            </p>

            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>

            {/* RATING */}
            <p className="text-yellow-500 mt-2">
              ⭐ {product.rating} ({product.reviews} reviews)
            </p>

            {/* PRICE */}
            <p className="text-3xl font-bold mt-4">${product.price}</p>

            {/* DESCRIPTION */}
            <p className="text-gray-600 mt-4">{product.description}</p>

            {/* STOCK */}
            <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 rounded">
              In Stock
            </span>

            {/* QTY + BUTTONS */}
            <div className="flex items-center gap-4 mt-6">
              {/* QTY */}
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1"
                >
                  -
                </button>

                <span className="px-4">{qty}</span>

                <button onClick={() => setQty(qty + 1)} className="px-3 py-1">
                  +
                </button>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => addToCart({ ...product, qty })}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              {/* WISHLIST */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 border rounded-lg"
              >
                <Heart className={liked ? "text-red-500 fill-red-500" : ""} />
              </button>
            </div>

            {/* FEATURES */}
            <div className="mt-6 space-y-2 text-gray-600 text-sm">
              <p>✔ Free shipping on orders over $50</p>
              <p>✔ 30-day return policy</p>
              <p>✔ Secure checkout</p>
            </div>
          </div>
        </div>

        {/* ⭐ REVIEWS */}
        <div className="mt-12">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Customer Reviews</h2>

            <button
              onClick={() => {
                setShowForm(true);

                setTimeout(() => {
                  reviewRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Write a Review
            </button>
          </div>
          {showForm && (
            <div ref={reviewRef} className="bg-white p-5 rounded-lg shadow mt-6">
              <h3 className="font-semibold mb-3">Write a Review</h3>

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border px-3 py-2 rounded mb-3"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
              />

              <select
                className="w-full border px-3 py-2 rounded mb-3"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: Number(e.target.value) })
                }
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Write your review..."
                className="w-full border px-3 py-2 rounded mb-3"
                rows={3}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
              />

              <button
                onClick={handleSubmitReview}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Review
              </button>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {displayedReviews?.map((r, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold">{r.name}</h3>

                <p className="text-yellow-500">⭐ {r.rating}</p>

                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* SHOW ALL BUTTON */}
          {product.reviewsData?.length > 5 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-4 text-blue-600"
            >
              {showAllReviews ? "Show Less" : "Show All Reviews"}
            </button>
          )}
        </div>

        {/* 🔥 RELATED PRODUCTS */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Related Products</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link to={`/product/${item.id}`}>
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
                  <img
                    src={item.image}
                    className="w-full h-40 object-cover rounded"
                  />

                  <h3 className="mt-2 font-medium">{item.name}</h3>

                  <p className="text-gray-600 text-sm">${item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
