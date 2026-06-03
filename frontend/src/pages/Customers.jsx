import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCustomers, createCustomer, deleteCustomer } from "../api/client";
import CustomerForm from "../components/CustomerForm";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setCustomers(await getCustomers());
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

  return (
    <div>
      <h1>Customers</h1>
      <button onClick={() => setShowForm(true)}>+ Add Customer</button>
      {showForm && (
        <div style={{ margin: "1rem 0" }}>
          <CustomerForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={th}>Name</th><th style={th}>Email</th><th style={th}>Phone</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td style={td}>{c.full_name}</td>
              <td style={td}>{c.email}</td>
              <td style={td}>{c.phone || "—"}</td>
              <td style={td}><button onClick={() => handleDelete(c.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "0.5rem", textAlign: "left", borderBottom: "2px solid #e5e7eb" };
const td = { padding: "0.5rem", borderBottom: "1px solid #e5e7eb" };
