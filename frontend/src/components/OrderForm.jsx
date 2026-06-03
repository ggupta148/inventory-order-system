import { useState } from "react";

export default function OrderForm({ customers, products, onSubmit, onCancel }) {
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: "" }]);
  const [error, setError] = useState("");

  function addItem() { setItems([...items, { product_id: "", quantity: "" }]); }
  function removeItem(i) { setItems(items.filter((_, idx) => idx !== i)); }
  function updateItem(i, field, value) {
    setItems(items.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
  }

  function submit(e) {
    e.preventDefault();
    if (!customerId) { setError("Please select a customer"); return; }
    if (items.length === 0) { setError("At least one item is required"); return; }
    for (const item of items) {
      if (!item.product_id || !item.quantity || Number(item.quantity) <= 0) {
        setError("Each item needs a product and quantity > 0");
        return;
      }
    }
    onSubmit({
      customer_id: Number(customerId),
      items: items.map((item) => ({ product_id: Number(item.product_id), quantity: Number(item.quantity) })),
    });
  }

  return (
    <form onSubmit={submit} className="form-panel">
      <h2 style={{ marginBottom: "1rem" }}>Create Order</h2>
      {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}

      <div style={{ marginBottom: "1rem" }}>
        <label>Customer</label>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select a customer…</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.full_name} — {c.email}</option>
          ))}
        </select>
      </div>

      <label style={{ marginBottom: "0.5rem", display: "block" }}>Order Items</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ flex: 3 }}>
              <select value={item.product_id} onChange={(e) => updateItem(i, "product_id", e.target.value)}>
                <option value="">Select product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                    {p.name} — ${p.price} (stock: {p.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                min={1}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
              />
            </div>
            {items.length > 1 && (
              <button type="button" className="btn-danger" style={{ padding: "0.45rem 0.65rem", flexShrink: 0 }} onClick={() => removeItem(i)}>✕</button>
            )}
          </div>
        ))}
      </div>

      <button type="button" className="btn-ghost" style={{ marginBottom: "1.25rem" }} onClick={addItem}>+ Add Item</button>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit" className="btn-primary">Place Order</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
