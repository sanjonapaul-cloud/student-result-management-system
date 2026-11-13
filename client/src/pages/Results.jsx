
import { useEffect, useState } from "react";
import api from "../services/api";

const initialFormData = {
  student: "",
  exam: "",
  marksObtained: "",
};

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingResultId, setEditingResultId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Fetch results, students and exams
  const fetchData = async () => {
    try {
      setLoading(true);

      const [resultsRes, studentsRes, examsRes] =
        await Promise.all([
          api.get("/results"),
          api.get("/students"),
          api.get("/exams"),
        ]);

      setResults(resultsRes.data.results);
      setStudents(studentsRes.data.students);
      setExams(examsRes.data.exams);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch results data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open form for editing marks
  const handleEdit = (result) => {
    setEditingResultId(result._id);

    setFormData({
      student: result.student?._id || "",
      exam: result.exam?._id || "",
      marksObtained: result.marksObtained,
    });

    setShowForm(true);
    setError("");
    setMessage("");
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingResultId(null);
    setShowForm(false);
  };

  // Add or update result
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const resultData = {
        student: formData.student,
        exam: formData.exam,
        marksObtained: Number(formData.marksObtained),
      };

      if (editingResultId) {
        await api.put(
          `/results/${editingResultId}`,
          { marksObtained: resultData.marksObtained }
        );

        setMessage("Result updated successfully!");
      } else {
        await api.post("/results", resultData);
        setMessage("Result added successfully!");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save result."
      );
    }
  };

  // Delete result
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this result?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/results/${id}`);
      setMessage("Result deleted successfully!");
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete result."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Result Management</h1>
          <p>Manage student examination results.</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setEditingResultId(null);
              setFormData(initialFormData);
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "Add Result"}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <form className="student-form" onSubmit={handleSubmit}>
          <h2>
            {editingResultId ? "Edit Result" : "Add New Result"}
          </h2>

          <label htmlFor="student">Student</label>
          <select
            id="student"
            name="student"
            value={formData.student}
            onChange={handleChange}
            required
            disabled={Boolean(editingResultId)}
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>

          <label htmlFor="exam">Exam</label>
          <select
            id="exam"
            name="exam"
            value={formData.exam}
            onChange={handleChange}
            required
            disabled={Boolean(editingResultId)}
          >
            <option value="">Select Exam</option>

            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title} - {exam.subject?.subjectCode}
              </option>
            ))}
          </select>

          <label htmlFor="marksObtained">Marks Obtained</label>
          <input
            id="marksObtained"
            name="marksObtained"
            type="number"
            min="0"
            max={
              exams.find((exam) => exam._id === formData.exam)
                ?.totalMarks
            }
            value={formData.marksObtained}
            onChange={handleChange}
            placeholder="Enter marks obtained"
            required
          />

          <button type="submit">
            {editingResultId ? "Update Result" : "Save Result"}
          </button>

          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      <div className="table-container">
        {loading ? (
          <p>Loading results...</p>
        ) : results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result) => (
                <tr key={result._id}>
                  <td>
                    {result.student?.name}
                    <br />
                    {result.student?.email}
                  </td>

                  <td>{result.exam?.title}</td>

                  <td>
                    {result.exam?.subject?.name}
                  </td>

                  <td>
                    {result.marksObtained} / {result.exam?.totalMarks}
                  </td>

                  <td>{result.percentage}%</td>
                  <td>{result.grade}</td>
                  <td>{result.status}</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(result)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(result._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Results;
