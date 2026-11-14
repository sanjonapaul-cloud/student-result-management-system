
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

  const [analytics, setAnalytics] = useState(null);
  const [subjectAnalytics, setSubjectAnalytics] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

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

    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        setAnalyticsError("");

        const [overviewRes, subjectsRes] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/subjects"),
        ]);

        setAnalytics(overviewRes.data.analytics);
        setSubjectAnalytics(subjectsRes.data.subjects);
      } catch (err) {
        setAnalyticsError(
          err.response?.data?.message ||
            "Unable to load performance analytics."
        );
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchDashboardStats();
    fetchAnalytics();
  }, []);

  const navigationItems = [
    { path: "/admin", label: "Dashboard", icon: "▦", end: true },
    { path: "/admin/students", label: "Students", icon: "♙" },
    { path: "/admin/subjects", label: "Subjects", icon: "◤" },
    { path: "/admin/exams", label: "Exams", icon: "◣" },
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
      icon: "◤",
      color: "purple",
    },
    {
      label: "Total Exams",
      value: stats.exams,
      icon: "◣",
      color: "orange",
    },
    {
      label: "Total Results",
      value: stats.results,
      icon: "◈",
      color: "green",
    },
  ];

  const grades = ["A+", "A", "B", "C", "D", "E", "F"];

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

          {/* Overall Performance Analytics */}
          <section className="activity-section">
            <div className="section-heading">
              <h2>Overall Performance Analytics</h2>
              <p>Institution-wide academic performance</p>
            </div>

            {analyticsLoading && <p>Loading performance analytics...</p>}

            {analyticsError && (
              <p className="error-message">{analyticsError}</p>
            )}

            {!analyticsLoading && !analyticsError && analytics && (
              <>
                <div className="dashboard-cards">
                  <div className="dashboard-card stat-blue">
                    <div className="stat-card-top">
                      <span>Average Percentage</span>
                    </div>
                    <h3>{analytics.averagePercentage}%</h3>
                    <p>Across all recorded results</p>
                  </div>

                  <div className="dashboard-card stat-green">
                    <div className="stat-card-top">
                      <span>Pass Rate</span>
                    </div>
                    <h3>{analytics.passRate}%</h3>
                    <p>Of recorded results</p>
                  </div>

                  <div className="dashboard-card stat-purple">
                    <div className="stat-card-top">
                      <span>Passed Results</span>
                    </div>
                    <h3>{analytics.passedResults}</h3>
                    <p>Successful results</p>
                  </div>

                  <div className="dashboard-card stat-orange">
                    <div className="stat-card-top">
                      <span>Failed Results</span>
                    </div>
                    <h3>{analytics.failedResults}</h3>
                    <p>Unsuccessful results</p>
                  </div>
                </div>

                <div className="section-heading" style={{ marginTop: "28px" }}>
                  <h2>Grade Distribution</h2>
                  <p>Number of results in each grade category</p>
                </div>

                <div className="dashboard-cards">
                  {grades.map((grade) => (
                    <div className="dashboard-card" key={grade}>
                      <div className="stat-card-top">
                        <span>Grade {grade}</span>
                      </div>
                      <h3>
                        {analytics.gradeDistribution?.[grade] ?? 0}
                      </h3>
                      <p>Recorded results</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Subject-wise Performance Analytics */}
          <section className="activity-section">
            <div className="section-heading">
              <h2>Subject-wise Performance</h2>
              <p>Compare academic performance across subjects</p>
            </div>

            {!analyticsLoading &&
              !analyticsError &&
              subjectAnalytics.length === 0 && (
                <p>No subject performance data available yet.</p>
              )}

            {!analyticsLoading &&
              !analyticsError &&
              subjectAnalytics.length > 0 && (
                <>
                  <div className="dashboard-cards">
                    <div className="dashboard-card stat-green">
                      <div className="stat-card-top">
                        <span>Highest Performing Subject</span>
                      </div>
                      <h3>
                        {subjectAnalytics[0].subjectName}
                      </h3>
                      <p>
                        Average: {subjectAnalytics[0].averagePercentage}%
                      </p>
                    </div>

                    <div className="dashboard-card stat-orange">
                      <div className="stat-card-top">
                        <span>Lowest Performing Subject</span>
                      </div>
                      <h3>
                        {subjectAnalytics[subjectAnalytics.length - 1].subjectName}
                      </h3>
                      <p>
                        Average: {
                          subjectAnalytics[subjectAnalytics.length - 1]
                            .averagePercentage
                        }%
                      </p>
                    </div>
                  </div>

                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Subject Code</th>
                          <th>Average</th>
                          <th>Pass Rate</th>
                          <th>Total Results</th>
                        </tr>
                      </thead>

                      <tbody>
                        {subjectAnalytics.map((subject) => (
                          <tr key={subject._id}>
                            <td>{subject.subjectName}</td>
                            <td>{subject.subjectCode}</td>
                            <td>{subject.averagePercentage}%</td>
                            <td>{subject.passRate}%</td>
                            <td>{subject.totalResults}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
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
