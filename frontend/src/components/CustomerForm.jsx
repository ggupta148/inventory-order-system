import { useState } from "react";

export default function CustomerForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.full_name || !form.email) { setError("Name and email are required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Invalid email format"); return; }
    onSubmit(form);
  }

  return (
    <form onSubmit={submit} className="form-panel">
      <h2 style={{ marginBottom: "1rem" }}>Add Customer</h2>
      {error && <p className="form-error" style={{ marginBottom: "1rem" }}>{error}</p>}
      <div className="form-grid">
        <div className="form-grid-1">
          <label>Full Name</label>
          <input name="full_name" placeholder="e.g. Jane Smith" value={form.full_name} onChange={handle} />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={handle} />
        </div>
        <div>
          <label>Phone (optional)</label>
          <input name="phone" placeholder="+1 555 000 0000" value={form.phone} onChange={handle} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>
        <button type="submit" className="btn-primary">Save Customer</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
