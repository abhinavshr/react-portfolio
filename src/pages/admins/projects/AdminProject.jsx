import React, { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/AdminProjects.css";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const projectsData = [
    {
        title: "Project1",
        description: "Project1 Description",
        tech_stack: "HTML",
        live_link: "https://www.facebook.com/",
        github_link: "https://www.facebook.com/",
    },
    {
        title: "Portfolio Website",
        description: "Personal portfolio website",
        tech_stack: "React, CSS",
        live_link: "https://example.com",
        github_link: "https://github.com/example",
    },
];

const AdminProjects = () => {
    const [active, setActive] = useState("Projects");
    const [search, setSearch] = useState("");

    const filteredProjects = projectsData.filter(
        (project) =>
            project.title.toLowerCase().includes(search.toLowerCase()) ||
            project.tech_stack.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="admin-layout">
            <AdminSidebar active={active} setActive={setActive} />

            <main className="admin-content">
                {/* Header */}
                <div className="projects-header">
                    <div>
                        <h1>Projects</h1>
                        <p>Manage all your portfolio projects</p>
                    </div>

                    <button className="add-project-btn">+ Add Project</button>
                </div>

                {/* Search */}
                <div className="search-card">
                    <input
                        type="text"
                        placeholder="Search projects by title or tech stack..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="table-card">
                    <table>
                        <thead>
                            <tr>
                                <th>PROJECT TITLE</th>
                                <th>DESCRIPTION</th>
                                <th>TECH STACK</th>
                                <th>LIVE</th>
                                <th>GITHUB</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProjects.map((project, index) => (
                                <tr key={index}>
                                    <td className="project-name">{project.title}</td>
                                    <td className="project-desc">{project.description}</td>
                                    <td>{project.tech_stack}</td>

                                    <td>
                                        <a
                                            href={project.live_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-btn"
                                        >
                                            Live
                                        </a>
                                    </td>

                                    <td>
                                        <a
                                            href={project.github_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-btn github"
                                        >
                                            GitHub
                                        </a>
                                    </td>

                                    <td className="actions">
                                        <button className="icon-btn edit" title="Edit">
                                            <FiEdit2 />
                                        </button>

                                        <button className="icon-btn delete" title="Delete">
                                            <FiTrash2 />
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminProjects;
