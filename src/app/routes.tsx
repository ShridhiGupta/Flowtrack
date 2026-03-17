import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Sessions } from "./pages/Sessions";
import { Analytics } from "./pages/Analytics";
import { AboutMe } from "./pages/AboutMe";
import { Settings } from "./pages/Settings";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", Component: Dashboard },
      { path: "sessions", Component: Sessions },
      { path: "analytics", Component: Analytics },
      { path: "about-me", Component: AboutMe },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
