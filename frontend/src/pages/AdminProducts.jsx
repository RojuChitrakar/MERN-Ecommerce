import { useEffect, useState } from "react";
import API from "../api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (error) {
      console.error("FETCH ERROR:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 FILTER
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // 📸 IMAGE SELECT
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const newPreview = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => [...prev, ...newPreview]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  // ➕ ADD
  const handleAdd = async () => {
    try {
      setLoading(true);
      setSuccess("");

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((img) => formData.append("images", img));

      const { data } = await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ SUCCESS FLOW
      setSuccess("Product added successfully!");

      resetForm();
      fetchProducts();

      // 🔥 auto close after 1s
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ EDIT
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);

    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      countInStock: product.countInStock,
    });

    setPreview(product.images || []);
    setImages([]);
  };

  // ✅ UPDATE
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((img) => formData.append("images", img));

      await API.put(`/products/${editingProduct._id}`, formData);

      resetForm();
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await API.delete(`/products/${id}`);
    fetchProducts();
  };

  // 🔄 RESET
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
    <div className="p-6 bg-[#f8f4f1] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-gray-800">Products</h2>

        <div className="flex gap-3">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full border bg-white"
          />
          {success && (
            <p className="text-green-600 text-sm mt-2 text-center">{success}</p>
          )}

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-[#c07c52] text-white px-4 py-2 rounded-full"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#efe7e2] text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Images</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p._id} className="border-t hover:bg-[#faf7f4]">
                  <td className="p-3 font-medium">{p.name}</td>

                  <td className="p-3 text-[#c07c52] font-medium">
                    Rs {p.price}
                  </td>

                  <td className="p-3">
                    {p.countInStock > 0 ? (
                      <span className="text-green-600">
                        {p.countInStock} In Stock
                      </span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2">
                    {p.images?.slice(0, 3).map((img, i) => (
                      <img
                        key={i}
                        src={img || "https://via.placeholder.com/100"}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ))}
                  </td>

                  <td className="p-3 flex gap-3">
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-[#fbf7f4] p-6 rounded-2xl w-[520px] shadow-lg">
            <h2 className="text-xl font-serif mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <div className="grid gap-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />

              <input
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input"
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input"
              >
                <option value="">Select Category</option>
                <option value="keyrings">Keyrings</option>
                <option value="incense holder">Incense Holder</option>
                <option value="jewellery holder">Jewellery Holder</option>
                <option value="planter">Planter</option>
                <option value="table decor">Table Decor</option>
                <option value="brush holder">Brush Holder</option>
                <option value="fridge magnets">Fridge Magnets</option>
                <option value="candle holder">Candle Holder</option>
                <option value="others">Others</option>
              </select>

              <input
                placeholder="Stock"
                value={form.countInStock}
                onChange={(e) =>
                  setForm({ ...form, countInStock: e.target.value })
                }
                className="input"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input"
              />

              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="input"
              />

              {/* PREVIEW */}
              <div className="flex gap-2 flex-wrap">
                {preview.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="w-16 h-16 rounded-xl object-cover"
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
                disabled={loading}
                className="bg-[#c07c52] text-white px-4 py-2 rounded-full disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded-full"
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
