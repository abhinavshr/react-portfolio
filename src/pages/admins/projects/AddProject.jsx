import React, { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/AddProject.css";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const [active, setActive] = useState("Projects");

  const categories = [
    { id: 1, name: "Web Development" },
    { id: 2, name: "Mobile App" },
    { id: 3, name: "Machine Learning" },
    { id: 4, name: "Blockchain" },
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBackClick = () => {
    navigate(-1);
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
          <form className="project-form">
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
          </form>
        </div>

        <div className="action-buttons">
          <button className="create-btn" disabled>
            Create Project
          </button>
          <button className="cancel-btn" onClick={handleBackClick}>
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
};

export default AddProject;
