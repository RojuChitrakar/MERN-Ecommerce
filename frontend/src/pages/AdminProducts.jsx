import { useState } from "react";
import Navbar from "../components/Navbar";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-6">
        
        {/* 🟦 SIDEBAR */}
        <div className="bg-white p-5 rounded-xl shadow h-fit">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

          <div className="flex flex-col gap-3">
            
            <button
              onClick={() => setActiveTab("products")}
              className={`text-left px-3 py-2 rounded ${
                activeTab === "products"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              📦 Products
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`text-left px-3 py-2 rounded ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              🧾 Orders
            </button>

          </div>
        </div>

        {/* 🟩 CONTENT */}
        <div className="md:col-span-3">
          {activeTab === "products" && <AdminProducts />}
          {activeTab === "orders" && <AdminOrders />}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;