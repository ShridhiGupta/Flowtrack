import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Sessions } from "./pages/Sessions";
import { Analytics } from "./pages/Analytics";
import { AboutMe } from "./pages/AboutMe";
import { Settings } from "./pages/Settings";
import { AuthSetup } from "./pages/AuthSetup";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Create separate layout wrapper for protected routes
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup" element={<AuthSetup />} />
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="about-me" element={<AboutMe />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
