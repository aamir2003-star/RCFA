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
import ActivityTimeline from "./pages/ActivityTimeline";
import ConflictResolution from "./pages/ConflictResolution";
import TeamManagement from "./pages/TeamManagement";
import BdeTeams from "./pages/BdeTeams";
import BdeSettings from "./pages/BdeSettings";
import DevModules from "./pages/DevModules";
import DevConflicts from "./pages/DevConflicts";
import DevDiscussions from "./pages/DevDiscussions";
import DevSettings from "./pages/DevSettings";

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
            <DevModules />
          }
        />
        <Route
          path="/dev/conflicts"
          element={
            <DevConflicts />
          }
        />
        <Route
          path="/dev/discussions"
          element={
            <DevDiscussions />
          }
        />
        <Route
          path="/dev/settings"
          element={
            <DevSettings />
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
            <WorkspacePage />
          }
        />
        <Route
          path="/pm/editor"
          element={
            <RequirementEditor />
          }
        />
        <Route
          path="/pm/conflicts/:id"
          element={
            <ConflictDetection />
          }
        />
        <Route
          path="/pm/timeline"
          element={
            <ActivityTimeline />
          }
        />
        <Route
          path="/pm/conflicts/:id/discussion"
          element={
            <ConflictResolution />
          }
        />
        <Route
          path="/pm/team"
          element={
            <TeamManagement />
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
            <BdeTeams />
          }
        />
        <Route
          path="/bde/settings"
          element={
            <BdeSettings />
          }
        />
      </Routes>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;
