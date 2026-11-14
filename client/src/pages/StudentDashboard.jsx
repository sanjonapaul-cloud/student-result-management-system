
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [insights, setInsights] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState("");

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

    const fetchStudentInsights = async () => {
      try {
        setInsightsLoading(true);
        setInsightsError("");

        const response = await api.get("/analytics/student");
        setInsights(response.data.analytics);
      } catch (err) {
        setInsightsError(
          err.response?.data?.message ||
            "Failed to fetch performance insights."
        );
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchMyResults();
    fetchStudentInsights();
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

          {/* Existing Result Statistics */}
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

          {loading && <p>Loading your results...</p>}
          {error && <p className="error-message">{error}</p>}

          {/* Student Performance Insights */}
          <section className="student-results-section">
            <div className="section-heading">
              <h2>My Performance Insights</h2>
              <p>Understand your academic performance</p>
            </div>

            {insightsLoading && (
              <p>Loading your performance insights...</p>
            )}

            {insightsError && (
              <p className="error-message">{insightsError}</p>
            )}

            {!insightsLoading && !insightsError && insights && (
              <>
                <div className="student-stats">
                  <div className="student-stat-card">
                    <span>Average Percentage</span>
                    <h3>{insights.averagePercentage}%</h3>
                  </div>

                  <div className="student-stat-card">
                    <span>Strongest Subject</span>
                    <h3>
                      {insights.strongestSubject?.subjectName || "N/A"}
                    </h3>
                    <p>
                      {insights.strongestSubject
                        ? `${insights.strongestSubject.averagePercentage}% average`
                        : "No subject data yet"}
                    </p>
                  </div>
                </div>

                <div className="section-heading" style={{ marginTop: "28px" }}>
                  <h2>Examination Performance Trend</h2>
                  <p>Your performance across examinations</p>
                </div>

                {(!insights.examTrend ||
                  insights.examTrend.length === 0) && (
                  <div className="student-empty-state">
                    <h3>No Performance Trend Available</h3>
                    <p>
                      Your examination trend will appear here once
                      results are recorded.
                    </p>
                  </div>
                )}

                {insights.examTrend?.length > 0 && (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Examination</th>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Percentage</th>
                          <th>Grade</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {insights.examTrend.map((exam) => (
                          <tr key={exam._id}>
                            <td>{exam.examTitle}</td>
                            <td>{exam.subjectName}</td>
                            <td>
                              {exam.examDate
                                ? new Date(exam.examDate).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>{exam.percentage}%</td>
                            <td><strong>{exam.grade}</strong></td>
                            <td>
                              <span
                                className={
                                  exam.status === "Pass"
                                    ? "result-status pass"
                                    : "result-status fail"
                                }
                              >
                                {exam.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
