import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart, ShoppingCart } from "lucide-react";
import { fetchProductById, addReview } from "../api/productApi";

function ProductPage() {
  const { id } = useParams();
  const reviewRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductById(id);
      setProduct(data);
      setReviews(data.reviewsData || []);
    };
    loadProduct();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!newReview.comment) return;

    const data = await addReview(product._id, newReview);
    setReviews(data.reviewsData);

    setShowForm(false);
    setNewReview({ rating: 5, comment: "" });
  };

  if (!product) return <div className="p-10">Loading...</div>;

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;

  const liked = isInWishlist(product._id);

  return (
    <div className="bg-[#fdf8f6] min-h-screen animate-fadeIn">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* IMAGE */}
          <div className="overflow-hidden rounded-3xl shadow">
            <img
              src={product.image}
              className="w-full h-[450px] object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {/* DETAILS */}
          <div className="space-y-4">

            <p className="text-sm text-gray-400 uppercase">
              {product.category}
            </p>

            <h1 className="text-4xl font-semibold text-gray-800">
              {product.name}
            </h1>

            <p className="text-yellow-500 text-sm">
              ⭐ {averageRating} ({totalReviews} reviews)
            </p>

            <p className="text-3xl font-semibold text-gray-800">
              ₹{product.price}
            </p>

            <p className="text-gray-600 text-sm">
              {product.description}
            </p>

            {/* STOCK */}
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              In Stock
            </span>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 pt-4">

              {/* QTY */}
              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>

                <span className="px-4">{qty}</span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => addToCart(product, qty)}
                className="flex items-center gap-2 bg-[#c07c52] text-white px-6 py-3 rounded-full hover:scale-105 transition"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              {/* WISHLIST */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 border rounded-full hover:bg-gray-100 transition"
              >
                <Heart
                  className={
                    liked ? "text-[#c07c52] fill-[#c07c52]" : ""
                  }
                />
              </button>
            </div>

            {/* FEATURES */}
            <div className="text-sm text-gray-500 space-y-1 pt-4">
              <p>✔ Handmade with care</p>
              <p>✔ Eco-friendly materials</p>
              <p>✔ Unique artisan design</p>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-16">

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Customer Reviews
            </h2>

            <button
              onClick={() => {
                setShowForm(true);
                setTimeout(() => {
                  reviewRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }}
              className="bg-[#c07c52] text-white px-4 py-2 rounded-full hover:scale-105 transition"
            >
              Write a Review
            </button>
          </div>

          {/* FORM */}
          {showForm && (
            <div
              ref={reviewRef}
              className="bg-white p-5 rounded-2xl shadow mt-6 animate-fadeIn"
            >
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map((star)=>(
                  <span
                    key={star}
                    onClick={()=>setNewReview({...newReview, rating: star})}
                    className={`cursor-pointer text-2xl ${
                      star <= newReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Write your review..."
                className="w-full border px-3 py-2 rounded-lg mb-3"
                rows={3}
                value={newReview.comment}
                onChange={(e)=>setNewReview({...newReview, comment:e.target.value})}
              />

              <button
                onClick={handleSubmitReview}
                className="bg-[#c07c52] text-white px-4 py-2 rounded-full"
              >
                Submit Review
              </button>
            </div>
          )}

          {/* REVIEWS LIST */}
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {(showAllReviews ? reviews : reviews.slice(0,5)).map((r,i)=>(
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-medium">{r.name || "User"}</p>
                <p className="text-yellow-500 text-sm">⭐ {r.rating}</p>
                <p className="text-gray-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>

          {reviews.length > 5 && (
            <button
              onClick={()=>setShowAllReviews(!showAllReviews)}
              className="mt-4 text-[#c07c52]"
            >
              {showAllReviews ? "Show Less" : "Show All Reviews"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductPage;