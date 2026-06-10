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

    if (isAuthenticated && user?.role) {
        const role = user.role.toLowerCase();
        const defaultDashboards = {
            bde: "/bde/dashboard",
            pm: "/pm/dashboard",
            dev: "/dev/dashboard"
        };

        const dashboard = defaultDashboards[role];
        if (dashboard) {
            const from = location.state?.from?.pathname || dashboard;
            return <Navigate to={from} replace />;
        }
    }

    return children;
}
