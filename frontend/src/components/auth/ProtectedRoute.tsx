import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { hasAdminAccess } from "../../config/adminAccess";

interface ProtectedRouteProps {
  requiredRole?: string; // Optional: specify required role (e.g., 'admin')
}

interface UserData {
  role: string;
  firstName: string;
  lastName: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user, isLoading, isAdmin } = useAuth();
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(false);

  // Check if this is an admin route
  const isAdminRoute = requiredRole === "admin";

  // Fetch user role from Firestore if a role check is required
  useEffect(() => {
    const fetchUserData = async () => {
      if (requiredRole && user && !userData && !isAdminRoute) {
        setIsCheckingRole(true);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsCheckingRole(false);
        }
      }
    };

    fetchUserData();
  }, [user, userData, requiredRole, isAdminRoute]);

  // Show loading state if authentication check or role check is in progress
  if (isLoading || isCheckingRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For admin routes, check if the user's email is in the admin list
  if (isAdminRoute && !isAdmin) {
    // Redirect to access denied page
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  // For non-admin role checks, use the Firebase role from userData
  if (
    requiredRole &&
    !isAdminRoute &&
    userData &&
    userData.role !== requiredRole
  ) {
    // Redirect to an unauthorized page or home page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the child route component if authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
