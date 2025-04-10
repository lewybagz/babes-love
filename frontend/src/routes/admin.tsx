import { Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminPage from "../pages/admin/AdminPage";
import ProductManagementPage from "../pages/admin/ProductManagementPage";
import AdminOrdersPage from "../pages/admin/OrdersPage";
import MarketingPage from "../pages/admin/MarketingPage";

/**
 * Admin routes configuration
 * All routes are protected with admin role requirement
 */
export const adminRoutes = (
  <Route element={<ProtectedRoute requiredRole="admin" />}>
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/admin/products" element={<ProductManagementPage />} />
    <Route path="/admin/orders" element={<AdminOrdersPage />} />
    <Route path="/admin/marketing" element={<MarketingPage />} />
  </Route>
);
