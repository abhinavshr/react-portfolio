import React, { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNavigate } from "react-router-dom";
import "../../../css/admin/ProjectImage/AddProjectImage.css";
import { FiUploadCloud } from "react-icons/fi";


const AddProjectImage = () => {
  const [active, setActive] = useState("Project Images");
  const [form, setForm] = useState({
    project_id: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const projects = [
    { id: 1, title: "E-commerce Platform" },
    { id: 2, title: "Portfolio Website" },
    { id: 3, title: "Blog Platform" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files[0]) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.project_id || !form.image) {
      alert("Please select project and image");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      alert("Project image uploaded successfully!");
      setLoading(false);
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="add-project-image-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="add-project-image-content">
        {/* Header */}
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

        {/* Form Card */}
        <div className="add-project-image-card">
          <form onSubmit={handleSubmit}>
            {/* Project */}
            <div className="add-project-image-group">
              <label>Project *</label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload */}
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
                    Click to upload images
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

            {/* Preview */}
            {preview && (
              <div className="add-project-image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}

            {/* Actions */}
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
