import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (user === null) return;

    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  // 📊 FETCH FULL STATS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/orders/full-stats");
        console.log("FULL STATS:", data);
        setStats(data);
      } catch (error) {
        console.error("Stats error:", error.response?.data || error.message);
      }
    };

    if (user?.isAdmin) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🟦 SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`text-left px-3 py-2 rounded ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            📊 Dashboard
          </button>

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

      {/* 🟩 MAIN CONTENT */}
      <div className="flex-1 p-6">
        {/* 🔝 TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* 📊 DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            {/* 🔥 TOP STATS */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="text-gray-500">Total Orders</h3>
                <p className="text-2xl font-bold">
                  {stats?.totalOrders || "..."}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="text-gray-500">Total Products</h3>
                <p className="text-2xl font-bold">
                  {stats?.totalProducts || "..."}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="text-gray-500">Total Sold</h3>
                <p className="text-2xl font-bold">
                  {stats?.totalSold || "..."}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="text-gray-500">Stock Remaining</h3>
                <p className="text-2xl font-bold">
                  {stats?.productStats
                    ? stats.productStats.reduce(
                        (acc, p) => acc + p.remaining,
                        0,
                      )
                    : "..."}
                </p>
              </div>
            </div>

            {/* 📦 PRODUCT ANALYTICS */}
            <div className="bg-white p-5 rounded-xl shadow mt-6">
              <h2 className="text-lg font-semibold mb-4">Product Analytics</h2>

              <div className="grid grid-cols-4 font-semibold border-b pb-2">
                <span>Product</span>
                <span>Stock</span>
                <span>Sold</span>
                <span>Remaining</span>
              </div>

              {stats?.productStats?.map((p, index) => (
                <div key={index} className="grid grid-cols-4 py-2 border-b">
                  <span>{p.name}</span>
                  <span>{p.stock}</span>
                  <span className="text-blue-600">{p.sold}</span>
                  <span
                    className={
                      p.remaining < 5 ? "text-red-500 font-semibold" : ""
                    }
                  >
                    {p.remaining}
                  </span>
                </div>
              ))}
            </div>

            {/* 📊 CATEGORY STATS */}
            <div className="bg-white p-5 rounded-xl shadow mt-6">
              <h2 className="text-lg font-semibold mb-4">
                Category Distribution
              </h2>

              {Object.entries(stats?.categoryStats || {}).map(
                ([cat, count]) => (
                  <div key={cat} className="flex justify-between border-b py-2">
                    <span>{cat}</span>
                    <span>{count} products</span>
                  </div>
                ),
              )}
            </div>
          </>
        )}

        {/* 📦 PRODUCTS */}
        {activeTab === "products" && <AdminProducts />}

        {/* 🧾 ORDERS */}
        {activeTab === "orders" && <AdminOrders />}
      </div>
    </div>
  );
}

export default AdminDashboard;
