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
import { viewAllEducations } from "../../../services/educationService";
import AddEducationModal from "./AddEducationModal";


const AdminEducation = () => {
    const [active, setActive] = useState("Education");
    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [openAddModal, setOpenAddModal] = useState(false);

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            setLoading(true);
            const response = await viewAllEducations();

            // Works for both: { data: [] } or direct []
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
            Swal.fire("Deleted!", "Education has been deleted.", "success");
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
                                        <button className="icon-btn view" title="View">
                                            <Eye size={18} />
                                        </button>

                                        <button className="icon-btn edit" title="Edit">
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
                    onAdd={(data) => {
                        console.log("Education Data:", data);
                    }}
                />
            </main>
        </div>
    );
};

export default AdminEducation;
