import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/client";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setProducts(await getProducts());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(data) {
    try {
      await createProduct(data);
      toast.success("Product created");
      setShowForm(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error creating product");
    }
  }

  async function handleUpdate(data) {
    try {
      await updateProduct(editing.id, data);
      toast.success("Product updated");
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error updating product");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error deleting product");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditing(null); }}>+ Add Product</button>
      </div>

      {(showForm && !editing) && (
        <ProductForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}
      {editing && (
        <ProductForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
      )}

      <div className="table-card">
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading…</div>
        ) : products.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: "0.5rem" }}>📦</div>
            <div>No products yet. Add your first one!</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Created</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><code style={{ background: "#f1f5f9", padding: "0.1rem 0.4rem", borderRadius: 4, fontSize: 12 }}>{p.sku}</code></td>
                  <td>${parseFloat(p.price).toFixed(2)}</td>
                  <td>
                    <span style={{
                      background: p.quantity === 0 ? "#fee2e2" : p.quantity < 10 ? "#fef3c7" : "#dcfce7",
                      color: p.quantity === 0 ? "#991b1b" : p.quantity < 10 ? "#92400e" : "#166534",
                      padding: "0.15rem 0.6rem",
                      borderRadius: 999,
                      fontWeight: 600,
                      fontSize: 12,
                    }}>
                      {p.quantity}
                    </span>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button className="btn-edit" onClick={() => { setEditing(p); setShowForm(false); }}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
