import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  Save,
  User,
  Mail,
  Phone,
  Briefcase,
  Type,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Globe
} from "lucide-react";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "../../../css/admin/profiles/AdminProfileAbout.css";
import {
  getAdminProfileAbout,
  updateAdminBasicInfo,
  updateAdminStatistic,
  updateAdminSocialLinks,
} from "../../../services/adminProfileAbout";

gsap.registerPlugin(useGSAP);

const Skeleton = ({ className }) => (
  <div className={`skeleton ${className || ""}`} />
);

/**
 * AdminProfileAbout Component
 * 
 * Provides a comprehensive interface for managing admin profile details,
 * including identity, basic information, portfolio statistics, and social links.
 * Features GSAP animations, skeleton loaders, and dirty-state checking.
 * 
 * @returns {JSX.Element} The rendered admin profile management page.
 */
const AdminProfileAbout = () => {
  // --- UI & Content State ---
  const [active, setActive] = useState("Profile"); // Current active sidebar item
  const [loading, setLoading] = useState(true);   // Global loading state for initial fetch
  const [user, setUser] = useState(null);          // Stores core user identity (name, email, photo)

  const containerRef = useRef(null);               // Ref for GSAP animation context

  // --- Form Data States ---
  // We keep track of both current values (for inputs) and initial values (to check for changes)

  // Basic info (Title, Tagline, About Me, Phone)
  const [basicInfo, setBasicInfo] = useState({
    phone_number: "",
    professional_title: "",
    tagline: "",
    about_me: "",
  });
  const [initialBasicInfo, setInitialBasicInfo] = useState(null);

  // Portfolio stats (Experience years, Projects, Clients, Tech count)
  const [stats, setStats] = useState({
    years_of_experience: "",
    projects_completed: "",
    happy_clients: "",
    technologies_used: "",
  });
  const [initialStats, setInitialStats] = useState(null);

  // Social & Resume Links
  const [socialLinks, setSocialLinks] = useState({
    github_url: "",
    linkedin_url: "",
    cv_url: "",
    twitter_url: "",
  });
  const [initialSocialLinks, setInitialSocialLinks] = useState(null);

  // --- Submission States ---
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);

  /**
   * Helper function to determine if a form section has unsaved changes.
   * Compares the current state against the initial data fetched from the API.
   * 
   * @param {Object} current - Current form state.
   * @param {Object} initial - Data originally loaded from the server.
   * @returns {boolean} True if changes exist.
   */
  const isDirty = (current, initial) =>
    initial && Object.keys(current).some((k) => current[k] !== initial[k]);

  // Memoized change detection for UI performance
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

  /**
   * Fetches all profile-related data from the backend and initializes the form states.
   * Nullish coalescing (??) is used to ensure form inputs are never uncontrolled (undefined).
   */
  const fetchProfileAbout = async () => {
    setLoading(true);
    try {
      const response = await getAdminProfileAbout();
      const profile = response.profile || {};

      setUser(response.user);

      // Initialize Basic Info
      const basicData = {
        phone_number: profile.phone_number ?? "",
        professional_title: profile.professional_title ?? "",
        tagline: profile.tagline ?? "",
        about_me: profile.about_me ?? "",
      };

      // Initialize Statistics
      const statsData = {
        years_of_experience: profile.years_of_experience ?? "",
        projects_completed: profile.projects_completed ?? "",
        happy_clients: profile.happy_clients ?? "",
        technologies_used: profile.technologies_used ?? "",
      };

      // Initialize Social Links
      const socialData = {
        github_url: profile.github_url ?? "",
        linkedin_url: profile.linkedin_url ?? "",
        cv_url: profile.cv_url ?? "",
        twitter_url: profile.twitter_url ?? "",
      };

      // Set both current and reference states
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

  /**
   * Initial mount effect to load data.
   */
  useEffect(() => {
    fetchProfileAbout();
  }, []);

  /**
   * GSAP Animations
   * Fires when loading state completes to animate the cards into view.
   */
  useGSAP(() => {
    if (!loading) {
      gsap.from(".profile-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".profile-header", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }
  }, [loading]);

  // --- Change Handlers (Memoized) ---
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

  /**
   * Generic Save Handler with Animation and Toast Feedback
   * Orchestrates the API call, loading state management, and success/error notifications.
   * 
   * @param {Function} fn - The service function to call (API method).
   * @param {Object} data - The data payload to send.
   * @param {Function} setSaving - State setter for loading feedback.
   * @param {Function} setInitial - State setter to update reference data upon success.
   * @param {string} successMsg - Message to display on success.
   */
  const handleSave = async (fn, data, setSaving, setInitial, successMsg) => {
    try {
      setSaving(true);
      await fn(data);
      Swal.fire({
        title: "Success",
        text: successMsg,
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#3b82f6"
      });
      // Update the reference initial state so the "dirty" check resets
      setInitial(data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout" ref={containerRef}>
      <AdminSidebar active={active} setActive={setActive} />
      <main className="admin-content">
        <div className="profile-container">
          {loading ? (
            /* Skeleton Loader State */
            <>
              <div className="profile-header skeleton-header">
                <Skeleton className="skeleton-title" />
                <Skeleton className="skeleton-text" />
              </div>
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
                  <Skeleton className="skeleton-btn" />
                </div>
              ))}
            </>
          ) : (
            /* Loaded Content State */
            <>
              {/* Header Section */}
              <div className="profile-header">
                <h1>Profile & About</h1>
                <p>Manage your professional profile and portfolio information</p>
              </div>

              {/* Identity Card: Visual confirmation of logged-in user (Read Only) */}
              <div className="profile-card identity-card">
                <div className="card-header">
                  <h2>Identity Confirmation</h2>
                  <span className="subtitle">Your core identity information</span>
                </div>
                <div className="identity-box">
                  <div className="avatar">
                    {user?.profile_photo ? (
                      <img src={user.profile_photo} alt="Profile" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div className="identity-details">
                    <h3>{user?.name}</h3>
                    <div className="detail-item">
                      <Mail size={14} />
                      <span>{user?.email}</span>
                    </div>
                    <small>Update your photo, name, and email in Settings</small>
                  </div>
                </div>
              </div>

              {/* Basic Information Card: Main professional details */}
              <div className="profile-card basic-info-card">
                <div className="card-header">
                  <h2>Basic Information</h2>
                  <span className="subtitle">
                    Professional identity and contact details
                  </span>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label><Phone size={14} /> Phone Number</label>
                    <div className="input-wrapper">
                      <input
                        name="phone_number"
                        value={basicInfo.phone_number}
                        onChange={handleBasicChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label><Briefcase size={14} /> Professional Title</label>
                    <div className="input-wrapper">
                      <input
                        name="professional_title"
                        value={basicInfo.professional_title}
                        onChange={handleBasicChange}
                        placeholder="e.g. Senior Full Stack Developer"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="admin-about"><Type size={14} /> Tagline</label>
                  <div className="input-wrapper">
                    <input
                      name="tagline"
                      value={basicInfo.tagline}
                      onChange={handleBasicChange}
                      placeholder="e.g. Building digital experiences that matter."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="admin-about"><FileText size={14} /> About Me</label>
                  <div className="input-wrapper">
                    <textarea
                      rows="4"
                      name="about_me"
                      value={basicInfo.about_me}
                      onChange={handleBasicChange}
                      placeholder="Write a compelling bio..."
                    />
                  </div>
                </div>

                <button
                  className="save-btn"
                  onClick={() => handleSave(updateAdminBasicInfo, basicInfo, setSavingBasic, setInitialBasicInfo, "Basic information updated")}
                  disabled={!isBasicInfoChanged || savingBasic}
                >
                  {savingBasic ? <div className="spinner"></div> : <Save size={18} />}
                  {savingBasic ? "Saving..." : "Save Basic Info"}
                </button>
              </div>

              {/* Portfolio Statistics Card: Quantifiable metrics */}
              <div className="profile-card stats-card">
                <div className="card-header">
                  <h2>Portfolio Statistics</h2>
                  <span className="subtitle">Metrics that showcase your achievements</span>
                </div>
                <div className="grid-4">
                  {Object.keys(stats).map((key) => (
                    <div className="form-group" key={key}>
                      <label>{key.replaceAll("_", " ")}</label>
                      <div className="input-wrapper">
                        <input
                          type="number"
                          name={key}
                          value={stats[key]}
                          onChange={handleStatsChange}
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="save-btn"
                  onClick={() => handleSave(updateAdminStatistic, stats, setSavingStats, setInitialStats, "Statistics updated")}
                  disabled={!isStatsChanged || savingStats}
                >
                  {savingStats ? <div className="spinner"></div> : <Save size={18} />}
                  {savingStats ? "Saving..." : "Save Statistics"}
                </button>
              </div>

              {/* Social Links Card: External connection points */}
              <div className="profile-card social-card">
                <div className="card-header">
                  <h2>Social Links</h2>
                  <span className="subtitle">Connect your profiles</span>
                </div>
                <div className="grid-2">
                  {/* GitHub */}
                  <div className="form-group">
                    <label><Github size={14} /> GitHub URL</label>
                    <div className="input-wrapper">
                      <input
                        name="github_url"
                        value={socialLinks.github_url}
                        onChange={handleSocialChange}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  {/* LinkedIn */}
                  <div className="form-group">
                    <label><Linkedin size={14} /> LinkedIn URL</label>
                    <div className="input-wrapper">
                      <input
                        name="linkedin_url"
                        value={socialLinks.linkedin_url}
                        onChange={handleSocialChange}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                  {/* CV / Resume */}
                  <div className="form-group">
                    <label><Globe size={14} /> CV / Resume URL</label>
                    <div className="input-wrapper">
                      <input
                        name="cv_url"
                        value={socialLinks.cv_url}
                        onChange={handleSocialChange}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  {/* Twitter / X */}
                  <div className="form-group">
                    <label><Twitter size={14} /> Twitter / X URL</label>
                    <div className="input-wrapper">
                      <input
                        name="twitter_url"
                        value={socialLinks.twitter_url}
                        onChange={handleSocialChange}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="save-btn"
                  onClick={() => handleSave(updateAdminSocialLinks, socialLinks, setSavingSocial, setInitialSocialLinks, "Social links updated")}
                  disabled={!isSocialChanged || savingSocial}
                >
                  {savingSocial ? <div className="spinner"></div> : <Save size={18} />}
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
