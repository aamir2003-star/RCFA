import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import { MainLayout } from "./components/layout/MainLayout";
import DevDashboard from "./components/dashboard/DevDashboard";
import PmDashboard from "./components/dashboard/PmDashboard";
import BdeDashboard from "./components/dashboard/BdeDashboard";
import AnalyticsDashboard from "./components/dashboard/AnalyticsDashboard";
import CreateProject from "./pages/CreateProject";
import WorkspacePage from "./pages/WorkspacePage";
import RequirementEditor from "./pages/RequirementEditor";
import ConflictDetection from "./pages/ConflictDetection";
import ConflictListPage from "./pages/ConflictListPage";
import ActivityTimeline from "./pages/ActivityTimeline";
import ConflictResolution from "./pages/ConflictResolution";
import TeamManagement from "./pages/TeamManagement";
import PmSettings from "./pages/PmSettings";
import BdeTeams from "./pages/BdeTeams";
import BdeSettings from "./pages/BdeSettings";
import DevModules from "./pages/DevModules";
import DevConflicts from "./pages/DevConflicts";
import DevDiscussions from "./pages/DevDiscussions";
import DevSettings from "./pages/DevSettings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import BdeReports from "./pages/BdeReports";
import DevVault from "./pages/DevVault";

function App() {
  return (
    <Router>
      {/* <AuthProvider> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/dev/dashboard"
          element={
            <MainLayout role="dev">
              <DevDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/dev/modules"
          element={
            <MainLayout role="dev">
              <DevModules />
            </MainLayout>
          }
        />
        <Route
          path="/dev/conflicts"
          element={
            <MainLayout role="dev">
              <DevConflicts />
            </MainLayout>
          }
        />
        <Route
          path="/dev/discussions"
          element={
            <MainLayout role="dev">
              <DevDiscussions />
            </MainLayout>
          }
        />
        <Route
          path="/dev/vault"
          element={
            <MainLayout role="dev">
              <DevVault />
            </MainLayout>
          }
        />
        <Route
          path="/dev/editor"
          element={
            <MainLayout role="dev">
              <RequirementEditor role="dev" />
            </MainLayout>
          }
        />
        <Route
          path="/dev/settings"
          element={
            <MainLayout role="dev">
              <DevSettings />
            </MainLayout>
          }
        />
        <Route
          path="/pm/dashboard"
          element={
            <MainLayout role="pm">
              <PmDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/pm/workspace"
          element={
            <MainLayout role="pm">
              <WorkspacePage />
            </MainLayout>
          }
        />
        <Route
          path="/pm/editor"
          element={
            <MainLayout role="pm">
              <RequirementEditor role="pm" />
            </MainLayout>
          }
        />
        <Route
          path="/pm/conflicts"
          element={
            <MainLayout role="pm">
              <ConflictListPage />
            </MainLayout>
          }
        />
        <Route
          path="/pm/conflicts/:id"
          element={
            <MainLayout role="pm">
              <ConflictDetection />
            </MainLayout>
          }
        />
        <Route
          path="/pm/timeline"
          element={
            <MainLayout role="pm">
              <ActivityTimeline />
            </MainLayout>
          }
        />
        <Route
          path="/pm/conflicts/:id/discussion"
          element={
            <MainLayout role="pm">
              <ConflictResolution />
            </MainLayout>
          }
        />
        <Route
          path="/pm/team"
          element={
            <MainLayout role="pm">
              <TeamManagement />
            </MainLayout>
          }
        />
        <Route
          path="/pm/analytics"
          element={
            <MainLayout role="pm">
              <AnalyticsDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/pm/settings"
          element={
            <MainLayout role="pm">
              <PmSettings />
            </MainLayout>
          }
        />
        <Route
          path="/bde/create-project"
          element={
            <MainLayout role="bde">
              <CreateProject />
            </MainLayout>
          }
        />
        <Route
          path="/bde/dashboard"
          element={
            <MainLayout role="bde">
              <BdeDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/bde/analytics"
          element={
            <MainLayout role="bde">
              <AnalyticsDashboard />
            </MainLayout>
          }
        />
        <Route
          path="/bde/projects"
          element={
            <MainLayout role="bde">
              <CreateProject />
            </MainLayout>
          }
        />
        <Route
          path="/bde/teams"
          element={
            <MainLayout role="bde">
              <BdeTeams />
            </MainLayout>
          }
        />
        <Route
          path="/bde/settings"
          element={
            <MainLayout role="bde">
              <BdeSettings />
            </MainLayout>
          }
        />
        <Route
          path="/bde/reports"
          element={
            <MainLayout role="bde">
              <BdeReports />
            </MainLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <MainLayout role="pm">
              <Notifications />
            </MainLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;
