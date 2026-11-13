
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import Exams from "./pages/Exams";
import Results from "./pages/Results";
import StudentResults from "./pages/StudentResults";
import { useAuth } from "./context/AuthContext";
import "./App.css";

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading application...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/student" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Exams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/results"
          element={
          <ProtectedRoute allowedRoles={["admin"]}>
             <Results />
          </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
           path="/student/results"
           element={
          <ProtectedRoute allowedRoles={["student"]}>
             <StudentResults />
          </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
