import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation(); // helps detect active page

  const navItemStyle = (path) =>
    `px-4 py-2 rounded-lg transition-all ${
      location.pathname === path
        ? "bg-black text-white dark:bg-white dark:text-black"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="w-full px-6 py-4 bg-white dark:bg-gray-900 shadow-md flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        FocusFlow
      </h1>

      {/* Navigation + Theme */}
      <div className="flex items-center gap-4">

        {/* Navigation Links */}
        <Link to="/" className={navItemStyle("/")}>
          Home
        </Link>

        <Link to="/dashboard" className={navItemStyle("/dashboard")}>
          Dashboard
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          {theme === "light" ? (
            <FaMoon className="text-gray-900" size={22} />
          ) : (
            <FaSun className="text-yellow-400" size={24} />
          )}
        </button>
      </div>
    </nav>
  );
}
