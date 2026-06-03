import { useEffect, useState } from "react";
import { getProducts, getCustomers, getOrders } from "../api/client";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
    getCustomers().then(setCustomers);
    getOrders().then(setOrders);
  }, []);

  const lowStock = products.filter((p) => p.quantity < 10);

  const cardStyle = {
    padding: "1.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    minWidth: 160,
    background: "#f9fafb",
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{products.length}</div>
          <div>Total Products</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{customers.length}</div>
          <div>Total Customers</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{orders.length}</div>
          <div>Total Orders</div>
        </div>
        <div style={{ ...cardStyle, borderColor: lowStock.length > 0 ? "#f87171" : "#e5e7eb" }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: lowStock.length > 0 ? "#dc2626" : "inherit" }}>
            {lowStock.length}
          </div>
          <div>Low Stock (&lt;10)</div>
        </div>
      </div>
      {lowStock.length > 0 && (
        <div>
          <h2>Low Stock Products</h2>
          <ul>
            {lowStock.map((p) => (
              <li key={p.id}>{p.name} — {p.sku} — qty: {p.quantity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
