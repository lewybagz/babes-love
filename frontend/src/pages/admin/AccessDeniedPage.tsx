import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

const AccessDeniedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          You don't have permission to access the admin area. This area is
          restricted to authorized administrators only.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
