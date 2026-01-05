import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNavigate } from "react-router-dom";
import "../../../css/admin/ProjectImage/AddProjectImage.css";
import { FiUploadCloud } from "react-icons/fi";
import { fetchProjectsDropdown, uploadProjectImage } from "../../../services/projectImageService";
import Swal from "sweetalert2";

const AddProjectImage = () => {
  const [active, setActive] = useState("Project Images");
  const [form, setForm] = useState({ project_id: "", image_name: "", image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetchProjectsDropdown();
        setProjects(res.projects || []);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to load projects",
        });
      } finally {
        setProjectsLoading(false);
      }
    };
    loadProjects();
  }, []);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.project_id || !form.image || !form.image_name) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select project, enter image name, and choose an image",
      });
      return;
    }

    setLoading(true);
    try {
      await uploadProjectImage({
        project_id: form.project_id,
        image_name: form.image_name,
        image: form.image,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Project image uploaded successfully!",
        confirmButtonText: "OK",
      }).then(() => navigate(-1));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Failed to upload project image",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="add-project-image-layout">
      <AdminSidebar active={active} setActive={setActive} />
      <main className="add-project-image-content">
        <div className="add-project-image-header">
          <button
            className="add-project-image-back-btn"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
          <div>
            <h1>Add Project Image</h1>
            <p>Upload image for selected project</p>
          </div>
        </div>
        <div className="add-project-image-card">
          <form onSubmit={handleSubmit}>
            <div className="add-project-image-group">
              <label>Project *</label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                disabled={projectsLoading}
              >
                <option value="">
                  {projectsLoading ? "Loading projects..." : "Select project"}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-project-image-group">
              <label>Image Name *</label>
              <input
                type="text"
                name="image_name"
                value={form.image_name}
                onChange={handleChange}
                placeholder="Enter image name"
              />
            </div>
            <div className="add-project-image-group">
              <label>Image *</label>
              <div
                className="add-project-image-upload-box"
                onClick={() =>
                  document.getElementById("addProjectImageInput").click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="add-project-image-upload-content">
                  <div className="add-project-image-upload-icon">
                    <FiUploadCloud size={36} />
                  </div>
                  <p className="add-project-image-upload-title">
                    Click to upload image
                  </p>
                  <p className="add-project-image-upload-sub">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <input
                  id="addProjectImageInput"
                  type="file"
                  name="image"
                  accept="image/*"
                  hidden
                  onChange={handleChange}
                />
              </div>
            </div>
            {preview && (
              <div className="add-project-image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
            <div className="add-project-image-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Image"}
              </button>
              <button
                type="button"
                className="add-project-image-cancel"
                onClick={() => navigate(-1)}
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

export default AddProjectImage;
