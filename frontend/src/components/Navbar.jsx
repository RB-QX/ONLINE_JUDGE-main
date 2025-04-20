// frontend/src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { FiMenu, FiX, FiSun, FiMoon, FiUser } from "react-icons/fi";
import logo from "../assets/logo.gif";

const links = [
  { to: "/", label: "Home" },
  { to: "/compiler", label: "Compiler" },
  { to: "/allproblems", label: "Problems" },
  { to: "/contest", label: "Contests", auth: true },
  { to: "/addproblems", label: "Add Problem", role: "admin" },
  { to: "/deleteproblems", label: "Manage", role: "admin" },
  { to: "/adduserproblems", label: "Add Problem", role: "user" },
];

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Persist dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setMobileOpen(false);
    navigate("/");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            CODE INNOVATE GROW
          </span>
        </NavLink>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-6">
          {links.map(({ to, label, auth, role: required }) => {
            if (auth && !isLoggedIn) return null;
            if (required && role !== required) return null;
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition ${
                    isActive ? "font-bold border-b-2 border-orange-500" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {isLoggedIn && user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="User avatar"
              onClick={goToDashboard}
              className="h-8 w-8 rounded-full cursor-pointer ring-2 ring-orange-500"
            />
          ) : isLoggedIn ? (
            <button
              onClick={goToDashboard}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
              aria-label="Go to dashboard"
            >
              <FiUser size={20} />
            </button>
          ) : null}

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 dark:hover:bg-gray-800 transition"
              >
                Sign up
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Log out
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 shadow-inner">
          <ul className="flex flex-col space-y-2 p-4">
            {isLoggedIn && (
              <li className="flex items-center space-x-2 mb-4">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="User avatar"
                    onClick={goToDashboard}
                    className="h-10 w-10 rounded-full ring-2 ring-orange-500 cursor-pointer"
                  />
                ) : (
                  <FiUser
                    size={30}
                    className="text-gray-700 dark:text-gray-300 cursor-pointer"
                    onClick={goToDashboard}
                  />
                )}
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {user?.name || "Dashboard"}
                </span>
              </li>
            )}

            {links.map(({ to, label, auth, role: required }) => {
              if (auth && !isLoggedIn) return null;
              if (required && role !== required) return null;
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                >
                  {label}
                </NavLink>
              );
            })}

            <li>
              <button
                onClick={toggleDark}
                className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>

            {isLoggedIn && (
              <li>
                <button
                  onClick={goToDashboard}
                  className="w-full flex items-center px-2 py-2 space-x-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                >
                  <FiUser />
                  <span>Dashboard</span>
                </button>
              </li>
            )}

            <li>
              {!isLoggedIn ? (
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 rounded bg-orange-500 text-white text-center"
                >
                  Log in
                </NavLink>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full px-2 py-2 rounded bg-red-500 text-white"
                >
                  Log out
                </button>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
