
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait until authentication check finishes
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // Redirect unauthenticated users
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check user role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
