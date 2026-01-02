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


const AdminEducation = () => {
    const [active, setActive] = useState("Education");
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [openAddModal, setOpenAddModal] = useState(false);
    const [selectedEducationId, setSelectedEducationId] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

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

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            setLoading(true);
            const response = await viewAllEducations();

            setEducations(response.data || response);
        } catch (err) {
            setError(err.message || "Failed to fetch educations");
        } finally {
            setLoading(false);
        }
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
                fetchEducations();
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

                    {/* Header */}
                    <div className="education-header">
                        <div>
                            <h1>Education</h1>
                            <p>Manage your educational background</p>
                        </div>

                        {/* Add Education Button */}
                        <button
                            className="add-education-btn"
                            onClick={() => setOpenAddModal(true)}
                        >
                            <Plus size={18} /> Add Education
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="empty-state">
                            <p>Loading educations...</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="empty-state error">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Cards */}
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

                    {/* Empty */}
                    {!loading && educations.length === 0 && (
                        <div className="empty-state">
                            <p>No education records found</p>
                        </div>
                    )}

                </div>
                {/* Add Education Modal */}
                <AddEducationModal
                    isOpen={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onEducationAdded={() => fetchEducations()}
                />

                {/* View Education Modal */}
                <ViewEducationModal
                    isOpen={isViewOpen}
                    onClose={handleCloseModal}
                    educationId={selectedEducationId}
                />

                {/* Edit Education Modal */}
                <EditEducationModal
                    isOpen={isEditOpen}
                    onClose={handleCloseEdit}
                    educationId={selectedEducationId}
                    onEducationUpdated={fetchEducations}
                />
            </main>
        </div>
    );
};

export default AdminEducation;
