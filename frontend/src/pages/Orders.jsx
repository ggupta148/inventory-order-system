import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOrders, createOrder, deleteOrder, getCustomers, getProducts } from "../api/client";
import OrderForm from "../components/OrderForm";

function statusBadge(status) {
  const map = {
    pending: "badge-pending",
    completed: "badge-completed",
    cancelled: "badge-cancelled",
  };
  return <span className={`badge ${map[status] || "badge-cancelled"}`}>{status}</span>;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [o, c, p] = await Promise.all([getOrders(), getCustomers(), getProducts()]);
    setOrders(o);
    setCustomers(c);
    setProducts(p);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(data) {
    try {
      await createOrder(data);
      toast.success("Order placed");
      setShowForm(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error creating order");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Cancel this order? Stock will be restored.")) return;
    try {
      await deleteOrder(id);
      toast.success("Order cancelled");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error cancelling order");
    }
  }

  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c.full_name]));
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  return (
    <div className="page">
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Create Order</button>
      </div>

      {showForm && (
        <OrderForm customers={customers} products={products} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <div className="table-card">
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading…</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: "0.5rem" }}>🛒</div>
            <div>No orders yet.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <>
                  <tr
                    key={o.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  >
                    <td style={{ fontWeight: 600, color: "#4f46e5" }}>#{o.id}</td>
                    <td style={{ fontWeight: 500 }}>{customerMap[o.customer_id] || `Customer #${o.customer_id}`}</td>
                    <td style={{ fontWeight: 600 }}>${parseFloat(o.total_amount).toFixed(2)}</td>
                    <td>{statusBadge(o.status)}</td>
                    <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="btn-danger" onClick={() => handleDelete(o.id)}>Cancel</button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr key={`${o.id}-items`}>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div style={{ background: "#f8fafc", padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Order Items
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {o.items.map((item) => (
                              <div key={item.id} style={{
                                display: "flex",
                                gap: "1rem",
                                padding: "0.5rem 0.75rem",
                                background: "#fff",
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                                alignItems: "center",
                                fontSize: 13,
                              }}>
                                <span style={{ fontWeight: 500, flex: 2 }}>{productMap[item.product_id] || `Product #${item.product_id}`}</span>
                                <span style={{ color: "#64748b" }}>Qty: <strong>{item.quantity}</strong></span>
                                <span style={{ color: "#64748b" }}>Unit: <strong>${parseFloat(item.unit_price).toFixed(2)}</strong></span>
                                <span style={{ marginLeft: "auto", fontWeight: 600 }}>
                                  ${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
