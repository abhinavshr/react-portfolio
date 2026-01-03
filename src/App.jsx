import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/admins/AdminLogin';
import AdminDashboard from './pages/admins/AdminDashboard';
import AdminPorject from './pages/admins/projects/AdminProject';
import ProtectedRoute from './routes/ProtectedRoute';
import AddProject from './pages/admins/projects/AddProject';
import EditProject from './pages/admins/projects/EditProject';
import AdminProjectImages from './pages/admins/ProjectImage/AdminProjectImages';
import AddProjectImages from './pages/admins/ProjectImage/AddProjectImage';
import EditProjectImages from './pages/admins/ProjectImage/EditProjectImage';
import AdminSkill from './pages/admins/skills/AdminSkill';
import AdminSoftSkill from './pages/admins/softskills/AdminSoftSkills';
import AdminEducation from './pages/admins/educations/AdminEducation';
import AdminExperience from './pages/admins/experiences/AdminExperience';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminPorject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-project"
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-project/:id"
          element={
            <ProtectedRoute>
              <EditProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/project-images"
          element={
            <ProtectedRoute>
              <AdminProjectImages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add/project-images"
          element={
            <ProtectedRoute>
              <AddProjectImages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit/project-images/:id"
          element={
            <ProtectedRoute>
              <EditProjectImages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/skills"
          element={
            <ProtectedRoute>
              <AdminSkill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/soft-skills"
          element={
            <ProtectedRoute>
              <AdminSoftSkill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/education"
          element={
            <ProtectedRoute>
              <AdminEducation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/experience"
          element={
            <ProtectedRoute>
              <AdminExperience />
            </ProtectedRoute>
          }
        />

        {/* Add more protected routes as needed */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              {/* Your admin layout or specific components */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;