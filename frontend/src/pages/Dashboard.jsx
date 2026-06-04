import { useEffect, useState } from "react";
import { getProducts, getCustomers, getOrders } from "../api/client";

function StatCard({ label, value, icon, accent }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
      padding: "1.25rem 1.5rem",
      flex: "1 1 150px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: 10,
      }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${accent}18`,
          fontSize: 18,
        }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      </div>
      <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCustomers(), getOrders()]).then(([p, c, o]) => {
      setProducts(p);
      setCustomers(c);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  const lowStock = products.filter((p) => p.quantity < 10);
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

  if (loading) return <div className="page" style={{ color: "#64748b" }}>Loading…</div>;

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Total Products" value={products.length} icon="📦" accent="#4f46e5" />
        <StatCard label="Total Customers" value={customers.length} icon="👥" accent="#0ea5e9" />
        <StatCard label="Total Orders" value={orders.length} icon="🛒" accent="#22c55e" />
        <StatCard
          label="Low Stock Items"
          value={lowStock.length}
          icon="⚠️"
          accent={lowStock.length > 0 ? "#ef4444" : "#94a3b8"}
        />
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="💰"
          accent="#f59e0b"
        />
      </div>

      {lowStock.length > 0 && (
        <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
          <h2 style={{ marginBottom: "0.75rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            ⚠️ Low Stock Alert
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {lowStock.map((p) => (
              <div key={p.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.4rem",
                padding: "0.6rem 0.75rem",
                background: "#fff7f7",
                borderRadius: 8,
                border: "1px solid #fecaca",
              }}>
                <span style={{ fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{p.sku}</span>
                <span style={{
                  background: p.quantity === 0 ? "#fee2e2" : "#fef3c7",
                  color: p.quantity === 0 ? "#991b1b" : "#92400e",
                  padding: "0.15rem 0.6rem",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 12,
                }}>
                  {p.quantity === 0 ? "Out of stock" : `${p.quantity} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
