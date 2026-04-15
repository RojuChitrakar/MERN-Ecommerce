import { CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OrderSuccess() {
  const location = useLocation();

  const orderId =
    location.state?.orderId ||
    "#" + Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="bg-[#f8f4f1] min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-16">

        <div className="max-w-xl w-full bg-[#fbf7f4] rounded-2xl shadow-sm p-10 text-center">

          {/* ✅ SUCCESS ICON */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#efe7e2] p-5 rounded-full">
              <CheckCircle className="text-[#c07c52]" size={36} />
            </div>
          </div>

          {/* ✅ TITLE */}
          <h1 className="text-3xl font-serif text-gray-800 mb-3">
            Order Confirmed
          </h1>

          <p className="text-gray-500 mb-6 text-sm">
            Your handmade clay items are being prepared with care.
          </p>

          {/* 📦 ORDER ID */}
          <div className="bg-white rounded-xl p-4 mb-8 shadow-sm">
            <p className="text-xs text-gray-400">Order Number</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {orderId}
            </p>
          </div>

          {/* 💌 THANK YOU CARD */}
          <div className="bg-[#f3ede8] rounded-xl p-6 mb-8 text-left">
            <h2 className="font-serif text-lg text-gray-800 mb-2">
              Thank You for Supporting Handmade
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              Each piece you’ve ordered is carefully handcrafted with love and attention to detail.  
              By choosing our creations, you’re supporting artistry, passion, and small craftsmanship.  
              <br /><br />
              We truly appreciate your trust in us.
            </p>

            <p className="mt-4 text-[#c07c52] text-sm font-medium">
              — ClayCove Studio
            </p>
          </div>

          {/* 🔘 ACTION BUTTONS */}
          <div className="flex flex-col gap-3">

            <Link to="/products">
              <button className="w-full bg-[#c07c52] text-white py-3 rounded-full hover:opacity-90 transition">
                Continue Shopping
              </button>
            </Link>

            <Link to="/">
              <button className="w-full border border-gray-300 py-3 rounded-full hover:bg-[#efe7e2] transition">
                Back to Home
              </button>
            </Link>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderSuccess;