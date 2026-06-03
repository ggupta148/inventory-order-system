import { useState } from "react";

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial || { name: "", sku: "", price: "", quantity: "" }
  );
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
    if (Number(form.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }
    if (Number(form.quantity) < 0) {
      setError("Quantity cannot be negative");
      return;
    }
    onSubmit({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 360 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="name" placeholder="Name" value={form.name} onChange={handle} />
      <input name="sku" placeholder="SKU" value={form.sku} onChange={handle} />
      <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handle} />
      <input name="quantity" type="number" placeholder="Stock" value={form.quantity} onChange={handle} />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
