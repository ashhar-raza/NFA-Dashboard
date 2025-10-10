import React, { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

export default function Layout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => navigate('/');
  const handleBack = () => navigate(-1);

  const hideHeader = location.pathname === '/';

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {!hideHeader && (
        <header
          className="flex items-center justify-between px-6 py-4 mb-6 rounded-lg"
          style={{
            background: "var(--card)",
            borderBottom: "2px solid var(--border)",
            boxShadow: "var(--shadow-card)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Left: Back Button */}
          <div>
            <button
              onClick={handleBack}
              className="button-secondary"
            >
              ← Back
            </button>
          </div>

          {/* Center: Heading */}
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              textAlign: "center",
              flex: 1,
              color: "var(--foreground)",
            }}
          >
            NFA Dashboard
          </h1>

          {/* Right: Theme Toggle + Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="button"
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            <button
              onClick={handleLogout}
              className="button-destructive"
            >
              Logout
            </button>
          </div>
        </header>
      )}

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
