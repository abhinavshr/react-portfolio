import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Save } from "lucide-react";
import Swal from "sweetalert2";
import "../../../css/admin/profiles/AdminProfileAbout.css";
import {
    getAdminProfileAbout,
    updateAdminBasicInfo,
    updateAdminStatistic
} from "../../../services/adminProfileAbout";

const AdminProfileAbout = () => {
    const [active, setActive] = useState("Profile");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

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


    const fetchProfileAbout = async () => {
        setLoading(true);
        try {
            const response = await getAdminProfileAbout();

            setUser(response.user);
            setProfile(response.profile);

            const basicData = {
                phone_number: response.profile.phone_number || "",
                professional_title: response.profile.professional_title || "",
                tagline: response.profile.tagline || "",
                about_me: response.profile.about_me || "",
            };

            setBasicInfo(basicData);
            setInitialBasicInfo(basicData);

            const statsData = {
                years_of_experience: response.profile.years_of_experience || "",
                projects_completed: response.profile.projects_completed || "",
                happy_clients: response.profile.happy_clients || "",
                technologies_used: response.profile.technologies_used || "",
            };

            setStats(statsData);
            setInitialStats(statsData);

        } catch (error) {
            Swal.fire("Error", error.message || "Failed to load profile", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileAbout();
    }, []);

    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatsChange = (e) => {
        const { name, value } = e.target;
        setStats((prev) => ({ ...prev, [name]: value }));
    };


    const isBasicInfoChanged = useMemo(() => {
        if (!initialBasicInfo) return false;
        return Object.keys(basicInfo).some(
            (key) => basicInfo[key] !== initialBasicInfo[key]
        );
    }, [basicInfo, initialBasicInfo]);

    const isStatsChanged = useMemo(() => {
        if (!initialStats) return false;
        return Object.keys(stats).some(
            (key) => stats[key] !== initialStats[key]
        );
    }, [stats, initialStats]);


    const handleSaveBasicInfo = async () => {
        try {
            await updateAdminBasicInfo(basicInfo);
            Swal.fire("Success", "Basic information updated successfully", "success");
            fetchProfileAbout();
        } catch (error) {
            Swal.fire(
                "Error",
                error.message || "Failed to update basic info",
                "error"
            );
        }
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <AdminSidebar active={active} setActive={setActive} />
                <main className="admin-content">
                    <p>Loading profile...</p>
                </main>
            </div>
        );
    }

    const handleSaveStatistics = async () => {
        try {
            await updateAdminStatistic(stats);
            Swal.fire("Success", "Statistics updated successfully", "success");
            fetchProfileAbout();
        } catch (error) {
            Swal.fire(
                "Error",
                error.message || "Failed to update statistics",
                "error"
            );
        }
    };


    return (
        <div className="admin-layout">
            <AdminSidebar active={active} setActive={setActive} />

            <main className="admin-content">
                <div className="profile-container">
                    <div className="profile-header">
                        <h1>Profile & About</h1>
                        <p>Manage your professional profile and portfolio information</p>
                    </div>

                    {/* Identity */}
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

                    {/* Basic Info */}
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
                            disabled={!isBasicInfoChanged}
                        >
                            <Save size={16} />
                            Save Basic Info
                        </button>
                    </div>

                    {/* Statistics */}
                    <div className="profile-card">
                        <h2>Portfolio Statistics</h2>

                        <div className="grid-4">
                            <div className="form-group">
                                <label>Years of Experience</label>
                                <input
                                    type="number"
                                    name="years_of_experience"
                                    value={stats.years_of_experience}
                                    onChange={handleStatsChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Projects Completed</label>
                                <input
                                    type="number"
                                    name="projects_completed"
                                    value={stats.projects_completed}
                                    onChange={handleStatsChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Happy Clients</label>
                                <input
                                    type="number"
                                    name="happy_clients"
                                    value={stats.happy_clients}
                                    onChange={handleStatsChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Technologies Used</label>
                                <input
                                    type="number"
                                    name="technologies_used"
                                    value={stats.technologies_used}
                                    onChange={handleStatsChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        <button
                            className="save-btn"
                            onClick={handleSaveStatistics}
                            disabled={!isStatsChanged}
                        >
                            <Save size={16} />
                            Save Statistics
                        </button>
                    </div>


                    {/* Social Links */}
                    <div className="profile-card">
                        <h2>Social Links</h2>

                        <div className="grid-2">
                            <div className="form-group">
                                <label>GitHub</label>
                                <input value={profile.github_url || ""} readOnly />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn</label>
                                <input value={profile.linkedin_url || ""} readOnly />
                            </div>
                            <div className="form-group">
                                <label>CV URL</label>
                                <input value={profile.cv_url || ""} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Twitter / X</label>
                                <input value={profile.twitter_url || ""} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProfileAbout;
