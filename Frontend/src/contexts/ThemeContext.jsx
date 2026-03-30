/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme" }) {
  const [theme, setTheme] = useState(localStorage.getItem(storageKey) || defaultTheme);


  useEffect(() => {
    const root = window.document.documentElement;

    // 1. Remove old classes
    root.classList.remove("light", "dark");

    // 2. Check if the theme is default system
    if (theme === "system") {
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (isSystemDark) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
    } else {
      // 3. The theme is strictly light or dark
      root.classList.add(theme);
    }
  }, [theme]);

  // Custom function to update React State and LocalStorage simultaneously
  const changeTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };


  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
