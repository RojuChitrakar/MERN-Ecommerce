import { CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  // 🔥 Get order ID (passed from checkout)
  const orderId =
    location.state?.orderId ||
    "#" + Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white p-10 rounded-xl shadow max-w-xl w-full text-center">

        {/* ✅ ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full">
            <CheckCircle className="text-green-600" size={40} />
          </div>
        </div>

        {/* ✅ TITLE */}
        <h1 className="text-2xl font-bold mb-3">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
          <br />
          You will receive an email confirmation shortly.
        </p>

        {/* 📦 ORDER ID */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-lg font-semibold mt-1">{orderId}</p>
        </div>

        {/* 🔘 BUTTONS */}
        <div className="flex justify-center gap-4">

          <Link to="/products">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Continue Shopping
            </button>
          </Link>

          <Link to="/">
            <button className="border px-6 py-3 rounded-lg hover:bg-gray-100 transition">
              Back to Home
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default OrderSuccess;