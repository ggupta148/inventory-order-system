import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCustomers, createCustomer, deleteCustomer } from "../api/client";
import CustomerForm from "../components/CustomerForm";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setCustomers(await getCustomers());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(data) {
    try {
      await createCustomer(data);
      toast.success("Customer created");
      setShowForm(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error creating customer");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error deleting customer");
    }
  }

  function initials(name) {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Customer</button>
      </div>

      {showForm && <CustomerForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />}

      <div className="table-card table-scroll">
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading…</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: "0.5rem" }}>👥</div>
            <div>No customers yet.</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Customer</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: "#eef2ff", color: "#4f46e5",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 12, flexShrink: 0,
                      }}>
                        {initials(c.full_name)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{c.full_name}</span>
                    </div>
                  </td>
                  <td style={{ color: "#64748b" }}>{c.email}</td>
                  <td style={{ color: "#64748b" }}>{c.phone || "—"}</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(c.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
