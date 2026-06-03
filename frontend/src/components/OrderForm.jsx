import { useState } from "react";

export default function OrderForm({ customers, products, onSubmit, onCancel }) {
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: "" }]);
  const [error, setError] = useState("");

  function addItem() {
    setItems([...items, { product_id: "", quantity: "" }]);
  }

  function removeItem(i) {
    setItems(items.filter((_, idx) => idx !== i));
  }

  function updateItem(i, field, value) {
    const updated = items.map((item, idx) => (idx === i ? { ...item, [field]: value } : item));
    setItems(updated);
  }

  function submit(e) {
    e.preventDefault();
    if (!customerId) {
      setError("Customer is required");
      return;
    }
    if (items.length === 0) {
      setError("At least one item is required");
      return;
    }
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
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 480 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
        ))}
      </select>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
          <select value={item.product_id} onChange={(e) => updateItem(i, "product_id", e.target.value)} style={{ flex: 2 }}>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => updateItem(i, "quantity", e.target.value)}
            style={{ flex: 1, width: 60 }}
          />
          {items.length > 1 && (
            <button type="button" onClick={() => removeItem(i)}>✕</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addItem}>+ Add Item</button>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit">Create Order</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
