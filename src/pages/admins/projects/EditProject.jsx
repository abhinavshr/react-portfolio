import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/AddProject.css";
import { viewProjectById, updateProject, fetchCategories } from "../../../services/projectService";
import Swal from "sweetalert2";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [active, setActive] = useState("Projects");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  const fetchProjectAndCategories = useCallback(async () => {
    try {
      setLoading(true);
      const cats = await fetchCategories();
      setCategories(cats);

      const projectData = await viewProjectById(id);
      const project = projectData.project || projectData.data || projectData;

      setForm({
        title: project.title || "",
        category_id: project.category_id || project.category?.id || "",
        status: project.status || "",
        tech_stack: project.tech_stack || "",
        start_date: formatDate(project.start_date),
        end_date: formatDate(project.end_date),
        description: project.description || "",
        live_link: project.live_link || "",
        github_link: project.github_link || "",
      });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load project data", error}).then(() =>
        navigate("/admin/projects")
      );
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjectAndCategories();
  }, [fetchProjectAndCategories]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "status" && value !== "completed" ? { end_date: "" } : {}),
    }));
  };

  const handleBackClick = () => navigate(-1);

  const validateForm = () => {
    if (!form.title || !form.category_id || !form.tech_stack || !form.description) {
      return { type: "warning", title: "Missing Fields", text: "Please fill in all required fields." };
    }
    if (form.status === "completed" && !form.end_date) {
      return { type: "warning", title: "End Date Required", text: "Please provide an end date for completed projects." };
    }
    if (form.end_date && form.start_date && new Date(form.end_date) <= new Date(form.start_date)) {
      return { type: "error", title: "Invalid Date", text: "End date must be after the start date." };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({ icon: validationError.type, title: validationError.title, text: validationError.text });
      setUpdating(false);
      return;
    }

    try {
      await updateProject(id, form);
      Swal.fire({ icon: "success", title: "Updated", text: "Project updated successfully!" }).then(() =>
        navigate("/admin/projects")
      );
    } catch (error) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message || "Failed to update project" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar active={active} setActive={setActive} />
        <main className="admin-content">
          <div className="loading-state">Loading project data...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />
      <main className="admin-content">
        <div className="header">
          <button className="back-btn" onClick={handleBackClick}>&#8592;</button>
          <div className="header-text">
            <h1>Edit Project</h1>
            <p>Update the information for this project</p>
          </div>
        </div>

        <div className="section">
          <h2>Basic Information</h2>
          <form className="project-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Project Name *</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Enter project name" required />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category_id" value={form.category_id} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map(({ id, name }) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={form.status} onChange={handleChange} required>
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
              <div className="form-group">
                <label>Technologies *</label>
                <input type="text" name="tech_stack" value={form.tech_stack} onChange={handleChange} placeholder="e.g., React, Node.js, MongoDB" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" name="end_date" value={form.end_date} onChange={handleChange} disabled={form.status !== "completed"} required={form.status === "completed"} />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Enter project description" required rows="6" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Live URL</label>
                <input type="url" name="live_link" value={form.live_link} onChange={handleChange} placeholder="https://example.com" />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input type="url" name="github_link" value={form.github_link} onChange={handleChange} placeholder="https://github.com/username/repo" />
              </div>
            </div>

            <div className="action-buttons">
              <button className="create-btn" type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update Project"}
              </button>
              <button className="cancel-btn" type="button" onClick={handleBackClick}>Cancel</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProject;
