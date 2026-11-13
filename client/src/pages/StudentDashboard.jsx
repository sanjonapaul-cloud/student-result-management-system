
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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Student Dashboard</h1>
          <p>Student Result Management System</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <h2>Welcome, {user?.name}</h2>
        <p>You are logged in as a Student.</p>

        <section className="table-container">
          <h2>My Examination Results</h2>

          {loading && <p>Loading your results...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && results.length === 0 && (
            <p>No examination results available yet.</p>
          )}

          {!loading && !error && results.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Exam</th>
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
                    <td>{result.grade}</td>
                    <td>{result.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
