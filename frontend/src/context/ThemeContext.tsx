import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of the ThemeContext
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check local storage first
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      return savedMode === "true";
    }
    // Otherwise, check system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  // Apply dark mode class to HTML element and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  // Toggle function
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    // Optionally add toast notification here if desired
  };

  // Context value
  const value = {
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
