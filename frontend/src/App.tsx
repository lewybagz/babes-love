import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Import Layout Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./components/layout/HomePage";

// Import Page Components
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./components/cart/CartPage";
import CheckoutPage from "./components/checkout/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OurMissionPage from "./pages/OurMissionPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import CustomizerPage from "./pages/CustomizerPage";
import AccessDeniedPage from "./pages/admin/AccessDeniedPage";

// Admin Page Components
import AdminPage from "./pages/admin/AdminPage";
import OrdersPage from "./pages/admin/OrdersPage";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import { CustomersPage } from "./pages/admin/CustomersPage";
import { PaymentsPage } from "./pages/admin/PaymentsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

// Import Toaster for notifications
import { Toaster } from "react-hot-toast";
import MarketingPage from "./pages/admin/MarketingPage";

// Simple NotFoundPage component
const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Oops! The page you are looking for does not exist.
      </p>
    </div>
  );
};

// Layout component to wrap pages with Header and Footer
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <AppProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route
                    path="products/:productId"
                    element={<ProductDetailPage />}
                  />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route
                    path="order-confirmation"
                    element={<OrderConfirmationPage />}
                  />
                  <Route path="our-mission" element={<OurMissionPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="customize" element={<CustomizerPage />} />
                  <Route path="access-denied" element={<AccessDeniedPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="orders" element={<OrderHistoryPage />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                <Route element={<ProtectedRoute requiredRole="admin" />}>
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/orders" element={<OrdersPage />} />
                  <Route
                    path="/admin/products"
                    element={<ProductManagementPage />}
                  />
                  <Route path="/admin/customers" element={<CustomersPage />} />
                  <Route path="/admin/payments" element={<PaymentsPage />} />
                  <Route path="/admin/analytics" element={<AnalyticsPage />} />
                  <Route path="/admin/marketing" element={<MarketingPage />} />
                </Route>
              </Routes>
            </Router>
          </AppProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
