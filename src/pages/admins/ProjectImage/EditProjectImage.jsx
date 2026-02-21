/**
 * @file EditProjectImage.jsx
 * @description Component for updating existing project images/artifacts.
 * Allows changing the project association, image label, or the image file itself.
 */

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/ProjectImage/AddProjectImage.css";
import { UploadCloud, ChevronLeft, Briefcase, Tag, Image as ImageIcon } from "lucide-react";
import { fetchProjectsDropdown, getProjectImageById, editProjectImage } from "../../../services/projectImageService";
import Swal from "sweetalert2";
import gsap from "gsap";

/**
 * EditProjectImage Component
 * @description Provides an interface to refine details of a previously uploaded project artifact.
 */
const EditProjectImage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- State Management ---
    const [active, setActive] = useState("Project Images");
    const [form, setForm] = useState({ project_id: "", image_name: "", image: null });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);

    const containerRef = useRef(null);
    const cardRef = useRef(null);

    // --- Side Effects ---

    useEffect(() => {
        /**
         * Loads existing image data and the list of available projects.
         */
        const loadData = async () => {
            try {
                // Fetch the specific image details
                const res = await getProjectImageById(id);
                const img = res.data;

                setForm({
                    project_id: img.project_id || "",
                    image_name: img.image_name || "",
                    image: null // Reset file input
                });
                setPreview(img.image_path || "");

                // Fetch projects for the dropdown
                const projectsRes = await fetchProjectsDropdown();
                setProjects(projectsRes.projects || []);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "Failed to load image",
                });
            } finally {
                setProjectsLoading(false);
            }
        };

        loadData();

        // Entry animations
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
        );
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
        );
    }, [id]);

    // --- Form Handlers ---

    /**
     * Handles input changes and file selection for preview.
     * @param {React.ChangeEvent} e - The change event.
     */
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files?.[0]) {
            setForm((prev) => ({ ...prev, image: files[0] }));
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    /**
     * Handles file drops onto the upload box.
     * @param {React.DragEvent} e - The drag event.
     */
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setForm((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    /**
     * Submits the updated image data.
     * @param {React.FormEvent} e - The submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.project_id || !form.image_name) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please fill project and image name",
                background: "#ffffff",
                confirmButtonColor: "#6366f1",
            });
            return;
        }

        setLoading(true);
        try {
            await editProjectImage({
                id,
                project_id: form.project_id,
                image_name: form.image_name,
                image: form.image || undefined, // Only send if a new image was selected
            });

            Swal.fire({
                icon: "success",
                title: "Updated",
                text: "Project image updated successfully!",
                confirmButtonText: "Back to Gallery",
                confirmButtonColor: "#6366f1",
            }).then(() => navigate(-1));

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: err.message || "Failed to update project image",
            });
        } finally {
            setLoading(false);
        }
    };

    // --- Render ---
    return (
        <div className="add-project-image-layout">
            {/* Sidebar Navigation */}
            <AdminSidebar active={active} setActive={setActive} />

            <main className="add-project-image-content">
                {/* Page Header with Back Button */}
                <div className="add-project-image-header" ref={containerRef}>
                    <button
                        className="add-project-image-back-btn"
                        onClick={() => navigate(-1)}
                        aria-label="Back to gallery"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1>Refine Artifact</h1>
                        <p>Update the visual details for your project showcase</p>
                    </div>
                </div>

                {/* Edit Form Card */}
                <div className="add-project-image-card" ref={cardRef}>
                    <form onSubmit={handleSubmit}>
                        {/* Project Reference Selection */}
                        <div className="add-project-image-group">
                            <label>
                                <Briefcase size={16} color="#6366f1" />
                                Project Reference *
                            </label>
                            <select
                                name="project_id"
                                value={form.project_id || ""}
                                onChange={handleChange}
                                disabled={projectsLoading}
                            >
                                <option value="">{projectsLoading ? "Loading projects..." : "Select project"}</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image Label Input */}
                        <div className="add-project-image-group">
                            <label>
                                <Tag size={16} color="#6366f1" />
                                Image Label *
                            </label>
                            <input
                                type="text"
                                name="image_name"
                                value={form.image_name || ""}
                                onChange={handleChange}
                                placeholder="e.g., Main Showcase, Feature Detail"
                            />
                        </div>

                        {/* Asset Replacement Area */}
                        <div className="add-project-image-group">
                            <label>
                                <ImageIcon size={16} color="#6366f1" />
                                Updated Asset
                            </label>
                            <div
                                className="add-project-image-upload-box"
                                onClick={() => document.getElementById("editProjectImageInput").click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <div className="add-project-image-upload-content">
                                    <div className="add-project-image-upload-icon">
                                        <UploadCloud size={48} />
                                    </div>
                                    <p className="add-project-image-upload-title">Click or drag to replace image</p>
                                    <p className="add-project-image-upload-sub">Leave empty to keep existing asset</p>
                                </div>
                                <input
                                    id="editProjectImageInput"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    hidden
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Current/New Image Preview */}
                        {preview && (
                            <div className="add-project-image-preview">
                                <img src={preview} alt="Asset Preview" />
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="add-project-image-actions">
                            <button type="submit" disabled={loading}>
                                {loading ? "Saving Changes..." : "Apply Updates"}
                            </button>
                            <button type="button" className="add-project-image-cancel" onClick={() => navigate(-1)}>
                                Discard Edits
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditProjectImage;

