import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  Calendar
} from "lucide-react";
import "../../../css/admin/educations/AdminEducation.css";
import Swal from "sweetalert2";
import { viewAllEducations, deleteEducation } from "../../../services/educationService";
import AddEducationModal from "./AddEducationModal";
import ViewEducationModal from "./ViewEducationModal";
import EditEducationModal from "./EditEducationModal";
import Pagination from "../../../components/admin/Pagination";

const AdminEducation = () => {
  const [active, setActive] = useState("Education");
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async (page = 1) => {
    try {
      setLoading(true);
      const response = await viewAllEducations(page);
      setEducations(response.data.data || []);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch educations");
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (id) => {
    setSelectedEducationId(id);
    setIsViewOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewOpen(false);
    setSelectedEducationId(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedEducationId(null);
  };

  const handleEditClick = (id) => {
    setSelectedEducationId(id);
    setIsEditOpen(true);
  };

  const handleDelete = async (edu) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${edu.level} (${edu.program})"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteEducation(edu.id);
        Swal.fire("Deleted!", "Education has been deleted.", "success");
        fetchEducations(pagination.currentPage);
      } catch (error) {
        Swal.fire("Error!", error.message || "Failed to delete education", "error");
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="admin-education-page">
          <div className="education-header">
            <div>
              <h1>Education</h1>
              <p>Manage your educational background</p>
            </div>

            <button
              className="add-education-btn"
              onClick={() => setOpenAddModal(true)}
            >
              <Plus size={18} /> Add Education
            </button>
          </div>

          {loading && (
            <div className="empty-state">
              <p>Loading educations...</p>
            </div>
          )}

          {error && (
            <div className="empty-state error">
              <p>{error}</p>
            </div>
          )}

          {!loading && educations.length > 0 &&
            educations.map((edu) => (
              <div key={edu.id} className="education-card">
                <div className="education-card-header">
                  <h2 className="education-title">
                    <GraduationCap size={20} className="edu-icon" />
                    {edu.level} {edu.program && `(${edu.program})`}
                  </h2>

                  <div className="education-actions">
                    <button
                      className="icon-btn view"
                      title="View"
                      onClick={() => handleViewClick(edu.id)}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="icon-btn edit"
                      title="Edit"
                      onClick={() => handleEditClick(edu.id)}
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      className="icon-btn delete"
                      title="Delete"
                      onClick={() => handleDelete(edu)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h4>{edu.institution}</h4>

                <div className="education-duration">
                  <Calendar size={16} className="calendar-icon" />
                  <span>
                    {edu.start_year} - {edu.end_year}
                    {edu.board && (
                      <>
                        <span className="dot">•</span>
                        Board: {edu.board}
                      </>
                    )}
                  </span>
                </div>

                <p className="education-description">
                  {edu.description}
                </p>
              </div>
            ))}

          {!loading && educations.length === 0 && (
            <div className="empty-state">
              <p>No education records found</p>
            </div>
          )}

          {!loading && educations.length > 0 && (
            <div className="table-footer-education">
              <div className="table-summary">
                Showing {pagination.from} to {pagination.to} of {pagination.total} educations
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => {
                  setLoading(true);
                  fetchEducations(page);
                }}
              />
            </div>
          )}
        </div>

        <AddEducationModal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onEducationAdded={() => fetchEducations(pagination.currentPage)}
        />

        <ViewEducationModal
          isOpen={isViewOpen}
          onClose={handleCloseModal}
          educationId={selectedEducationId}
        />

        <EditEducationModal
          isOpen={isEditOpen}
          onClose={handleCloseEdit}
          educationId={selectedEducationId}
          onEducationUpdated={() => fetchEducations(pagination.currentPage)}
        />
      </main>
    </div>
  );
};

export default AdminEducation;
