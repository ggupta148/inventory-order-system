import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Dashboard", icon: "▦" },
  { to: "/products", label: "Products", icon: "⊞" },
  { to: "/customers", label: "Customers", icon: "◉" },
  { to: "/orders", label: "Orders", icon: "≡" },
];

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
      padding: "0 2rem",
      height: 56,
      background: "#fff",
      borderBottom: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ fontWeight: 700, fontSize: "1rem", color: "#4f46e5", marginRight: "1.5rem", letterSpacing: "-0.02em" }}>
        InventoryOS
      </div>
      {NAV_LINKS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.4rem 0.85rem",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
            color: isActive ? "#4f46e5" : "#64748b",
            background: isActive ? "#eef2ff" : "transparent",
            transition: "all 0.15s",
          })}
        >
          <span style={{ fontSize: 14 }}>{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
