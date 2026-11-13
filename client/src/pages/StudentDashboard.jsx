
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchMyResults = async () => {
      try {
        const response = await api.get("/results/my-results");
        setResults(response.data.results);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch your results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyResults();
  }, []);

  const passedResults = results.filter(
    (result) => result.status === "Pass"
  ).length;

  const failedResults = results.filter(
    (result) => result.status === "Fail"
  ).length;

  return (
    <div className="student-layout">

      <aside className="student-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">E</div>
          <div>
            <h2>EduTrack</h2>
            <span>STUDENT PORTAL</span>
          </div>
        </div>

        <div className="sidebar-section-label">STUDENT MENU</div>

        <nav className="sidebar-nav">
          <div className="sidebar-link active">
            <span className="sidebar-icon">▦</span>
            My Dashboard
          </div>

          <a href="/student/results" className="sidebar-link">
             <span className="sidebar-icon">◈</span>
               My Results
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="sidebar-user">
            <strong>{user?.name}</strong>
            <span>Student</span>
          </div>
        </div>
      </aside>

      <div className="student-main">

        <header className="admin-topbar">
          <div>
            <span className="topbar-label">STUDENT PORTAL</span>
            <h2>My Dashboard</h2>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="student-content">

          <section className="welcome-section">
            <div>
              <h1>Welcome back, {user?.name}!</h1>
              <p>Here's an overview of your academic performance.</p>
            </div>

            <span className="admin-status">
              <span className="status-dot"></span>
              Student Account
            </span>
          </section>

          <section className="student-profile-card">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="profile-details">
              <span>STUDENT PROFILE</span>
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              {user?.rollNumber && (
                <p>Roll Number: {user.rollNumber}</p>
              )}
            </div>
          </section>

          <section className="student-stats">
            <div className="student-stat-card">
              <span>Total Results</span>
              <h3>{results.length}</h3>
            </div>

            <div className="student-stat-card">
              <span>Passed</span>
              <h3 className="pass-number">{passedResults}</h3>
            </div>

            <div className="student-stat-card">
              <span>Failed</span>
              <h3 className="fail-number">{failedResults}</h3>
            </div>
          </section>

          
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
