import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Moon,
  Sun,
  ShoppingBag,
  Menu,
  X,
  User as UserIcon,
  LogIn,
  LogOut,
  ShoppingCart,
  Brush,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { CartItem } from "../../types";

const Header: React.FC = () => {
  const { cartItems } = useAppContext();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add types for reduce parameters
  const cartItemCount = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  // Get user display name from Firebase
  const displayName = user?.displayName?.split(" ")[0] || "Account";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on resize if screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    // Optionally: navigate('/'), toast.success('Logged out')
  };

  // Consolidated Desktop Navigation Links
  const renderDesktopNavLinks = () => {
    return (
      <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
        <NavLink to="/" className={getDesktopNavLinkClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={getDesktopNavLinkClass}>
          Shop
        </NavLink>
        <NavLink to="/customize" className={getDesktopNavLinkClass}>
          <Brush className="mr-1 h-4 w-4 inline-block" />
          Customize
        </NavLink>
        <NavLink to="/about" className={getDesktopNavLinkClass}>
          About Us
        </NavLink>
        <NavLink to="/contact" className={getDesktopNavLinkClass}>
          Contact
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              getDesktopNavLinkClass({ isActive }) +
              " text-brand dark:text-brand-400 font-semibold"
            }
          >
            Admin
          </NavLink>
        )}
      </nav>
    );
  };

  // Consolidated Mobile Navigation Links
  const renderMobileNavLinks = () => {
    return (
      <div className="flex flex-col space-y-1 px-2 pt-2 pb-3 sm:px-3">
        <NavLink
          to="/"
          className={getMobileNavLinkClass}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/products"
          className={getMobileNavLinkClass}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Shop
        </NavLink>
        <NavLink
          to="/customize"
          className={getMobileNavLinkClass}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Brush className="mr-2 h-5 w-5" />
          Customize Hat
        </NavLink>
        <NavLink
          to="/about"
          className={getMobileNavLinkClass}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          About Us
        </NavLink>
        <NavLink
          to="/contact"
          className={getMobileNavLinkClass}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              getMobileNavLinkClass({ isActive }) +
              " text-brand dark:text-brand-400"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Admin
          </NavLink>
        )}

        <div className="pt-4 mt-4 border-t border-gray-700 dark:border-gray-600">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon className="mr-2 h-5 w-5" />
                {displayName}
              </NavLink>
              <NavLink
                to="/orders"
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Order History
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className={
                  getMobileNavLinkClass({ isActive: false }) +
                  " w-full text-left"
                }
              >
                <LogOut className="mr-2 h-5 w-5" /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="mr-2 h-5 w-5" /> Login
              </NavLink>
              <NavLink
                to="/register"
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-gray-700 dark:border-gray-600 flex justify-between items-center px-1">
          <span className="text-base font-medium text-gray-300 dark:text-gray-400">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </span>
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Babes
                <span className="text-brand dark:text-brand-400">Love</span>
              </Link>
            </div>

            <div className="hidden lg:ml-10 lg:flex lg:items-center lg:space-x-4">
              {renderDesktopNavLinks()}
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              onClick={toggleDarkMode}
              className="hidden lg:block p-1 rounded-full text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mr-3"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="hidden lg:block relative ml-3">
              {isAuthenticated ? (
                <NavLink to="/profile" className={getDesktopNavLinkClass}>
                  <UserIcon className="h-5 w-5 inline-block mr-1" />
                  {displayName}
                </NavLink>
              ) : (
                <div className="flex items-center space-x-3">
                  <NavLink to="/login" className={getDesktopNavLinkClass}>
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-1.5 bg-brand hover:bg-brand-600 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>

            <div className="ml-4 flow-root">
              <Link
                to="/cart"
                className="group -m-2 p-2 flex items-center relative"
              >
                <ShoppingBag
                  className="flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-200"
                  aria-hidden="true"
                />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-brand text-white text-xs font-bold ring-2 ring-white dark:ring-gray-800 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">items in cart, view bag</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div
          className="fixed inset-0 z-40"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80" />
        </div>
        <div
          className="fixed top-0 right-0 z-50 h-screen w-64 sm:w-80 bg-white dark:bg-gray-800 shadow-lg transform transition ease-in-out duration-300 flex flex-col overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          style={{
            transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2
              id="mobile-menu-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Menu
            </h2>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {renderMobileNavLinks()}
        </div>
      </div>
    </header>
  );
};

// Helper function for desktop NavLink classes
const getDesktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-brand-400 transition-colors ${
    isActive ? "text-brand dark:text-brand-400" : ""
  }`;

// Helper function for mobile NavLink classes
const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 rounded-md text-base font-medium ${
    isActive
      ? "bg-brand-50 dark:bg-gray-900 text-brand dark:text-brand-300"
      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
  } transition-colors`;

export default Header;
