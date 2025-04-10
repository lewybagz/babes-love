import React, { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Package,
  ShoppingBag,
  Users,
  Settings,
  BarChart2,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Home,
  ChevronRight,
  CreditCard,
  Gift,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/admin/payments",
    },
    {
      name: "Analytics",
      icon: <BarChart2 className="h-5 w-5" />,
      href: "/admin/analytics",
    },
    {
      name: "Marketing",
      icon: <Gift className="h-5 w-5" />,
      href: "/admin/marketing",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Extract current page name from path
  const getCurrentPageName = () => {
    const path = location.pathname.split("/").filter(Boolean);
    if (path.length === 1 && path[0] === "admin") return "Dashboard";
    if (path.length > 1) {
      const pageName = path[1].charAt(0).toUpperCase() + path[1].slice(1);
      return pageName;
    }
    return "Admin";
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              Admin Panel
            </span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="py-4 flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/admin" &&
                  location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span
                    className={`mr-3 ${
                      isActive ? "text-brand-600 dark:text-brand-400" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-3"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <Link
                to="/"
                className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-300"
              >
                <Home className="h-4 w-4 mr-1" />
                <span>Storefront</span>
              </Link>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-medium">
                  {user?.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : "A"}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.displayName || "Admin User"}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand-300 flex items-center mt-1"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-3"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400">
                  <Home className="h-4 w-4" />
                </span>
                <ChevronRight className="h-4 w-4 mx-1 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {getCurrentPageName()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};
