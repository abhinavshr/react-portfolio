/**
 * @file EditProject.jsx
 * @description Administrative interface for updating existing portfolio projects.
 * Loads project data and allows refining its details.
 */

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/AddProject.css";
import { viewProjectById, updateProject, fetchCategories } from "../../../services/projectService";
import { ChevronLeft, Save, Briefcase, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * EditProject Component
 * @description Provides a form-based interface to modify existing project records.
 */
const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- State Management ---
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

  /**
   * Helper to format API date strings to YYYY-MM-DD for input fields.
   * @param {string} dateString - Date from API.
   * @returns {string} Formatted date.
   */
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "";

  // --- Data Fetching ---

  /**
   * Loads the specific project data and category list.
   */
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load project data"
      }).then(() =>
        navigate("/admin/projects")
      );
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjectAndCategories();
  }, [fetchProjectAndCategories]);

  // --- Handlers ---

  /**
   * Updates state on field change. 
   * Resets end_date if status is changed from completed.
   */
  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "status" && value !== "completed" ? { end_date: "" } : {}),
    }));
  };

  /**
   * Navigates back.
   */
  const handleBackClick = () => navigate(-1);

  /**
   * Local validation rules.
   * @returns {Object|null}
   */
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

  /**
   * Handles form submission to update the project.
   */
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
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.message || "Failed to update project" });
    } finally {
      setUpdating(false);
    }
  };

  // --- Animations ---
  useGSAP(() => {
    if (!loading) {
      gsap.from(".header", {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      gsap.from(".project-form", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out"
      });
    }
  }, [loading]);

  // --- Loading State Render ---
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

  // --- Main Render ---
  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        {/* Page Header */}
        <div className="header">
          <button className="back-btn" onClick={handleBackClick} title="Go Back">
            <ChevronLeft size={24} />
          </button>
          <div className="header-text">
            <h1>Edit Project</h1>
            <p>Update information and maintain your portfolio project state</p>
          </div>
        </div>

        {/* Update Form Section */}
        <div className="section">
          <h2><Briefcase size={18} /> Update Details</h2>
          <form className="project-form" onSubmit={handleSubmit}>
            {/* Name and Category Selection */}
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

            {/* Status and Tech Stack Badges */}
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

            {/* Timeline Row */}
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

            {/* Multi-line Description */}
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Enter project description" required rows="6" />
            </div>

            {/* External Repository/Live Links */}
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

            {/* Form Actions */}
            <div className="action-buttons">
              <button className="create-btn" type="submit" disabled={updating}>
                {updating ? (
                  <div className="spinner-mini"></div>
                ) : (
                  <><Save size={18} /> Update Project</>
                )}
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

