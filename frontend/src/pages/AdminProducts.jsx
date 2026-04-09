import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    images: "",
    countInStock: "",
  });

  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
  try {
    const { data } = await axios.get("/products");
    setProducts(data);
  } catch (error) {
    console.error("FETCH ERROR:", error.response?.data || error.message);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ ADD PRODUCT
  const handleAdd = async () => {
    if (!form.name || !form.price) {
      alert("Fill required fields");
      return;
    }

    await axios.post("/products", {
      ...form,
      images: form.images.split(",").map((img) => img.trim()),
    });

    setForm({
      name: "",
      price: "",
      category: "",
      description: "",
      images: "",
      countInStock: "",
    });

    fetchProducts();
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await axios.delete(`/products/${id}`);
    fetchProducts();
  };

  // ✏️ OPEN EDIT
  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      images: product.images?.join(", "),
      countInStock: product.countInStock,
    });
  };

  // ✅ UPDATE PRODUCT
  const handleUpdate = async () => {
    await axios.put(`/products/${editingProduct._id}`, {
      ...form,
      images: form.images.split(",").map((img) => img.trim()),
    });

    setEditingProduct(null);

    setForm({
      name: "",
      price: "",
      category: "",
      description: "",
      images: "",
      countInStock: "",
    });

    fetchProducts();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📦 Manage Products</h2>

      {/* ================= ADD / EDIT FORM ================= */}
      <div className="bg-white p-5 rounded-xl shadow mb-6 grid gap-3">

        <input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Stock"
          value={form.countInStock}
          onChange={(e) =>
            setForm({ ...form, countInStock: e.target.value })
          }
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Image URLs (comma separated)"
          value={form.images}
          onChange={(e) =>
            setForm({ ...form, images: e.target.value })
          }
          className="border p-2 rounded"
        />

        {/* 🔥 BUTTON SWITCH */}
        {editingProduct ? (
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white py-2 rounded"
          >
            Update Product
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white py-2 rounded"
          >
            Add Product
          </button>
        )}
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <div className="bg-white p-5 rounded-xl shadow">

        <div className="grid grid-cols-5 font-semibold border-b pb-2 mb-2">
          <span>Name</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Images</span>
          <span>Actions</span>
        </div>

        {products.map((p) => (
          <div
            key={p._id}
            className="grid grid-cols-5 items-center border-b py-2"
          >
            <span>{p.name}</span>

            <span>${p.price}</span>

            <span>{p.countInStock}</span>

            {/* 🔥 IMAGE PREVIEW */}
            <div className="flex gap-1">
              {p.images?.slice(0, 2).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="w-10 h-10 object-cover rounded"
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminProducts;