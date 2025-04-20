// src/hooks/useDarkMode.js
import { useEffect, useState } from 'react';

export default function useDarkMode() {
  // Initialize theme based on localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;                                              // persisted choice :contentReference[oaicite:5]{index=5}
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // On theme change, update <html> class and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);                                  // persist choice :contentReference[oaicite:6]{index=6}
  }, [theme]);

  // Toggler
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return [theme, toggleTheme];
}
