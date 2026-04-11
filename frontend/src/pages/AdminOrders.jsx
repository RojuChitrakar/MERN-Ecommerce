import { useEffect, useState } from "react";
import axios from "../utils/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/orders"); // ✅ correct
      setOrders(data);
    } catch (error) {
      console.error("ORDER FETCH ERROR:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDelivered = async (id) => {
    try {
      await axios.put(`/orders/${id}/deliver`);
      fetchOrders();
    } catch (error) {
      console.error("DELIVER ERROR:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🧾 Orders</h2>

      <div className="bg-white p-5 rounded-xl shadow">

        <div className="grid grid-cols-6 font-semibold border-b pb-2 mb-2">
          <span>User</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Status</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        {orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-6 items-center border-b py-2"
          >
            <span>{order.user?.name}</span>

            <span>₹{order.total}</span>

            <span>{order.paymentMethod}</span>

            <span>
              {order.isDelivered ? (
                <span className="text-green-600">Delivered</span>
              ) : (
                <span className="text-red-500">Pending</span>
              )}
            </span>

            <span>
              {new Date(order.createdAt).toLocaleDateString()}
            </span>

            <div>
              {!order.isDelivered && (
                <button
                  onClick={() => markDelivered(order._id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminOrders;