import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Folder,
  Code,
  Briefcase,
  Award,
  Mail,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import "../../css/admin/AdminDashboard.css";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your portfolio.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <Folder />
            <h2>12</h2>
            <p>Total Projects</p>
          </div>

          <div className="stat-card green">
            <Code />
            <h2>24</h2>
            <p>Total Skills</p>
          </div>

          <div className="stat-card purple">
            <Briefcase />
            <h2>8</h2>
            <p>Experiences</p>
          </div>

          <div className="stat-card orange">
            <Award />
            <h2>15</h2>
            <p>Certificates</p>
          </div>

          <div className="stat-card pink">
            <Mail />
            <h2>42</h2>
            <p>Messages</p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Projects</h2>
            <button className="view-all">View All</button>
          </div>

          <table className="projects-table">
            <thead>
              <tr>
                <th>PROJECT NAME</th>
                <th>CATEGORY</th>
                <th>START DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>E-commerce Platform</td>
                <td>Web Development</td>
                <td>2024-11-15</td>
                <td><span className="status active">Active</span></td>
              </tr>

              <tr>
                <td>Mobile Banking App</td>
                <td>Mobile Development</td>
                <td>2024-10-20</td>
                <td><span className="status active">Active</span></td>
              </tr>

              <tr>
                <td>AI Chat Interface</td>
                <td>AI / ML</td>
                <td>2024-09-05</td>
                <td><span className="status completed">Completed</span></td>
              </tr>

              <tr>
                <td>Analytics Dashboard</td>
                <td>Data Visualization</td>
                <td>2024-12-01</td>
                <td><span className="status active">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>


        {/* Recent Messages */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Messages</h2>
            <button className="view-all">View All</button>
          </div>

          <div className="message">
            <div>
              <strong>John Smith</strong>
              <span className="dot"></span>
              <p>john@example.com</p>
              <span>Project Inquiry</span>
            </div>
            <small>2024-12-22</small>
          </div>

          <div className="message">
            <div>
              <strong>Sarah Johnson</strong>
              <span className="dot"></span>
              <p>sarah@example.com</p>
              <span>Collaboration Opportunity</span>
            </div>
            <small>2024-12-21</small>
          </div>

          <div className="message">
            <div>
              <strong>Mike Wilson</strong>
              <p>mike@example.com</p>
              <span>Question about your work</span>
            </div>
            <small>2024-12-20</small>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
