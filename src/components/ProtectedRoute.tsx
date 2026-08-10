import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
