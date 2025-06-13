import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import Projects from "./pages/Projects.tsx";
import Home from "./pages/Home.tsx";
import Tickets from "./pages/Tickets.tsx";
import ProjectDetails from "./pages/ProjectDetails";

// Inside your Routes:


// ✅ Inline ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="projects/:id/tickets" element={<Tickets />} />
          </Route>
        </Routes>

        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
