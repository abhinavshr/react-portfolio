import { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Eye, Briefcase, Calendar, MapPin } from "lucide-react";
import "../../../css/admin/experiences/AdminExperience.css";
import Swal from "sweetalert2";
import { viewAllExperiences, deleteExperience } from "../../../services/experienceService";
import AddExperienceModal from "./AddExperienceModal";
import ViewExperienceModal from "./ViewExperienceModal";
import EditExperienceModal from "./EditExperienceModal";

const AdminExperience = () => {
  const [active, setActive] = useState("Experience");
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await viewAllExperiences();
      setExperiences(response.data.data || response);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to fetch experiences", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleDelete = async (exp) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${exp.company_name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await deleteExperience(exp.id);
        Swal.fire("Deleted!", "Experience has been deleted.", "success");
        fetchExperiences();
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to delete experience", "error");
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />
      <main className="admin-content">
        <div className="experience-container">
          <div className="experience-header">
            <div>
              <h1>Experience</h1>
              <p>Manage your work experience</p>
            </div>
            <button
              className="add-experience-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              Add Experience
            </button>
          </div>
          {loading && <p>Loading experiences...</p>}
          {!loading && experiences.length === 0 && <p>No experiences found.</p>}
          {!loading &&
            experiences.map((exp) => (
              <div key={exp.id} className="experience-card">
                <div className="experience-card-header">
                  <h2 className="experience-title">
                    <Briefcase className="experience-icon" />
                    {exp.role}
                  </h2>
                  <div className="experience-actions">
                    <button
                      className="icon-btn view"
                      onClick={() => {
                        setSelectedExperienceId(exp.id);
                        setViewModalOpen(true);
                      }}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="icon-btn edit"
                      onClick={() => {
                        setSelectedExperienceId(exp.id);
                        setEditModalOpen(true);
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(exp)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h4 className="company">{exp.company_name}</h4>
                <div className="experience-meta">
                  <span>
                    <Calendar size={14} /> {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                  </span>
                  <span>
                    <MapPin size={14} /> {exp.company_location || "N/A"}
                  </span>
                  {exp.is_current && <span className="badge">Current</span>}
                </div>
                <p className="experience-description">{exp.description}</p>
              </div>
            ))}
        </div>
        <AddExperienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExperienceAdded={() => fetchExperiences()}
        />

        <ViewExperienceModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          experienceId={selectedExperienceId}
        />

        <EditExperienceModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedExperienceId(null);
          }}
          experienceId={selectedExperienceId}
          onExperienceUpdated={fetchExperiences}
        />
      </main>
    </div>
  );
};

export default AdminExperience;
