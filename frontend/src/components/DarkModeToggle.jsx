// src/components/DarkModeToggle.jsx
import React from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';
import useDarkMode from '../hooks/useDarkMode';

export default function DarkModeToggle() {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="
        p-2 rounded-full 
        bg-gray-200 dark:bg-gray-700 
        transition focus:outline-none 
        focus:ring-2 focus:ring-offset-2 
        focus:ring-orange-400
      "
    >
      {theme === 'dark'
        ? <IoSunny className="w-6 h-6 text-yellow-400" />  
        : <IoMoon className="w-6 h-6 text-gray-800" />}       
    </button>
  );
}
