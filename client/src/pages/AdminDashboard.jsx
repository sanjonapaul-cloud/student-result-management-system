
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../services/api";

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

  const navigationItems = [
    { path: "/admin", label: "Dashboard", icon: "▦", end: true },
    { path: "/admin/students", label: "Students", icon: "♙" },
    { path: "/admin/subjects", label: "Subjects", icon: "▤" },
    { path: "/admin/exams", label: "Exams", icon: "▣" },
    { path: "/admin/results", label: "Results", icon: "◈" },
  ];

  const statCards = [
    {
      label: "Total Students",
      value: stats.students,
      icon: "♙",
      color: "blue",
    },
    {
      label: "Total Subjects",
      value: stats.subjects,
      icon: "▤",
      color: "purple",
    },
    {
      label: "Total Exams",
      value: stats.exams,
      icon: "▣",
      color: "orange",
    },
    {
      label: "Total Results",
      value: stats.results,
      icon: "◈",
      color: "green",
    },
  ];

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">E</div>
          <div>
            <h2>EduTrack</h2>
            <span>RESULT MANAGEMENT</span>
          </div>
        </div>

        <div className="sidebar-section-label">MAIN MENU</div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-avatar">A</div>
          <div className="sidebar-user">
            <strong>{user?.name}</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

      <div className="admin-main">

        <header className="admin-topbar">
          <div>
            <span className="topbar-label">ADMINISTRATION</span>
            <h2>Dashboard Overview</h2>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="admin-content">

          <div className="welcome-section">
            <div>
              <h1>Welcome back, {user?.name}!</h1>
              <p>Here's what's happening in your institution today.</p>
            </div>

            <span className="admin-status">
              <span className="status-dot"></span>
              Administrator
            </span>
          </div>

          <section className="stats-section">
            <div className="section-heading">
              <h2>Overview</h2>
              <p>Your academic management summary</p>
            </div>

            {loading && <p>Loading dashboard statistics...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
              <div className="dashboard-cards">
                {statCards.map((card) => (
                  <div
                    className={`dashboard-card stat-${card.color}`}
                    key={card.label}
                  >
                    <div className="stat-card-top">
                      <span>{card.label}</span>
                      <div className="stat-icon">{card.icon}</div>
                    </div>

                    <h3>{card.value}</h3>
                    <p>Currently registered</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="activity-section">
            <div className="section-heading">
              <h2>Quick Access</h2>
              <p>Manage your academic records</p>
            </div>

            <div className="quick-access-grid">
              {navigationItems.slice(1).map((item) => (
                <NavLink
                  to={item.path}
                  className="quick-access-card"
                  key={item.path}
                >
                  <span className="quick-access-icon">{item.icon}</span>
                  <div>
                    <strong>Manage {item.label}</strong>
                    <span>View and update {item.label.toLowerCase()}</span>
                  </div>
                  <span className="quick-arrow">→</span>
                </NavLink>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
