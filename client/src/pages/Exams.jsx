
import { useEffect, useState } from "react";
import api from "../services/api";

const initialFormData = {
  title: "",
  subject: "",
  examType: "Internal",
  academicYear: "",
  examDate: "",
  totalMarks: "",
  passingMarks: "",
};

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Fetch exams and subjects
  const fetchData = async () => {
    try {
      setLoading(true);

      const [examsResponse, subjectsResponse] = await Promise.all([
        api.get("/exams"),
        api.get("/subjects"),
      ]);

      setExams(examsResponse.data.exams);
      setSubjects(subjectsResponse.data.subjects);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch exams or subjects."
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

  // Open form with existing exam details
  const handleEdit = (exam) => {
    setEditingExamId(exam._id);

    setFormData({
      title: exam.title || "",
      subject: exam.subject?._id || "",
      examType: exam.examType || "Internal",
      academicYear: exam.academicYear || "",
      examDate: exam.examDate
        ? exam.examDate.slice(0, 10)
        : "",
      totalMarks: exam.totalMarks ?? "",
      passingMarks: exam.passingMarks ?? "",
    });

    setShowForm(true);
    setError("");
    setMessage("");
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingExamId(null);
    setShowForm(false);
  };

  // Add or update exam
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const examData = {
        ...formData,
        totalMarks: Number(formData.totalMarks),
        passingMarks: Number(formData.passingMarks),
      };

      if (editingExamId) {
        await api.put(`/exams/${editingExamId}`, examData);
        setMessage("Exam updated successfully!");
      } else {
        await api.post("/exams", examData);
        setMessage("Exam added successfully!");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingExamId
            ? "Failed to update exam."
            : "Failed to add exam.")
      );
    }
  };

  // Delete exam
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/exams/${id}`);
      setMessage("Exam deleted successfully!");
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete exam."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Exam Management</h1>
          <p>View and manage examination records.</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setEditingExamId(null);
              setFormData(initialFormData);
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "Add Exam"}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}


{showForm && (
  <form className="student-form exam-form" onSubmit={handleSubmit}>
    <h2>{editingExamId ? "Edit Exam" : "Add New Exam"}</h2>

    <div className="form-group">
      <label htmlFor="title">Exam Title</label>
      <input
        id="title"
        name="title"
        placeholder="Exam Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="subject">Subject</label>
      <select
        id="subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
      >
        <option value="">Select Subject</option>
        {subjects.map((subject) => (
          <option key={subject._id} value={subject._id}>
            {subject.name} ({subject.subjectCode})
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="examType">Exam Type</label>
      <select
        id="examType"
        name="examType"
        value={formData.examType}
        onChange={handleChange}
        required
      >
        <option value="Internal">Internal</option>
        <option value="Mid Semester">Mid Semester</option>
        <option value="End Semester">End Semester</option>
        <option value="Practical">Practical</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="academicYear">Academic Year</label>
      <input
        id="academicYear"
        name="academicYear"
        placeholder="e.g. 2026-2027"
        value={formData.academicYear}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="examDate">Exam Date</label>
      <input
        id="examDate"
        name="examDate"
        type="date"
        value={formData.examDate}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="totalMarks">Total Marks</label>
      <input
        id="totalMarks"
        name="totalMarks"
        type="number"
        placeholder="Total Marks"
        min="1"
        value={formData.totalMarks}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="passingMarks">Passing Marks</label>
      <input
        id="passingMarks"
        name="passingMarks"
        type="number"
        placeholder="Passing Marks"
        min="0"
        value={formData.passingMarks}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-actions">
      <button type="submit">
        {editingExamId ? "Update Exam" : "Save Exam"}
      </button>

      <button type="button" onClick={resetForm}>
        Cancel
      </button>
    </div>
  </form>
)}


      <div className="table-container">
        {loading ? (
          <p>Loading exams...</p>
        ) : exams.length === 0 ? (
          <p>No exams found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Exam Title</th>
                <th>Subject</th>
                <th>Exam Type</th>
                <th>Academic Year</th>
                <th>Exam Date</th>
                <th>Total Marks</th>
                <th>Passing Marks</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.title}</td>
                  <td>
                    {exam.subject?.name} (
                    {exam.subject?.subjectCode})
                  </td>
                  <td>{exam.examType}</td>
                  <td>{exam.academicYear}</td>
                  <td>
                    {new Date(exam.examDate).toLocaleDateString()}
                  </td>
                  <td>{exam.totalMarks}</td>
                  <td>{exam.passingMarks}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(exam)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(exam._id)}
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

export default Exams;
