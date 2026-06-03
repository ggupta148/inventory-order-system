import { useState } from "react";

export default function CustomerForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      setError("Name and email are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Invalid email format");
      return;
    }
    onSubmit(form);
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 360 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handle} />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handle} />
      <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handle} />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
