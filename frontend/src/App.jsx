import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard"; // will become Dashboard.jsx in next block
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Handles the root "/" redirect per spec: logged in -> dashboard, else -> login
function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Add teammates' routes below as they push, wrapped in ProtectedRoute
          with allowedRoles matching the spec's access table, e.g.:
      <Route
        path="/trips"
        element={
          <ProtectedRoute allowedRoles={["DISPATCHER"]}>
            <TripDispatcher />
          </ProtectedRoute>
        }
      />
      */}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;