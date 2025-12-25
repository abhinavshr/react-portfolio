import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../css/admin/AdminDashboard.css";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar active={active} setActive={setActive} />

      {/* Main content */}
      <main className="admin-content">
        <h1>{active}</h1>
        <p>This is the {active} section.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
