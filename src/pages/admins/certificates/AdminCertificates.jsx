import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Award, ExternalLink } from "lucide-react";
import "../../../css/admin/certificates/AdminCertificates.css";
import Swal from "sweetalert2";

const AdminCertificates = () => {
  const [active, setActive] = useState("Certificates");

  const certificates = [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      issued: "June 2024",
      credentialId: "AWS-12345",
      verifyUrl: "#"
    },
    {
      id: 2,
      title: "Google Cloud Professional",
      organization: "Google Cloud",
      issued: "March 2024",
      credentialId: "GCP-67890",
      verifyUrl: "#"
    },
    {
      id: 3,
      title: "Certified Kubernetes Administrator",
      organization: "Cloud Native Computing Foundation",
      issued: "November 2023",
      credentialId: "CKA-54321",
      verifyUrl: "#"
    }
  ];

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
      Swal.fire("Deleted!", "Certificate has been deleted.", "success");
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

            <button className="add-certificate-btn">
              <Plus size={18} /> Add Certificate
            </button>
          </div>

          {/* Cards */}
          <div className="certificates-grid">
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
                <p className="certificate-org">{cert.organization}</p>

                <div className="certificate-meta">
                  <span>Issued: {cert.issued}</span>
                  <span>ID: {cert.credentialId}</span>
                </div>

                <a
                  href={cert.verifyUrl}
                  className="verify-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Verify <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminCertificates;
