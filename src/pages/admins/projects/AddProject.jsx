import React, { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/AddProject.css";
import { useNavigate } from "react-router-dom";
import { addProject, fetchCategories } from "../../../services/projectService";

const AddProject = () => {
  const [active, setActive] = useState("Projects");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    status: "",
    tech_stack: "",
    start_date: "",
    end_date: "",
    description: "",
    live_link: "",
    github_link: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status" && value !== "completed") {
      setForm((prev) => ({ ...prev, [name]: value, end_date: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title || !form.category_id || !form.tech_stack || !form.description) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (form.status === "completed" && !form.end_date) {
      alert("Please provide an end date for completed projects.");
      setLoading(false);
      return;
    }

    if (form.end_date && new Date(form.end_date) <= new Date(form.start_date)) {
      alert("End date must be after the start date.");
      setLoading(false);
      return;
    }


    try {
      const response = await addProject(form);
      alert(`Project added successfully! Response: ${JSON.stringify(response)}`);
      navigate(-1);
    } catch (error) {
      console.error("Error adding project:", error);
      alert(error.message || "Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="header">
          <button className="back-btn" onClick={handleBackClick}>
            &#8592;
          </button>
          <div className="header-text">
            <h1>Add New Project</h1>
            <p>Fill in the information to create a new project</p>
          </div>
        </div>

        <div className="section">
          <h2>Basic Information</h2>
          <form className="project-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>

              <div className="form-group">
                <label>Technologies *</label>
                <input
                  type="text"
                  name="tech_stack"
                  value={form.tech_stack}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  disabled={form.status !== "completed"}
                  required={form.status === "completed"}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter project description"
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Live URL</label>
                <input
                  type="url"
                  name="live_link"
                  value={form.live_link}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  name="github_link"
                  value={form.github_link}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="action-buttons">
              <button className="create-btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Project"}
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={handleBackClick}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProject;
