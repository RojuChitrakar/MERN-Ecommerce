import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchProduct, setSearchProduct] = useState("");
  useEffect(() => {
    if (user === null) return;
    if (!user || !user.isAdmin) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/orders/full-stats");
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.isAdmin) fetchStats();
  }, [user]);

  const filteredProducts = stats?.productStats?.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-[#f8f4f1]">
      {/* 🔥 SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#fbf7f4] border-r p-6 flex flex-col z-50">
        <h2 className="text-xl font-serif text-gray-800 mb-8">
          ClayCove Admin
        </h2>

        <nav className="flex flex-col gap-3 text-sm">
          {["dashboard", "products", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2 rounded-full transition ${
                activeTab === tab
                  ? "bg-[#c07c52] text-white"
                  : "text-gray-700 hover:bg-[#efe7e2]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-auto bg-[#c07c52] text-white py-2 rounded-full"
        >
          Logout
        </button>
      </aside>

      {/* 🔥 MAIN */}
      <main className="flex-1 p-8 ml-64">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif capitalize text-gray-800">
            {activeTab}
          </h1>

          <p className="text-sm text-gray-600">{user?.fullName}</p>
        </div>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            {/* 🔥 STATS */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#fbf7f4] p-6 rounded-2xl shadow-sm">
                <p className="text-sm text-gray-500">Total Orders</p>
                <h2 className="text-2xl font-semibold mt-2">
                  {stats?.totalOrders || 0}
                </h2>
              </div>

              <div className="bg-[#fbf7f4] p-6 rounded-2xl shadow-sm">
                <p className="text-sm text-gray-500">Total Products</p>
                <h2 className="text-2xl font-semibold mt-2">
                  {stats?.totalProducts || 0}
                </h2>
              </div>

              <div className="bg-[#fbf7f4] p-6 rounded-2xl shadow-sm">
                <p className="text-sm text-gray-500">Total Sold</p>
                <h2 className="text-2xl font-semibold mt-2 text-[#c07c52]">
                  {stats?.totalSold || 0}
                </h2>
              </div>

              <div className="bg-[#fbf7f4] p-6 rounded-2xl shadow-sm">
                <p className="text-sm text-gray-500">Stock Remaining</p>
                <h2 className="text-2xl font-semibold mt-2">
                  {stats?.productStats
                    ? stats.productStats.reduce(
                        (acc, p) => acc + p.remaining,
                        0,
                      )
                    : 0}
                </h2>
              </div>
            </div>

            {/* 🔥 PRODUCT ANALYTICS */}
            <div className="bg-[#fbf7f4] mt-8 rounded-2xl shadow-sm">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-serif text-gray-800">
                  Product Analytics
                </h2>

                {/* 🔍 SEARCH */}
                <input
                  type="text"
                  placeholder="Search product..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="border px-3 py-2 rounded-full text-sm w-60 focus:outline-none focus:ring-1 focus:ring-[#c07c52]"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#efe7e2]">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-left">Stock</th>
                      <th className="p-3 text-left">Sold</th>
                      <th className="p-3 text-left">Remaining</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts?.map((p, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-3">{p.name}</td>
                        <td className="p-3">{p.stock}</td>
                        <td className="p-3 text-[#c07c52]">{p.sold}</td>
                        <td
                          className={`p-3 ${
                            p.remaining < 5 ? "text-red-500 font-medium" : ""
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

            {/* 🔥 CATEGORY STATS */}
            <div className="bg-[#fbf7f4] mt-8 rounded-2xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-serif text-gray-800">
                  Category Distribution
                </h2>
              </div>

              <div className="p-4 space-y-3">
                {Object.entries(stats?.categoryStats || {}).map(
                  ([cat, count]) => (
                    <div key={cat} className="flex justify-between text-sm">
                      <span className="capitalize">{cat}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ),
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
