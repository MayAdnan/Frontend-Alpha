import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../partials/components/LoadingSpinner";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated ? children : <Navigate to="/auth/signin" replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated && role === "Admin" ? (
    children
  ) : (
    <Navigate to="/auth/signin" replace />
  );
};
