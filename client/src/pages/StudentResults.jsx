
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const StudentResults = () => {
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
          <a href="/student" className="sidebar-link">
            <span className="sidebar-icon">▦</span>
            My Dashboard
          </a>

          <a href="/student/results" className="sidebar-link active">
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
            <h2>My Examination Results</h2>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="student-content">
          <section className="welcome-section">
            <div>
              <h1>My Results</h1>
              <p>View your examination performance and academic grades.</p>
            </div>
            <span className="admin-status">
              <span className="status-dot"></span>
              Student Account
            </span>
          </section>

          <section className="student-results-section">
            <div className="section-heading">
              <h2>Examination Records</h2>
              <p>Your published examination results</p>
            </div>

            {loading && <p>Loading your results...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && results.length === 0 && (
              <div className="student-empty-state">
                <div className="empty-icon">◈</div>
                <h3>No Results Available</h3>
                <p>
                  Your examination results will appear here once
                  they are published.
                </p>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Examination</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((result) => (
                      <tr key={result._id}>
                        <td>{result.exam?.title}</td>
                        <td>{result.exam?.subject?.name}</td>
                        <td>
                          {result.marksObtained} / {result.exam?.totalMarks}
                        </td>
                        <td>{result.percentage}%</td>
                        <td><strong>{result.grade}</strong></td>
                        <td>
                          <span
                            className={
                              result.status === "Pass"
                                ? "result-status pass"
                                : "result-status fail"
                            }
                          >
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentResults;
