import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { MainLayout } from "../../components/layout/MainLayout";
import { ROLES } from "../../constants/roles";

// Pages
import BdeDashboard from "../../components/dashboard/BdeDashboard";
import AnalyticsDashboard from "../../components/dashboard/AnalyticsDashboard";
import RequirementEditor from "../../pages/RequirementEditor";
import CreateProject from "../../pages/CreateProject";
import BdeTeams from "../../pages/BdeTeams";
import ProfilePage from "../../pages/ProfilePage";
import BdeSettings from "../../pages/BdeSettings";
import BdeReports from "../../pages/BdeReports";

export default function BdeRoutes() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.BDE]}>
            <MainLayout role={ROLES.BDE}>
                <Routes>
                    <Route path="dashboard" element={<BdeDashboard />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="editor" element={<RequirementEditor role={ROLES.BDE} />} />
                    <Route path="projects" element={<CreateProject />} />
                    <Route path="teams" element={<BdeTeams />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<BdeSettings />} />
                    <Route path="reports" element={<BdeReports />} />
                </Routes>
            </MainLayout>
        </ProtectedRoute>
    );
}
