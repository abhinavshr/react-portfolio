/**
 * @file AdminProjectImages.jsx
 * @description Administrative interface for managing project showcase images (gallery).
 * Includes functionality for viewing, filtering, uploading, editing, and deleting project artifacts.
 */

import { useEffect, useState, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Upload, Edit, Trash2, X, Image as ImageIcon, Plus } from "lucide-react";
import "../../../css/admin/ProjectImage/AdminProjectImages.css";
import {
  viewAllProjectImages,
  deleteProjectImage,
} from "../../../services/projectImageService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/Pagination";
import gsap from "gsap";

/**
 * Skeleton Loader Component
 * @description Displays a placeholder UI while image data is being fetched.
 */
const SkeletonProjectImage = () => (
  <div className="project-card skeleton-project-image">
    <div className="skeleton-image skeleton-input" />
    <div className="skeleton-info">
      <div className="skeleton-input" style={{ width: "40%", height: "12px", marginBottom: "12px" }} />
      <div className="skeleton-input" style={{ width: "80%", height: "20px", marginBottom: "20px" }} />
      <div style={{ display: "flex", gap: "12px" }}>
        <div className="skeleton-input" style={{ flex: 1, height: "40px", borderRadius: "12px" }} />
        <div className="skeleton-input" style={{ flex: 1, height: "40px", borderRadius: "12px" }} />
      </div>
    </div>
  </div>
);

/**
 * AdminProjectImages Main Component
 * @description Manages the gallery of project images with full CRUD capabilities.
 */
const AdminProjectImages = () => {
  // --- State Management ---
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
  const gridRef = useRef(null);
  const headerRef = useRef(null);

  // --- Side Effects ---

  // Initial data fetch
  useEffect(() => {
    fetchProjectImages();
  }, []);

  // Staggered entry animation for project cards
  useEffect(() => {
    if (!loading && images.length > 0) {
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [loading, images]);

  // Header slide-in animation
  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  // --- Handler Functions ---

  /**
   * Fetches project images from the server with pagination support.
   * @param {number} page - The page number to fetch.
   */
  const fetchProjectImages = async (page = 1) => {
    try {
      setLoading(true);
      const response = await viewAllProjectImages(page);
      setImages(response.data || []);

      // Calculate pagination metadata
      setPagination({
        currentPage: response.pagination.current_page,
        lastPage: response.pagination.last_page,
        total: response.pagination.total,
        from: (response.pagination.current_page - 1) * response.pagination.per_page + 1,
        to: (response.pagination.current_page - 1) * response.pagination.per_page + response.data.length,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch project images");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigates to the upload page.
   */
  const handleClickUpload = () => {
    navigate("/admin/add/project-images");
  };

  /**
   * Handles the deletion of a project image with a confirmation dialog.
   * @param {number|string} id - The ID of the image to delete.
   * @param {Object} image - The image object for display in the confirmation dialog.
   */
  const handleDelete = async (id, image) => {
    const title = `${image.project?.title} - ${image.image_name}`;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        popup: "premium-swal-popup",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteProjectImage(id);
        Swal.fire({
          title: "Deleted!",
          text: `Project image "${title}" has been deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
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

  // --- Render ---
  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="admin-project-images-page">
          {/* Page Header */}
          <header className="projectimage-header" ref={headerRef}>
            <div>
              <h1>Project Gallery</h1>
              <p>Curate and manage your high-quality showcase images</p>
            </div>
            <button className="upload-btn" onClick={handleClickUpload}>
              <Plus size={20} />
              <span>Add New Image</span>
            </button>
          </header>

          {/* Filtering Section (Note: Filtering currently placeholder) */}
          <div className="filter">
            <ImageIcon size={18} color="#6366f1" />
            <span>Filter by project:</span>
            <select className="filter-select" disabled>
              <option>All Projects</option>
            </select>
          </div>

          {/* Main Content Area */}
          {loading ? (
            // Loading State
            <div className="projects-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProjectImage key={i} />
              ))}
            </div>
          ) : error ? (
            // Error State
            <div className="empty-state error">
              <p>{error}</p>
            </div>
          ) : images.length > 0 ? (
            // Success State: Gallery Grid
            <>
              <div className="projects-grid" ref={gridRef}>
                {images.map((image) => (
                  <div key={image.id} className="project-card">
                    {/* Image Preview */}
                    <img
                      src={image.image_path}
                      alt={image.image_name}
                      className="clickable-image"
                      onClick={() => setSelectedImage(image)}
                      loading="lazy"
                    />

                    {/* Image Information */}
                    <div className="project-info">
                      <p className="project-name">{image.project?.title}</p>
                      <p className="project-caption">{image.image_name}</p>
                    </div>

                    {/* Control Actions */}
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
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="table-footer-project-image">
                <div className="table-summary-project-image">
                  Showing <b>{pagination.from}–{pagination.to}</b> of <b>{pagination.total}</b> artifacts
                </div>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.lastPage}
                  onPageChange={(page) => fetchProjectImages(page)}
                />
              </div>
            </>
          ) : (
            // Empty State
            <div className="empty-state">
              <ImageIcon size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
              <p>No project images found. Start by uploading one!</p>
            </div>
          )}

          {/* Full-Screen Image Lightbox */}
          {selectedImage && (
            <div className="image-modal" onClick={() => setSelectedImage(null)}>
              <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setSelectedImage(null)}>
                  <X size={24} />
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

