import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Upload, Edit, Trash2 } from "lucide-react";
import "../../../css/admin/ProjectImage/AdminProjectImages.css";

const mockImages = [
    { id: 1, projectId: 1, projectName: "E-commerce Platform", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop", caption: "Dashboard Overview" },
    { id: 2, projectId: 1, projectName: "E-commerce Platform", url: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop", caption: "Product Listing" },
    { id: 3, projectId: 2, projectName: "Mobile Banking App", url: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=600&fit=crop", caption: "Mobile Interface" },
    { id: 4, projectId: 2, projectName: "Mobile Banking App", url: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&h=600&fit=crop", caption: "Transaction Screen" },
    { id: 5, projectId: 3, projectName: "AI Chat Interface", url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop", caption: "Chat UI" },
    { id: 6, projectId: 4, projectName: "Analytics Dashboard", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop", caption: "Analytics View" },
];

const projects = [
    { id: 1, name: "E-commerce Platform" },
    { id: 2, name: "Mobile Banking App" },
    { id: 3, name: "AI Chat Interface" },
    { id: 4, name: "Analytics Dashboard" },
];

const AdminProjectImages = () => {
    const [active, setActive] = useState("Project Images");

    return (
        <div className="admin-layout">
            <AdminSidebar active={active} setActive={setActive} />

            <main className="admin-content">
                <div className="admin-project-images-page">
                    {/* Header */}
                    <div className="header">
                        <div>
                            <h1>Project Images</h1>
                            <p>Manage images for your projects</p>
                        </div>

                        {/* Upload Button with icon and text */}
                        <div>
                            <button className="upload-btn">
                                <Upload size={20} style={{ marginRight: "8px" }} />
                                Upload to Project
                            </button>
                        </div>
                    </div>

                    {/* Filter Dropdown (static for now) */}
                    <div className="filter">
                        <span>Filter by project:</span>
                        <select className="filter-select" disabled>
                            <option>All Projects</option>
                            {projects.map((project) => (
                                <option key={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Images Grid */}
                    <div className="projects-grid">
                        {mockImages.map((image) => (
                            <div key={image.id} className="project-card">
                                <img src={image.url} alt={image.caption || "Project image"} />
                                <div className="project-info">
                                    <p className="project-name">{image.projectName}</p>
                                    {image.caption && <p className="project-caption">{image.caption}</p>}
                                </div>
                                <div className="project-actions">
                                    <button className="edit-btn"><Edit size={16} /> Edit</button>
                                    <button className="delete-btn"><Trash2 size={16} /> Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {mockImages.length === 0 && (
                        <div className="empty-state">
                            <p>No images available</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminProjectImages;
