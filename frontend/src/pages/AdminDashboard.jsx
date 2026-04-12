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
    if (!user || !user.isAdmin) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  // 📊 FETCH STATS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/orders/full-stats");
        setStats(data);
      } catch (error) {
        console.error("Stats error:", error.message);
      }
    };

    if (user?.isAdmin) fetchStats();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Admin Dashboard
          </h2>
        </div>

        <nav className="flex flex-col p-4 gap-2 text-sm">
          {["dashboard", "products", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2 rounded-lg transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold capitalize">
            {activeTab}
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {user?.fullName || user?.name}
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="border px-4 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            {/* STATS CARDS */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <p className="text-sm text-gray-500">Total Orders</p>
                <h2 className="text-2xl font-semibold mt-1">
                  {stats?.totalOrders || 0}
                </h2>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <p className="text-sm text-gray-500">Total Products</p>
                <h2 className="text-2xl font-semibold mt-1">
                  {stats?.totalProducts || 0}
                </h2>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <p className="text-sm text-gray-500">Total Sold</p>
                <h2 className="text-2xl font-semibold mt-1 text-blue-600">
                  {stats?.totalSold || 0}
                </h2>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <p className="text-sm text-gray-500">Stock Remaining</p>
                <h2 className="text-2xl font-semibold mt-1">
                  {stats?.productStats
                    ? stats.productStats.reduce(
                        (acc, p) => acc + p.remaining,
                        0
                      )
                    : 0}
                </h2>
              </div>
            </div>

            {/* PRODUCT ANALYTICS TABLE */}
            <div className="bg-white mt-6 rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">
                  Product Analytics
                </h2>
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Sold</th>
                      <th className="p-3 text-left">Remaining</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats?.productStats?.map((p, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-3">{p.name}</td>
                        <td className="p-3">{p.stock}</td>
                        <td className="p-3 text-blue-600">{p.sold}</td>
                        <td
                          className={`p-3 ${
                            p.remaining < 5
                              ? "text-red-500 font-medium"
                              : ""
                          }`}
                        >
                          {p.remaining}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CATEGORY STATS */}
            <div className="bg-white mt-6 rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">
                  Category Distribution
                </h2>
              </div>

              <div className="p-4 space-y-3">
                {Object.entries(stats?.categoryStats || {}).map(
                  ([cat, count]) => (
                    <div
                      key={cat}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-700">{cat}</span>
                      <span className="font-medium">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* PRODUCTS */}
        {activeTab === "products" && <AdminProducts />}

        {/* ORDERS */}
        {activeTab === "orders" && <AdminOrders />}
      </main>
    </div>
  );
}

export default AdminDashboard;