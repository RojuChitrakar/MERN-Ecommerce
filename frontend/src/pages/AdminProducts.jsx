import { useEffect, useState } from "react";
import axios from "../utils/axios.js";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    countInStock: "",
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

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

  // 🔍 FILTER PRODUCTS
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 📸 HANDLE IMAGE SELECT
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const newPreview = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...newPreview]);
  };

  // ❌ REMOVE IMAGE
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // ➕ ADD PRODUCT
  const handleAdd = async () => {
    try {
      if (!form.name || !form.price) {
        alert("Fill required fields");
        return;
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("ADD ERROR:", error.response?.data || error.message);
    }
  };

  // ✏️ EDIT
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);

    setForm({
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      description: product.description || "",
      countInStock: product.countInStock || "",
    });

    setPreview(product.images || []);
    setImages([]);
  };

  // ✅ UPDATE PRODUCT
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.put(`/products/${editingProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error.message);
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await axios.delete(`/products/${id}`);
    fetchProducts();
  };

  // 🔄 RESET FORM
  const resetForm = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      category: "",
      description: "",
      countInStock: "",
    });
    setImages([]);
    setPreview([]);
  };

  return (
    <div className="p-6">

      {/* 🔵 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"> Products</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-64"
          />

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* 🔵 TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Images</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.countInStock}</td>

                <td className="p-3 flex gap-1">
                  {p.images?.slice(0, 2).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ))}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <div className="grid gap-3">
              <input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="border p-2 rounded"
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
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
                type="file"
                multiple
                onChange={handleImageChange}
                className="border p-2 rounded"
              />

              <div className="flex gap-2 flex-wrap">
                {preview.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="w-16 h-16 object-cover rounded border"
                    />

                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={editingProduct ? handleUpdate : handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;