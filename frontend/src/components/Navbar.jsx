import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  marginRight: "1rem",
  fontWeight: isActive ? "bold" : "normal",
  textDecoration: "none",
  color: isActive ? "#2563eb" : "#374151",
});

export default function Navbar() {
  return (
    <nav style={{ padding: "0.75rem 2rem", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
      <NavLink to="/" style={linkStyle}>Dashboard</NavLink>
      <NavLink to="/products" style={linkStyle}>Products</NavLink>
      <NavLink to="/customers" style={linkStyle}>Customers</NavLink>
      <NavLink to="/orders" style={linkStyle}>Orders</NavLink>
    </nav>
  );
}
