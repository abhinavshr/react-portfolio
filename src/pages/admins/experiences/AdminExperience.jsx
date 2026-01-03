import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Eye, Briefcase, Calendar, MapPin } from "lucide-react";
import "../../../css/admin/experiences/AdminExperience.css";
import Swal from "sweetalert2";

const AdminExperience = () => {
  const [active, setActive] = useState("Experience");

  const experiences = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "Tech Corp Inc.",
      duration: "Jan 2022 - Present",
      location: "San Francisco, CA",
      current: true,
      description:
        "Leading development of enterprise web applications using React and Node.js. Managing a team of 5 developers and coordinating with product management."
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Digital Solutions Ltd",
      duration: "Mar 2020 - Dec 2021",
      location: "New York, NY",
      current: false,
      description:
        "Developed and maintained multiple client-facing applications. Implemented CI/CD pipelines and improved application performance by 40%."
    },
    {
      id: 3,
      title: "Junior Developer",
      company: "StartupXYZ",
      duration: "Jun 2018 - Feb 2020",
      location: "Austin, TX",
      current: false,
      description:
        "Built responsive web applications and RESTful APIs. Collaborated with designers to implement pixel-perfect UI components."
    }
  ];

  const handleDelete = async (exp) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${exp.title}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Experience has been deleted.", "success");
    }
  };

  const handleView = (exp) => {
    Swal.fire({
      title: exp.title,
      text: exp.description,
      icon: "info",
      confirmButtonText: "Close"
    });
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="experience-container">
          {/* Header */}
          <div className="experience-header">
            <div>
              <h1>Experience</h1>
              <p>Manage your work experience</p>
            </div>

            <button className="add-experience-btn">
              <Plus size={18} /> Add Experience
            </button>
          </div>

          {/* Cards */}
          {experiences.map((exp) => (
            <div key={exp.id} className="experience-card">

              <div className="experience-card-header">
                <h2 className="experience-title">
                  <Briefcase className="experience-icon" />
                  {exp.title.replace(/\s/g, "-").toLowerCase()}
                </h2>

                <div className="experience-actions">
                  <button className="icon-btn view" onClick={() => handleView(exp)}>
                    <Eye size={28} />
                  </button>
                  <button className="icon-btn edit">
                    <Edit size={28} />
                  </button>
                  <button className="icon-btn delete" onClick={() => handleDelete(exp)}>
                    <Trash2 size={28} />
                  </button>
                </div>
              </div>

              <h4 className="company">{exp.company}</h4>

              <div className="experience-meta">
                <span>
                  <Calendar size={14} /> {exp.duration}
                </span>
                <span>
                  <MapPin size={14} /> {exp.location}
                </span>
                {exp.current && <span className="badge">Current</span>}
              </div>

              <p className="description">{exp.description}</p>
            </div>
          ))}

        </div>
      </main>
    </div>
  );
};

export default AdminExperience;
