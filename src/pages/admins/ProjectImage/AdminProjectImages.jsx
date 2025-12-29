import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Upload, Edit, Trash2, X } from "lucide-react";
import "../../../css/admin/ProjectImage/AdminProjectImages.css";
import { viewAllProjectImages } from "../../../services/projectImageService";
import { useNavigate } from "react-router-dom";

const AdminProjectImages = () => {
    const [active, setActive] = useState("Project Images");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchProjectImages();
    }, []);

    const handleClickUpload = () => {
        navigate("/admin/add/project-images");
    };

    const fetchProjectImages = async () => {
        try {
            setLoading(true);
            const response = await viewAllProjectImages();
            setImages(response.data);
        } catch (err) {
            setError(err.message || "Failed to fetch project images");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar active={active} setActive={setActive} />

            <main className="admin-content">
                <div className="admin-project-images-page">

                    {/* Header */}
                    <div className="projectimage-header">
                        <div>
                            <h1>Project Images</h1>
                            <p>Manage images for your projects</p>
                        </div>

                        <button className="upload-btn" onClick={handleClickUpload}>
                            <Upload size={20} style={{ marginRight: "8px" }} />
                            Upload to Project
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="filter">
                        <span>Filter by project:</span>
                        <select className="filter-select" disabled>
                            <option>All Projects</option>
                        </select>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="empty-state">
                            <p>Loading images...</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="empty-state error">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Images Grid */}
                    {!loading && images.length > 0 && (
                        <div className="projects-grid">
                            {images.map((image) => (
                                <div key={image.id} className="project-card">
                                    <img
                                        src={image.image_path}
                                        alt={image.image_name}
                                        className="clickable-image"
                                        onClick={() => setSelectedImage(image)}
                                    />

                                    <div className="project-info">
                                        <p className="project-name">
                                            {image.project?.title}
                                        </p>
                                        <p className="project-caption">
                                            {image.image_name}
                                        </p>
                                    </div>

                                    <div className="project-actions">
                                        <button className="edit-btn">
                                            <Edit size={16} /> Edit
                                        </button>
                                        <button className="delete-btn">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && images.length === 0 && (
                        <div className="empty-state">
                            <p>No images available</p>
                        </div>
                    )}

                    {selectedImage && (
                        <div
                            className="image-modal"
                            onClick={() => setSelectedImage(null)}
                        >
                            <div
                                className="image-modal-content"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <X size={28} />
                                </button>

                                <img
                                    src={selectedImage.image_path}
                                    alt={selectedImage.image_name}
                                />

                                <div className="modal-info">
                                    <h3>{selectedImage.project?.title}</h3>
                                    <p>{selectedImage.image_name}</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default AdminProjectImages;
