import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "15px",
            borderRadius: "8px",
            padding: "12px 18px",
          },
        }}
      />
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* This is where the routed components will render */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
