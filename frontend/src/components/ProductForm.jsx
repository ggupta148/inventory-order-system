import { useState } from "react";

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { name: "", sku: "", price: "", quantity: "" });
  const [error, setError] = useState("");

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.sku || form.price === "" || form.quantity === "") {
      setError("All fields are required");
      return;
    }
    if (Number(form.price) <= 0) { setError("Price must be greater than 0"); return; }
    if (Number(form.quantity) < 0) { setError("Quantity cannot be negative"); return; }
    onSubmit({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
  }

  return (
    <form onSubmit={submit} className="form-panel">
      <h2 style={{ marginBottom: "1rem" }}>{initial ? "Edit Product" : "Add Product"}</h2>
      {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}
      <div className="form-grid">
        <div>
          <label>Product Name</label>
          <input name="name" placeholder="e.g. Laptop Pro" value={form.name} onChange={handle} />
        </div>
        <div>
          <label>SKU</label>
          <input name="sku" placeholder="e.g. LAP-001" value={form.sku} onChange={handle} />
        </div>
        <div>
          <label>Price ($)</label>
          <input name="price" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={handle} />
        </div>
        <div>
          <label>Stock Quantity</label>
          <input name="quantity" type="number" placeholder="0" value={form.quantity} onChange={handle} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>
        <button type="submit" className="btn-primary">Save Product</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
