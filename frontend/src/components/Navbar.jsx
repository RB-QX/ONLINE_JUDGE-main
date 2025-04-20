// src/components/Sidebar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiCode,
  FiGrid,
  FiCalendar,
  FiPlusCircle,
  FiSettings,
  FiSun,
  FiMoon,
  FiMenu,
  FiX
} from 'react-icons/fi';
import useDarkMode from '../hooks/useDarkMode';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

const links = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/compiler', label: 'Compiler', icon: FiCode },
  { to: '/allproblems', label: 'Problems', icon: FiGrid },
  { to: '/contest', label: 'Contests', icon: FiCalendar, auth: true },
  { to: '/addproblems', label: 'Add Problem', icon: FiPlusCircle, role: 'admin' },
  { to: '/deleteproblems', label: 'Manage', icon: FiSettings, role: 'admin' }
];

export default function Sidebar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const role = localStorage.getItem('role');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, toggleTheme] = useDarkMode();
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.success("Logged out!");
    window.location.reload(); // hard reload to reset state
  };

  const renderLinks = () =>
    links.map(({ to, label, icon: Icon, auth, role: required }) => {
      if (auth && !isLoggedIn) return null;
      if (required && role !== required) return null;
      return (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors 
             text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 ${
               isActive ? 'bg-gray-300 dark:bg-gray-700 font-semibold' : ''
             }`
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      );
    });

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-900 rounded-md shadow-md md:hidden"
        onClick={() => setMobileOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 shadow-lg 
                    transform transition-transform duration-300 
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            MENU
          </h2>
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {theme === 'dark' ? (
              <FiSun className="w-5 h-5 text-yellow-400" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-1">{renderLinks()}</nav>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Log out
            </button>
          ) : (
            <NavLink
              to="/login"
              className="w-full block text-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
            >
              Log in
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
