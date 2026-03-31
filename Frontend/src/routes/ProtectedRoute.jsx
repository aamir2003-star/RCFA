import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

/**
 * ProtectedRoute component handles authentication and Role-Based Access Control (RBAC).
 * It redirects unauthenticated users to the login page and authorized users to their respective dashboards.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // If user is authenticated but doesn't have the required role, redirect to their default dashboard
        const defaultDashboards = {
            bde: "/bde/dashboard",
            pm: "/pm/dashboard",
            dev: "/dev/dashboard"
        };
        return <Navigate to={defaultDashboards[user?.role] || "/"} replace />;
    }

    return children;
}
