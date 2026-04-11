import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import { MainLayout } from "../components/layout/MainLayout";

// Auth Guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Actor Routes
import DevRoutes from "./actor-routes/DevRoutes";
import PmRoutes from "./actor-routes/PmRoutes";
import BdeRoutes from "./actor-routes/BdeRoutes";

// Core Pages
import AuthPage from "../pages/AuthPage";
import LandingPage from "../pages/LandingPage";
import Notifications from "../pages/Notifications";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <AuthPage />
                    </GuestRoute>
                }
            />

            {/* Actor Based Modular Routes */}
            <Route path="/dev/*" element={<DevRoutes />} />
            <Route path="/pm/*" element={<PmRoutes />} />
            <Route path="/bde/*" element={<BdeRoutes />} />

            {/* System Protected Routes */}
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute allowedRoles={["pm", "bde", "dev"]}>
                        <MainLayout role="pm">
                            <Notifications />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
