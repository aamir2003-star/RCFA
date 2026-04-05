import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { MainLayout } from "../../components/layout/MainLayout";
import { ROLES } from "../../constants/roles";

// Pages
import PmDashboard from "../../components/dashboard/PmDashboard";
import WorkspacePage from "../../pages/WorkspacePage";
import RequirementEditor from "../../pages/RequirementEditor";
import PmModules from "../../pages/PmModules";
import ConflictListPage from "../../pages/ConflictListPage";
import ConflictDetection from "../../pages/ConflictDetection";
import ActivityTimeline from "../../pages/ActivityTimeline";
import ConflictResolution from "../../pages/ConflictResolution";
import TeamManagement from "../../pages/TeamManagement";
import AnalyticsDashboard from "../../components/dashboard/AnalyticsDashboard";
import ProfilePage from "../../pages/ProfilePage";
import PmSettings from "../../pages/PmSettings";

export default function PmRoutes() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.PM]}>
            <MainLayout role={ROLES.PM}>
                <Routes>
                    <Route path="dashboard" element={<PmDashboard />} />
                    <Route path="workspace" element={<WorkspacePage />} />
                    <Route path="editor" element={<RequirementEditor role={ROLES.PM} />} />
                    <Route path="modules" element={<PmModules />} />
                    <Route path="conflicts" element={<ConflictListPage />} />
                    <Route path="conflicts/:id" element={<ConflictDetection />} />
                    <Route path="timeline" element={<ActivityTimeline />} />
                    <Route path="conflicts/:id/discussion" element={<ConflictResolution />} />
                    <Route path="conflicts/discussion" element={<ConflictResolution />} />
                    <Route path="team" element={<TeamManagement />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<PmSettings />} />
                </Routes>
            </MainLayout>
        </ProtectedRoute>
    );
}
