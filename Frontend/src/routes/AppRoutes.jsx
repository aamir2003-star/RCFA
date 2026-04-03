import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import { MainLayout } from "../components/layout/MainLayout";

// Auth Guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Pages
import AuthPage from "../pages/AuthPage";
import LandingPage from "../pages/LandingPage";
import DevDashboard from "../components/dashboard/DevDashboard";
import PmDashboard from "../components/dashboard/PmDashboard";
import BdeDashboard from "../components/dashboard/BdeDashboard";
import AnalyticsDashboard from "../components/dashboard/AnalyticsDashboard";
import CreateProject from "../pages/CreateProject";
import WorkspacePage from "../pages/WorkspacePage";
import RequirementEditor from "../pages/RequirementEditor";
import ConflictDetection from "../pages/ConflictDetection";
import ConflictListPage from "../pages/ConflictListPage";
import ActivityTimeline from "../pages/ActivityTimeline";
import ConflictResolution from "../pages/ConflictResolution";
import TeamManagement from "../pages/TeamManagement";
import PmSettings from "../pages/PmSettings";
import PmModules from "../pages/PmModules";
import BdeTeams from "../pages/BdeTeams";
import BdeSettings from "../pages/BdeSettings";
import DevModules from "../pages/DevModules";
import DevConflicts from "../pages/DevConflicts";
import DevDiscussions from "../pages/DevDiscussions";
import DevSettings from "../pages/DevSettings";
import Notifications from "../pages/Notifications";
import NotFound from "../pages/NotFound";
import BdeReports from "../pages/BdeReports";
import DevVault from "../pages/DevVault";
import ProfilePage from "../pages/ProfilePage";
import ConflictDiscussion from "../pages/ConflictDiscussion";

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

            {/* Developer Protected Routes */}
            <Route
                path="/dev/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <DevDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/modules"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <DevModules />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/conflicts/:id/discussion"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <ConflictDiscussion />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/conflicts/discussion"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <ConflictDiscussion />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/conflicts"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <DevConflicts />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/discussions"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <DevDiscussions />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/vault"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <DevVault />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/editor"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <RequirementEditor role="dev" />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/profile"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <ProfilePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dev/settings"
                element={
                    <ProtectedRoute allowedRoles={["dev"]}>
                        <MainLayout role="dev">
                            <DevSettings />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* PM Protected Routes */}
            <Route
                path="/pm/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <PmDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/workspace"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <WorkspacePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/editor"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <RequirementEditor role="pm" />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/modules"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <PmModules />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/conflicts"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <ConflictListPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/conflicts/:id"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <ConflictDetection />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/timeline"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <ActivityTimeline />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/conflicts/:id/discussion"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <ConflictResolution />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/conflicts/discussion"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <ConflictResolution />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/team"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <TeamManagement />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/analytics"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <AnalyticsDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/profile"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <ProfilePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pm/settings"
                element={
                    <ProtectedRoute allowedRoles={["pm"]}>
                        <MainLayout role="pm">
                            <PmSettings />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* BDE Protected Routes */}
            <Route
                path="/bde/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["bde"]}>
                        <MainLayout role="bde">
                            <BdeDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bde/analytics"
                element={
                    <ProtectedRoute allowedRoles={["bde"]}>
                        <MainLayout role="bde">
                            <AnalyticsDashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bde/editor"
                element={
                    <ProtectedRoute allowedRoles={["bde"]}>
                        <MainLayout role="bde">
                            <RequirementEditor role="bde" />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bde/projects"
                element={
                    <ProtectedRoute allowedRoles={["bde"]}>
                        <MainLayout role="bde">
                            <CreateProject />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bde/teams"
                element={
                    <ProtectedRoute allowedRoles={["bde"]}>
                        <MainLayout role="bde">
                            <BdeTeams />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bde/profile"
                element={
                    <ProtectedRoute allowedRoles={["bde"]}>
                        <MainLayout role="bde">
                            <ProfilePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bde/settings"
                element={
                    <ProtectedRoute allowedRoles={["bde"]}>
                        <MainLayout role="bde">
                            <BdeSettings />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bde/reports"
                element={
                    <ProtectedRoute allowedRoles={["bde"]}>
                        <MainLayout role="bde">
                            <BdeReports />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

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
