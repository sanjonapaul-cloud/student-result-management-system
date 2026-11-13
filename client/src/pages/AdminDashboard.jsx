
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    subjects: 0,
    exams: 0,
    results: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [studentsRes, subjectsRes, examsRes, resultsRes] =
          await Promise.all([
            api.get("/students"),
            api.get("/subjects"),
            api.get("/exams"),
            api.get("/results"),
          ]);

        setStats({
          students: studentsRes.data.count,
          subjects: subjectsRes.data.count,
          exams: examsRes.data.count,
          results: resultsRes.data.count,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Student Result Management System</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <h2>Welcome, {user?.name}</h2>
        <p>You are logged in as an Administrator.</p>
        <nav className="dashboard-nav">
           <Link to="/admin/students">Manage Students</Link>
           <Link to="/admin/subjects">Manage Subjects</Link>
           <Link to="/admin/exams">Manage Exams</Link>
           <Link to="/admin/results">Manage Results</Link>
        </nav>

        {loading && <p>Loading dashboard statistics...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Total Students</h3>
              <p>{stats.students}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Subjects</h3>
              <p>{stats.subjects}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Exams</h3>
              <p>{stats.exams}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Results</h3>
              <p>{stats.results}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
