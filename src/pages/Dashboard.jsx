import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: "Buyer Dashboard", path: "/buyer" },
    { title: "Approver Dashboard", path: "/approver" },
    { title: "Admin Dashboard", path: "/admin" },
    { title: "Vendor Dashboard", path: "/vendor" },
  ];

  return (
    <div
      style={{ background: "var(--background)", color: "var(--foreground)" }}
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 px-4 py-8"
    >
      {/* Heading */}
      <h1 className="text-center mb-16" style={{ fontSize: "2.5rem", fontWeight: 700, textShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
        Company Dashboard
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-7xl">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="nav-card cursor-pointer flex flex-col items-center justify-center"
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem", textAlign: "center" }}>
              {card.title}
            </h2>
            <p style={{ fontSize: "0.875rem", textAlign: "center", color: "var(--muted-foreground)" }}>
              Click to open
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="footer mt-16">
        <p>© 2025 Your Company. All rights reserved.</p>
      </div>
    </div>
  );
}
