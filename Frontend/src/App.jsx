import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import AuthPage from "./pages/AuthPage";
import { MainLayout } from "./components/layout/MainLayout";
import DevDashboard from "./components/dashboard/DevDashboard";
import PmDashboard from "./components/dashboard/PmDashboard";
import BdeDashboard from "./components/dashboard/BdeDashboard";
import AnalyticsDashboard from "./components/dashboard/AnalyticsDashboard";
import CreateProject from "./pages/CreateProject";

function App() {
  return (
    <Router>
      {/* <AuthProvider> */}
      <Routes>
        {/* Public Routes */}
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
          path="/pm/dashboard"
          element={
            <MainLayout role="pm">
              <PmDashboard />
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
      </Routes>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;
