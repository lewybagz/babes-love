import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Package,
  ShoppingBag,
  Users,
  Settings,
  CreditCard,
  BarChart2,
  Gift,
  Store,
} from "lucide-react";

const AdminPage: React.FC = () => {
  const { user } = useAuth();

  const adminModules = [
    {
      id: "products",
      name: "Products",
      description: "Manage your product catalog",
      icon: <Package className="h-8 w-8" />,
      link: "/admin/products",
      color: "bg-blue-500",
    },
    {
      id: "orders",
      name: "Orders",
      description: "View and manage customer orders",
      icon: <ShoppingBag className="h-8 w-8" />,
      link: "/admin/orders",
      color: "bg-green-500",
    },
    {
      id: "customers",
      name: "Customers",
      description: "Manage customer accounts",
      icon: <Users className="h-8 w-8" />,
      link: "/admin/customers",
      color: "bg-purple-500",
    },
    {
      id: "payments",
      name: "Payments",
      description: "View transaction history",
      icon: <CreditCard className="h-8 w-8" />,
      link: "/admin/payments",
      color: "bg-amber-500",
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "View sales and performance data",
      icon: <BarChart2 className="h-8 w-8" />,
      link: "/admin/analytics",
      color: "bg-rose-500",
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Create and manage promotions",
      icon: <Gift className="h-8 w-8" />,
      link: "/admin/marketing",
      color: "bg-emerald-500",
    },
    {
      id: "storeFront",
      name: "Store Front",
      description: "View the store front",
      icon: <Store className="h-8 w-8" />,
      link: "/",
      color: "bg-brand",
    },
    {
      id: "settings",
      name: "Settings",
      description: "Configure shop settings",
      icon: <Settings className="h-8 w-8" />,
      link: "/admin/settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Welcome, {user?.displayName || "Admin"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <Link
              key={module.id}
              to={module.link}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div
                  className={`inline-flex items-center justify-center p-3 rounded-md ${module.color} text-white mb-4`}
                >
                  {module.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {module.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {module.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
