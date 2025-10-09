import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="btn-primary-gradient"
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
