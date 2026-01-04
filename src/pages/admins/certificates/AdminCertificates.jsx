import { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Award, ExternalLink } from "lucide-react";
import "../../../css/admin/certificates/AdminCertificates.css";
import Swal from "sweetalert2";
import { viewAllCertificates } from "../../../services/certificatesService";
import AddCertificateModal from "./AddCertificateModal";

const AdminCertificates = () => {
    const [active, setActive] = useState("Certificates");
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);

    // Fetch certificates
    const fetchCertificates = async () => {
        try {
            const res = await viewAllCertificates();
            setCertificates(res.certificates || []);
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to load certificates", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleDelete = async (cert) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Delete "${cert.title}" certificate?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            // call delete API here later
            Swal.fire("Deleted!", "Certificate has been deleted.", "success");
            // fetchCertificates();
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar active={active} setActive={setActive} />

            <main className="admin-content">
                <div className="certificates-container">

                    {/* Header */}
                    <div className="certificates-header">
                        <div>
                            <h1>Certificates</h1>
                            <p>Manage your professional certifications</p>
                        </div>

                        <button
                            className="add-certificate-btn"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus size={18} /> Add Certificate
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && <p>Loading certificates...</p>}

                    {/* Cards */}
                    <div className="certificates-grid">
                        {!loading && certificates.length === 0 && (
                            <p>No certificates found.</p>
                        )}

                        {certificates.map((cert) => (
                            <div key={cert.id} className="certificate-card">

                                <div className="certificate-top">
                                    <div className="certificate-icon">
                                        <Award size={26} />
                                    </div>

                                    <div className="certificate-actions">
                                        <button className="icon-btn edit">
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className="icon-btn delete"
                                            onClick={() => handleDelete(cert)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="certificate-title">{cert.title}</h3>
                                <p className="certificate-org">{cert.issuer}</p>

                                <div className="certificate-meta">
                                    <span>Issued: {cert.issue_date}</span>
                                    {cert.credential_id && (
                                        <span>ID: {cert.credential_id}</span>
                                    )}
                                </div>

                                {cert.verification_url && (
                                    <a
                                        href={cert.verification_url}
                                        className="verify-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Verify <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
                {/* AddCertificateModal */}
                {showAddModal && (
                    <AddCertificateModal
                        onClose={() => setShowAddModal(false)} 
                    />
                )}
            </main>
        </div>
    );
};

export default AdminCertificates;
