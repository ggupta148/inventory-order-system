import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOrders, createOrder, deleteOrder, getCustomers, getProducts } from "../api/client";
import OrderForm from "../components/OrderForm";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);

  async function load() {
    const [o, c, p] = await Promise.all([getOrders(), getCustomers(), getProducts()]);
    setOrders(o);
    setCustomers(c);
    setProducts(p);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(data) {
    try {
      await createOrder(data);
      toast.success("Order created");
      setShowForm(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error creating order");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Cancel this order?")) return;
    try {
      await deleteOrder(id);
      toast.success("Order cancelled");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error cancelling order");
    }
  }

  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c.full_name]));

  return (
    <div>
      <h1>Orders</h1>
      <button onClick={() => setShowForm(true)}>+ Create Order</button>
      {showForm && (
        <div style={{ margin: "1rem 0" }}>
          <OrderForm customers={customers} products={products} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={th}>ID</th><th style={th}>Customer</th><th style={th}>Total</th><th style={th}>Status</th><th style={th}>Date</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <>
              <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                <td style={td}>#{o.id}</td>
                <td style={td}>{customerMap[o.customer_id] || o.customer_id}</td>
                <td style={td}>${o.total_amount}</td>
                <td style={td}>{o.status}</td>
                <td style={td}>{new Date(o.created_at).toLocaleDateString()}</td>
                <td style={td} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleDelete(o.id)}>Cancel</button>
                </td>
              </tr>
              {expanded === o.id && (
                <tr key={`${o.id}-items`}>
                  <td colSpan={6} style={{ padding: "0.5rem 1rem", background: "#f9fafb" }}>
                    <strong>Items:</strong>
                    <ul style={{ margin: "0.25rem 0" }}>
                      {o.items.map((item) => (
                        <li key={item.id}>
                          Product #{item.product_id} — qty: {item.quantity} — unit price: ${item.unit_price}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" };
const td = { padding: "0.5rem", borderBottom: "1px solid #e5e7eb" };
