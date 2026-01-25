import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Upload, Edit, Trash2, X } from "lucide-react";
import "../../../css/admin/ProjectImage/AdminProjectImages.css";
import {
  viewAllProjectImages,
  deleteProjectImage,
} from "../../../services/projectImageService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/Pagination";
import { motion as Motion } from "framer-motion";

const SkeletonProjectImage = () => (
  <div className="project-card skeleton-project-image">
    <div className="skeleton-image skeleton-input" />
    <div className="project-info">
      <div className="skeleton-input title" />
      <div className="skeleton-input caption" />
    </div>
    <div className="project-actions">
      <div className="skeleton-input btn" />
      <div className="skeleton-input btn" />
    </div>
  </div>
);

const AdminProjectImages = () => {
  const [active, setActive] = useState("Project Images");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProjectImages();
  }, []);

  const fetchProjectImages = async (page = 1) => {
    try {
      setLoading(true);
      const response = await viewAllProjectImages(page);
      setImages(response.data || []);
      setPagination({
        currentPage: response.pagination.current_page,
        lastPage: response.pagination.last_page,
        total: response.pagination.total,
        from:
          (response.pagination.current_page - 1) *
            response.pagination.per_page +
          1,
        to:
          (response.pagination.current_page - 1) *
            response.pagination.per_page +
          response.data.length,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch project images");
    } finally {
      setLoading(false);
    }
  };

  const handleClickUpload = () => {
    navigate("/admin/add/project-images");
  };

  const handleDelete = async (id, image) => {
    const title = `${image.project?.title} - ${image.image_name}`;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteProjectImage(id);
        Swal.fire(
          "Deleted!",
          `Project image "${title}" has been deleted.`,
          "success"
        );
        fetchProjectImages(pagination.currentPage);
      } catch (err) {
        Swal.fire(
          "Error!",
          err.message || "Failed to delete image",
          "error"
        );
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="admin-project-images-page">
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

          <div className="filter">
            <span>Filter by project:</span>
            <select className="filter-select" disabled>
              <option>All Projects</option>
            </select>
          </div>

          {loading && (
            <div className="projects-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProjectImage key={i} />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="empty-state error">
              <p>{error}</p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <>
              <div className="projects-grid">
                {images.map((image, index) => (
                  <Motion.div
                    key={image.id}
                    className="project-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 0 15px rgba(37,99,235,0.5)",
                    }}
                  >
                    <img
                      src={image.image_path}
                      alt={image.image_name}
                      className="clickable-image"
                      onClick={() => setSelectedImage(image)}
                    />

                    <div className="project-info">
                      <p className="project-name">{image.project?.title}</p>
                      <p className="project-caption">{image.image_name}</p>
                    </div>

                    <div className="project-actions">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(`/admin/edit/project-images/${image.id}`)
                        }
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(image.id, image)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </Motion.div>
                ))}
              </div>

              <div className="table-footer-project-image">
                <div className="table-summary-project-image">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} images
                </div>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.lastPage}
                  onPageChange={(page) => fetchProjectImages(page)}
                />
              </div>
            </>
          )}

          {!loading && images.length === 0 && (
            <div className="empty-state">
              <p>No images available</p>
            </div>
          )}

          {selectedImage && (
            <div className="image-modal" onClick={() => setSelectedImage(null)}>
              <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setSelectedImage(null)}>
                  <X size={28} />
                </button>
                <img src={selectedImage.image_path} alt={selectedImage.image_name} />
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
