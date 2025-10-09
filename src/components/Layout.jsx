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
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500">
      {!hideHeader && (
        <header
          className="flex items-center justify-between px-6 py-4 border-b shadow-md"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Left: Back Button */}
          <div>
            <button
              onClick={handleBack}
              className="rounded-lg px-3 py-2 transition-all duration-200 shadow-sm hover:shadow-hover"
              style={{
                background: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              ← Back
            </button>
          </div>

          {/* Center: Heading */}
          <h1
            className="text-2xl sm:text-3xl font-bold flex-1 text-center"
            style={{ color: 'var(--foreground)' }}
          >
            NFA Dashboard
          </h1>

          {/* Right: Theme Toggle + Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn-primary-gradient px-4 py-2"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>

            <button
              onClick={handleLogout}
              className="btn-destructive px-4 py-2"
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
