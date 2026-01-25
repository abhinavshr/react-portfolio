import { useEffect, useMemo, useState, useCallback } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Save } from "lucide-react";
import Swal from "sweetalert2";
import "../../../css/admin/profiles/AdminProfileAbout.css";
import {
  getAdminProfileAbout,
  updateAdminBasicInfo,
  updateAdminStatistic,
  updateAdminSocialLinks,
} from "../../../services/adminProfileAbout";

const Skeleton = ({ className }) => (
  <div className={`skeleton ${className || ""}`} />
);

const AdminProfileAbout = () => {
  const [active, setActive] = useState("Profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [basicInfo, setBasicInfo] = useState({
    phone_number: "",
    professional_title: "",
    tagline: "",
    about_me: "",
  });
  const [initialBasicInfo, setInitialBasicInfo] = useState(null);

  const [stats, setStats] = useState({
    years_of_experience: "",
    projects_completed: "",
    happy_clients: "",
    technologies_used: "",
  });
  const [initialStats, setInitialStats] = useState(null);

  const [socialLinks, setSocialLinks] = useState({
    github_url: "",
    linkedin_url: "",
    cv_url: "",
    twitter_url: "",
  });
  const [initialSocialLinks, setInitialSocialLinks] = useState(null);

  const [savingBasic, setSavingBasic] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);

  const isDirty = (current, initial) =>
    initial && Object.keys(current).some((k) => current[k] !== initial[k]);

  const isBasicInfoChanged = useMemo(
    () => isDirty(basicInfo, initialBasicInfo),
    [basicInfo, initialBasicInfo]
  );

  const isStatsChanged = useMemo(
    () => isDirty(stats, initialStats),
    [stats, initialStats]
  );

  const isSocialChanged = useMemo(
    () => isDirty(socialLinks, initialSocialLinks),
    [socialLinks, initialSocialLinks]
  );

  const fetchProfileAbout = async () => {
    setLoading(true);
    try {
      const response = await getAdminProfileAbout();
      const profile = response.profile || {};

      setUser(response.user);

      const basicData = {
        phone_number: profile.phone_number ?? "",
        professional_title: profile.professional_title ?? "",
        tagline: profile.tagline ?? "",
        about_me: profile.about_me ?? "",
      };

      const statsData = {
        years_of_experience: profile.years_of_experience ?? "",
        projects_completed: profile.projects_completed ?? "",
        happy_clients: profile.happy_clients ?? "",
        technologies_used: profile.technologies_used ?? "",
      };

      const socialData = {
        github_url: profile.github_url ?? "",
        linkedin_url: profile.linkedin_url ?? "",
        cv_url: profile.cv_url ?? "",
        twitter_url: profile.twitter_url ?? "",
      };

      setBasicInfo(basicData);
      setInitialBasicInfo(basicData);

      setStats(statsData);
      setInitialStats(statsData);

      setSocialLinks(socialData);
      setInitialSocialLinks(socialData);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAbout();
  }, []);

  const handleBasicChange = useCallback((e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleStatsChange = useCallback((e) => {
    const { name, value } = e.target;
    setStats((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSocialChange = useCallback((e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveBasicInfo = async () => {
    try {
      setSavingBasic(true);
      await updateAdminBasicInfo(basicInfo);
      Swal.fire("Success", "Basic information updated successfully", "success");
      setInitialBasicInfo(basicInfo);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to update basic info", "error");
    } finally {
      setSavingBasic(false);
    }
  };

  const handleSaveStatistics = async () => {
    try {
      setSavingStats(true);
      await updateAdminStatistic(stats);
      Swal.fire("Success", "Statistics updated successfully", "success");
      setInitialStats(stats);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to update statistics", "error");
    } finally {
      setSavingStats(false);
    }
  };

  const handleSaveSocialLinks = async () => {
    try {
      setSavingSocial(true);
      await updateAdminSocialLinks(socialLinks);
      Swal.fire("Success", "Social links updated successfully", "success");
      setInitialSocialLinks(socialLinks);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to update social links", "error");
    } finally {
      setSavingSocial(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />
      <main className="admin-content">
        <div className="profile-container">
          {loading ? (
            <>
              <div className="profile-card">
                <Skeleton className="skeleton-title" />
                <Skeleton className="skeleton-text" />
                <div className="identity-box">
                  <Skeleton className="skeleton-avatar" />
                  <div>
                    <Skeleton className="skeleton-text short" />
                    <Skeleton className="skeleton-text" />
                  </div>
                </div>
              </div>

              {[1, 2, 3].map((i) => (
                <div className="profile-card" key={i}>
                  <Skeleton className="skeleton-title" />
                  <Skeleton className="skeleton-text" />
                  <div className="grid-2">
                    <Skeleton className="skeleton-input" />
                    <Skeleton className="skeleton-input" />
                  </div>
                  <Skeleton className="skeleton-input full" />
                  <Skeleton className="skeleton-input full" />
                  <Skeleton className="skeleton-btn" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="profile-header">
                <h1>Profile & About</h1>
                <p>Manage your professional profile and portfolio information</p>
              </div>

              <div className="profile-card">
                <h2>Identity Confirmation</h2>
                <span className="subtitle">Your core identity information</span>
                <div className="identity-box">
                  <div className="avatar">
                    {user?.profile_photo ? (
                      <img src={user.profile_photo} alt="Profile" />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div>
                    <h3>{user?.name}</h3>
                    <p>{user?.email}</p>
                    <small>Update your photo, name, and email in Settings</small>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <h2>Basic Information</h2>
                <span className="subtitle">
                  Professional identity and contact details
                </span>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      name="phone_number"
                      value={basicInfo.phone_number}
                      onChange={handleBasicChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Professional Title</label>
                    <input
                      name="professional_title"
                      value={basicInfo.professional_title}
                      onChange={handleBasicChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="admin-about">Tagline</label>
                  <input
                    name="tagline"
                    value={basicInfo.tagline}
                    onChange={handleBasicChange}
                  />
                </div>

                <div className="form-group">
                  <label className="admin-about">About Me</label>
                  <textarea
                    rows="4"
                    name="about_me"
                    value={basicInfo.about_me}
                    onChange={handleBasicChange}
                  />
                </div>

                <button
                  className="save-btn"
                  onClick={handleSaveBasicInfo}
                  disabled={!isBasicInfoChanged || savingBasic}
                >
                  <Save size={16} />
                  {savingBasic ? "Saving..." : "Save Basic Info"}
                </button>
              </div>

              <div className="profile-card">
                <h2>Portfolio Statistics</h2>
                <div className="grid-4">
                  {Object.keys(stats).map((key) => (
                    <div className="form-group" key={key}>
                      <label>{key.replaceAll("_", " ")}</label>
                      <input
                        type="number"
                        name={key}
                        value={stats[key]}
                        onChange={handleStatsChange}
                        min="0"
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="save-btn"
                  onClick={handleSaveStatistics}
                  disabled={!isStatsChanged || savingStats}
                >
                  <Save size={16} />
                  {savingStats ? "Saving..." : "Save Statistics"}
                </button>
              </div>

              <div className="profile-card">
                <h2>Social Links</h2>
                <div className="grid-2">
                  {Object.keys(socialLinks).map((key) => (
                    <div className="form-group" key={key}>
                      <label>{key.replaceAll("_", " ")}</label>
                      <input
                        name={key}
                        value={socialLinks[key]}
                        onChange={handleSocialChange}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="save-btn"
                  onClick={handleSaveSocialLinks}
                  disabled={!isSocialChanged || savingSocial}
                >
                  <Save size={16} />
                  {savingSocial ? "Saving..." : "Save Social Links"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProfileAbout;
