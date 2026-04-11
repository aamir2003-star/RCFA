import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { MainLayout } from "../../components/layout/MainLayout";
import { ROLES } from "../../constants/roles";

// Pages
import DevDashboard from "../../components/dashboard/DevDashboard";
import DevModules from "../../pages/DevModules";
import ConflictDiscussion from "../../pages/ConflictDiscussion";
import DevConflicts from "../../pages/DevConflicts";
import DevDiscussions from "../../pages/DevDiscussions";
import DevVault from "../../pages/DevVault";
import RequirementEditor from "../../pages/RequirementEditor";
import ProfilePage from "../../pages/ProfilePage";
import DevSettings from "../../pages/DevSettings";
import Notifications from "../../pages/Notifications";

export default function DevRoutes() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.DEV]}>
            <MainLayout role={ROLES.DEV}>
                <Routes>
                    <Route path="dashboard" element={<DevDashboard />} />
                    <Route path="modules" element={<DevModules />} />
                    <Route path="conflicts/:id/discussion" element={<ConflictDiscussion />} />
                    <Route path="conflicts/discussion" element={<ConflictDiscussion />} />
                    <Route path="conflicts" element={<DevConflicts />} />
                    <Route path="discussions" element={<DevDiscussions />} />
                    <Route path="vault" element={<DevVault />} />
                    <Route path="editor" element={<RequirementEditor role={ROLES.DEV} />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<DevSettings />} />
                    <Route path="notifications" element={<Notifications />} />
                </Routes>
            </MainLayout>
        </ProtectedRoute>
    );
}
