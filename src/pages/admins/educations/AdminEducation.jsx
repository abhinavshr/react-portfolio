import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Eye, GraduationCap } from "lucide-react";
import "../../../css/admin/educations/AdminEducation.css";
import Swal from "sweetalert2";

const AdminEducation = () => {
    const [active, setActive] = useState("Education");

    const educations = [
        {
            id: 1,
            degree: "Master of Science in Computer Science",
            institution: "Stanford University",
            duration: "2016 - 2018",
            description:
                "Specialized in Machine Learning and Artificial Intelligence with focus on neural networks and deep learning."
        },
        {
            id: 2,
            degree: "Bachelor of Science in Software Engineering",
            institution: "UC Berkeley",
            duration: "2012 - 2016",
            description:
                "Dean's List, Computer Science Honor Society, focus on full-stack development."
        },
        {
            id: 3,
            degree: "High School in Science Stream",
            institution: "Lincoln High School",
            duration: "2010 - 2012 · Board: State Board",
            description:
                "Graduated with honors, member of the computer club and mathematics society."
        }
    ];

    const handleDelete = async (education) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete "${education.degree}"`,
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

                        <button className="add-education-btn">
                            <Plus size={18} /> Add Education
                        </button>
                    </div>

                    {/* Cards */}
                    {educations.map((edu) => (
                        <div key={edu.id} className="education-card">
                            <div className="education-card-header">
                                <h2 className="education-title">
                                    <GraduationCap size={20} className="edu-icon" />
                                    {edu.degree}
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
                            <span className="education-duration">{edu.duration}</span>

                            <p>{edu.description}</p>
                        </div>
                    ))}

                </div>
            </main>
        </div>
    );
};

export default AdminEducation;
