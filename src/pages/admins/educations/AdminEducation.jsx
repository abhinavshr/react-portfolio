import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Eye, GraduationCap, Calendar } from "lucide-react";
import "../../../css/admin/educations/AdminEducation.css";
import Swal from "sweetalert2";
import { viewAllEducations, deleteEducation } from "../../../services/educationService";
import AddEducationModal from "./AddEducationModal";
import ViewEducationModal from "./ViewEducationModal";
import EditEducationModal from "./EditEducationModal";
import Pagination from "../../../components/admin/Pagination";
import { motion as Motion } from "framer-motion";

const AdminEducation = () => {
  const [active, setActive] = useState("Education");
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalState, setModalState] = useState({
    add: false,
    view: false,
    edit: false,
    selectedId: null,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchEducations = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await viewAllEducations(page);
      const { data, current_page, last_page, total, from, to } = response.data;
      setEducations(data || []);
      setPagination({ currentPage: current_page, lastPage: last_page, total, from, to });
    } catch (err) {
      Swal.fire("Error!", err.message || "Failed to fetch educations", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

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
              onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
            >
              <Plus size={18} /> Add Education
            </button>
          </div>

          {loading && <div className="empty-state"><p>Loading educations...</p></div>}

          {!loading && educations.length > 0 ? (
            educations.map((edu, index) => (
              <Motion.div
                key={edu.id}
                className="education-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(37,99,235,0.4)" }}
              >
                <div className="education-card-header">
                  <h2 className="education-title">
                    <GraduationCap size={20} className="edu-icon" />
                    {edu.level} {edu.program && `(${edu.program})`}
                  </h2>
                  <div className="education-actions">
                    <button
                      className="icon-btn view"
                      title="View"
                      onClick={() => setModalState({ view: true, selectedId: edu.id, add: false, edit: false })}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="icon-btn edit"
                      title="Edit"
                      onClick={() => setModalState({ edit: true, selectedId: edu.id, add: false, view: false })}
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

                <p className="education-description">{edu.description}</p>
              </Motion.div>
            ))
          ) : (
            !loading && <div className="empty-state"><p>No education records found</p></div>
          )}

          {!loading && educations.length > 0 && (
            <div className="table-footer-education">
              <div className="table-summary">
                Showing {pagination.from} to {pagination.to} of {pagination.total} educations
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => fetchEducations(page)}
              />
            </div>
          )}
        </div>

        <AddEducationModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          onEducationAdded={() => fetchEducations(pagination.currentPage)}
        />

        {modalState.view && modalState.selectedId && (
          <ViewEducationModal
            isOpen={modalState.view}
            onClose={() => setModalState((prev) => ({ ...prev, view: false, selectedId: null }))}
            educationId={modalState.selectedId}
          />
        )}

        {modalState.edit && modalState.selectedId && (
          <EditEducationModal
            isOpen={modalState.edit}
            onClose={() => setModalState((prev) => ({ ...prev, edit: false, selectedId: null }))}
            educationId={modalState.selectedId}
            onEducationUpdated={() => fetchEducations(pagination.currentPage)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminEducation;
