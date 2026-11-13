
import { useEffect, useState } from "react";
import api from "../services/api";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  rollNumber: "",
  department: "",
  semester: "",
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/students");
      setStudents(response.data.students);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Open form with existing student details
  const handleEdit = (student) => {
    setEditingStudentId(student._id);

    setFormData({
      name: student.name || "",
      email: student.email || "",
      password: "",
      rollNumber: student.rollNumber || "",
      department: student.department || "",
      semester: student.semester ?? "",
    });

    setShowForm(true);
    setError("");
    setMessage("");
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingStudentId(null);
    setShowForm(false);
  };

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const studentData = {
        name: formData.name,
        email: formData.email,
        rollNumber: formData.rollNumber,
        department: formData.department,
        semester: Number(formData.semester),
      };

      if (editingStudentId) {
        // Update existing student
        await api.put(
          `/students/${editingStudentId}`,
          studentData
        );

        setMessage("Student updated successfully!");
      } else {
        // Add new student
        await api.post("/students", {
          ...studentData,
          password: formData.password,
        });

        setMessage("Student added successfully!");
      }

      resetForm();
      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingStudentId
            ? "Failed to update student."
            : "Failed to add student.")
      );
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/students/${id}`);
      setMessage("Student deleted successfully!");
      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete student."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Student Management</h1>
          <p>View and manage student records.</p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setEditingStudentId(null);
              setFormData(initialFormData);
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "Add Student"}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {showForm && (
        <form className="student-form" onSubmit={handleSubmit}>
          <h2>
            {editingStudentId ? "Edit Student" : "Add New Student"}
          </h2>

          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {!editingStudentId && (
            <input
              name="password"
              type="password"
              placeholder="Temporary Password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          )}

          <input
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />

          <input
            name="semester"
            type="number"
            placeholder="Semester (1-8)"
            min="1"
            max="8"
            value={formData.semester}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingStudentId ? "Update Student" : "Save Student"}
          </button>

          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      <div className="table-container">
        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.rollNumber || "—"}</td>
                  <td>{student.department || "—"}</td>
                  <td>{student.semester ?? "—"}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(student._id)}
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

export default Students;
