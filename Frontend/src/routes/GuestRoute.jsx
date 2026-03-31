import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

/**
 * GuestRoute prevents authenticated users from accessing login/register pages.
 * It redirects them to their respective role-based dashboards.
 */
export default function GuestRoute({ children }) {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (isAuthenticated) {
        const defaultDashboards = {
            bde: "/bde/dashboard",
            pm: "/pm/dashboard",
            dev: "/dev/dashboard"
        };

        // Redirect to the intended page or their default dashboard
        const from = location.state?.from?.pathname || defaultDashboards[user?.role] || "/";
        return <Navigate to={from} replace />;
    }

    return children;
}
