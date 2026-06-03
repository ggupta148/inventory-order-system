import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/client";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    setProducts(await getProducts());
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
    <div>
      <h1>Products</h1>
      <button onClick={() => { setShowForm(true); setEditing(null); }}>+ Add Product</button>
      {showForm && !editing && (
        <div style={{ margin: "1rem 0" }}>
          <ProductForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={th}>Name</th><th style={th}>SKU</th><th style={th}>Price</th><th style={th}>Stock</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.sku}</td>
              <td style={td}>${p.price}</td>
              <td style={td}>{p.quantity}</td>
              <td style={td}>
                {editing?.id === p.id ? (
                  <ProductForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
                ) : (
                  <>
                    <button onClick={() => { setEditing(p); setShowForm(false); }}>Edit</button>{" "}
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" };
const td = { padding: "0.5rem", borderBottom: "1px solid #e5e7eb", verticalAlign: "top" };
