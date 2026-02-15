import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/ProjectImage/AddProjectImage.css";
import { UploadCloud, ChevronLeft, Briefcase, Tag, Image as ImageIcon } from "lucide-react";
import { fetchProjectsDropdown, getProjectImageById, editProjectImage } from "../../../services/projectImageService";
import Swal from "sweetalert2";
import gsap from "gsap";

const EditProjectImage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [active, setActive] = useState("Project Images");
    const [form, setForm] = useState({ project_id: "", image_name: "", image: null });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(true);

    const containerRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getProjectImageById(id);
                const img = res.data;

                setForm({
                    project_id: img.project_id || "",
                    image_name: img.image_name || "",
                    image: null
                });
                setPreview(img.image_path || "");

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

        // Animations
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
                image: form.image || undefined,
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

    return (
        <div className="add-project-image-layout">
            <AdminSidebar active={active} setActive={setActive} />

            <main className="add-project-image-content">
                <div className="add-project-image-header" ref={containerRef}>
                    <button className="add-project-image-back-btn" onClick={() => navigate(-1)}>
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1>Refine Artifact</h1>
                        <p>Update the visual details for your project showcase</p>
                    </div>
                </div>

                <div className="add-project-image-card" ref={cardRef}>
                    <form onSubmit={handleSubmit}>
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

                        {preview && (
                            <div className="add-project-image-preview">
                                <img src={preview} alt="Asset Preview" />
                            </div>
                        )}

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
