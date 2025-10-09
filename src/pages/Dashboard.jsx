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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-500 px-4 py-8">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-center mb-16 text-foreground drop-shadow-md">
        Company Dashboard
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-7xl">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className="cursor-pointer rounded-3xl shadow-card transform transition-all duration-300 hover:-translate-y-2 hover:shadow-hover p-12 flex flex-col items-center justify-center card-professional"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
              {card.title}
            </h2>
            <p className="text-sm sm:text-base text-center text-muted-foreground">
              Click to open
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-sm text-muted-foreground">
        © 2025 Your Company. All rights reserved.
      </div>
    </div>
  );
}
