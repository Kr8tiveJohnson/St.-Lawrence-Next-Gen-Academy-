import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await client.get("/admin/stats");
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const ADMIN_TABS = [
        { id: "Dashboard", label: "ðŸ“Š Dashboard", icon: "dashboard" },
        { id: "Users", label: "ðŸ‘¥ Users & Subscriptions", icon: "users" },
        { id: "Content", label: "ðŸ“š Courses & Lessons", icon: "courses" },
        { id: "News", label: "ðŸ“° News Management", icon: "news" },
        { id: "Hall of Fame", label: "ðŸ† Hall of Fame", icon: "fame" },
        { id: "Teachers", label: "ðŸ‘¨â€ðŸ« Teacher Approvals", icon: "teachers" },
        { id: "Moderation", label: "ðŸ›¡ï¸ Moderation", icon: "moderation" },
        { id: "Analytics", label: "ðŸ“ˆ Analytics", icon: "analytics" },
    ];

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            minHeight: "100vh",
            background: "#f5f5f5"
        }}>
            {/* SIDEBAR */}
            <div style={{
                background: "linear-gradient(135deg, #1a1f35, #2d3748)",
                color: "white",
                padding: "24px",
                borderRight: "1px solid #333",
                overflowY: "auto",
                position: "sticky",
                top: 0,
                height: "100vh"
            }}>
                <div style={{ marginBottom: "32px" }}>
                    <h2 style={{ margin: "0 0 4px 0", fontSize: "1.2rem" }}>Admin Panel</h2>
                    <p style={{ margin: "0", fontSize: "0.75rem", color: "#aaa" }}>St. Lawrence Academy</p>
                </div>

                <div style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    fontSize: "0.85rem"
                }}>
                    <div style={{ color: "#bbb", marginBottom: "4px" }}>Logged in as:</div>
                    <div style={{ fontWeight: 600, color: "#fff" }}>{user?.profile?.fullName || user?.email}</div>
                    <div style={{ fontSize: "0.75rem", color: "#999", marginTop: "4px" }}>
                        Role: {user?.role}
                    </div>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
                    {ADMIN_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: activeTab === tab.id ? "rgba(255, 215, 0, 0.15)" : "transparent",
                                border: "none",
                                color: activeTab === tab.id ? "#ffd700" : "#ccc",
                                padding: "12px 16px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                textAlign: "left",
                                fontSize: "0.9rem",
                                transition: "all 0.2s",
                                fontWeight: activeTab === tab.id ? 600 : 400,
                                borderLeft: activeTab === tab.id ? "3px solid #ffd700" : "3px solid transparent"
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== tab.id) e.target.style.background = "rgba(255,255,255,0.05)";
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== tab.id) e.target.style.background = "transparent";
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#ef4444",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        width: "100%",
                        fontSize: "0.9rem",
                        fontWeight: 500
                    }}
                >
                    ðŸšª Logout
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ padding: "32px", overflowY: "auto" }}>
                {activeTab === "Dashboard" && <DashboardTab stats={stats} />}
                {activeTab === "Users" && <UsersTab />}
                {activeTab === "Content" && <ContentTab />}
                {activeTab === "News" && <NewsTab />}
                {activeTab === "Hall of Fame" && <HallOfFameTab />}
                {activeTab === "Teachers" && <TeacherApprovalsTab />}
                {activeTab === "Moderation" && <ModerationTab />}
                {activeTab === "Analytics" && <AnalyticsTab />}
            </div>
        </div>
    );
}

// ============ DASHBOARD TAB ============
function DashboardTab({ stats }) {
    return (
        <div>
            <h1 style={{ margin: "0 0 24px 0", fontSize: "2rem", color: "#1a1f35" }}>Dashboard</h1>

            {stats ? (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "20px",
                    marginBottom: "32px"
                }}>
                    <StatCard title="Total Users" value={stats.totalUsers} icon="ðŸ‘¥" />
                    <StatCard title="Active Teachers" value={stats.activeTeachers} icon="ðŸ‘¨â€ðŸ«" />
                    <StatCard title="Premium Members" value={stats.premiumUsers} icon="ðŸ’Ž" />
                    <StatCard title="Total Revenue" value={`â‚¦${stats.totalRevenue?.toLocaleString()}`} icon="ðŸ’°" />
                    <StatCard title="Courses Published" value={stats.totalCourses} icon="ðŸ“š" />
                    <StatCard title="Hall of Fame" value={stats.hallOfFameCount} icon="ðŸ†" />
                </div>
            ) : (
                <p>Loading stats...</p>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                    <h3 style={{ margin: "0 0 16px 0" }}>Quick Actions</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <button className="btn btn-primary" style={{ justifyContent: "flex-start" }}>+ Add News Article</button>
                        <button className="btn btn-primary" style={{ justifyContent: "flex-start" }}>+ Create Course</button>
                        <button className="btn btn-primary" style={{ justifyContent: "flex-start" }}>+ Add Hall of Fame Entry</button>
                        <button className="btn btn-outline" style={{ justifyContent: "flex-start" }}>View All Reports</button>
                    </div>
                </div>

                <div style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                    <h3 style={{ margin: "0 0 16px 0" }}>System Status</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.9rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Database Status</span>
                            <span style={{ background: "#10b981", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>âœ“ Online</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>API Status</span>
                            <span style={{ background: "#10b981", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>âœ“ Running</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Frontend Status</span>
                            <span style={{ background: "#10b981", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>âœ“ Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderTop: "4px solid #ffd700"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>{title}</p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "1.8rem", fontWeight: 700, color: "#1a1f35" }}>{value}</p>
                </div>
                <span style={{ fontSize: "2rem" }}>{icon}</span>
            </div>
        </div>
    );
}

// ============ USERS & SUBSCRIPTIONS TAB ============
function UsersTab() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("all"); // all, student, teacher, premium, banned

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            const { data } = await client.get("/admin/users", { params: { query, filter } });
            setUsers(data.users || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSearch = () => {
        fetchUsers();
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            await client.put(`/admin/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    const toggleBan = async (userId, isBanned) => {
        try {
            await client.put(`/admin/users/${userId}/ban`, { banned: !isBanned });
            fetchUsers();
        } catch (error) {
            console.error("Error updating ban status:", error);
        }
    };

    return (
        <div>
            <h1 style={{ margin: "0 0 24px 0" }}>Users & Subscriptions</h1>

            <div style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <input
                        type="text"
                        placeholder="Search by name, email, username..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "10px 14px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "0.95rem"
                        }}
                    />
                    <button onClick={handleSearch} className="btn btn-primary">Search</button>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["all", "student", "teacher", "premium", "banned"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: "8px 14px",
                                border: filter === f ? "2px solid #ffd700" : "1px solid #ddd",
                                background: filter === f ? "rgba(255, 215, 0, 0.1)" : "white",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: filter === f ? 600 : 400,
                                color: filter === f ? "#ffd700" : "#666"
                            }}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: "grid", gap: "12px" }}>
                {users.length > 0 ? (
                    users.map((u) => (
                        <div key={u.id} style={{
                            background: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <strong>{u.profile?.fullName || "N/A"}</strong>
                                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                                    {u.email} â€¢ {u.role} â€¢ Tier: {u.tier || "FREE"}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <select
                                    defaultValue={u.role}
                                    onChange={(e) => updateUserRole(u.id, e.target.value)}
                                    style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #ddd" }}
                                >
                                    <option value="STUDENT">Student</option>
                                    <option value="TEACHER">Teacher</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                                <button
                                    onClick={() => toggleBan(u.id, u.banned)}
                                    style={{
                                        padding: "6px 12px",
                                        background: u.banned ? "#10b981" : "#ef4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "0.85rem"
                                    }}
                                >
                                    {u.banned ? "Unban" : "Ban"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#999" }}>No users found.</p>
                )}
            </div>
        </div>
    );
}

// ============ CONTENT (COURSES) TAB ============
function ContentTab() {
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "" });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await client.get("/classrooms");
            setCourses(data.classrooms || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const createCourse = async (e) => {
        e.preventDefault();
        try {
            await client.post("/classrooms", formData);
            setFormData({ title: "", description: "" });
            setShowForm(false);
            fetchCourses();
        } catch (error) {
            console.error("Error creating course:", error);
        }
    };

    const deleteCourse = async (courseId) => {
        if (window.confirm("Delete this course?")) {
            try {
                await client.delete(`/classrooms/${courseId}`);
                fetchCourses();
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>Courses & Lessons</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "+ Add Course"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={createCourse} style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                    <label style={{ display: "block", marginBottom: "12px" }}>
                        Course Title
                        <input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #ddd", borderRadius: "6px" }}
                        />
                    </label>
                    <label style={{ display: "block", marginBottom: "12px" }}>
                        Description
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #ddd", borderRadius: "6px", minHeight: "100px" }}
                        />
                    </label>
                    <button type="submit" className="btn btn-primary">Create Course</button>
                </form>
            )}

            <div style={{ display: "grid", gap: "12px" }}>
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course.id} style={{
                            background: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <strong>{course.title}</strong>
                                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                                    {course.description}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button className="btn btn-outline" style={{ padding: "6px 12px" }}>Edit</button>
                                <button onClick={() => deleteCourse(course.id)} className="btn btn-outline" style={{ padding: "6px 12px", color: "#ef4444" }}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#999" }}>No courses yet.</p>
                )}
            </div>
        </div>
    );
}

// ============ NEWS TAB ============
function NewsTab() {
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", image: "" });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { data } = await client.get("/news");
            setNews(data.news || []);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };

    const createNews = async (e) => {
        e.preventDefault();
        try {
            await client.post("/news", formData);
            setFormData({ title: "", content: "", image: "" });
            setShowForm(false);
            fetchNews();
        } catch (error) {
            console.error("Error creating news:", error);
        }
    };

    const deleteNews = async (newsId) => {
        if (window.confirm("Delete this news article?")) {
            try {
                await client.delete(`/news/${newsId}`);
                fetchNews();
            } catch (error) {
                console.error("Error deleting news:", error);
            }
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>News Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "+ Write News"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={createNews} style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                    <label style={{ display: "block", marginBottom: "12px" }}>
                        Title
                        <input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #ddd", borderRadius: "6px" }}
                        />
                    </label>
                    <label style={{ display: "block", marginBottom: "12px" }}>
                        Content
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #ddd", borderRadius: "6px", minHeight: "150px" }}
                        />
                    </label>
                    <label style={{ display: "block", marginBottom: "12px" }}>
                        Featured Image URL
                        <input
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #ddd", borderRadius: "6px" }}
                        />
                    </label>
                    <button type="submit" className="btn btn-primary">Publish News</button>
                </form>
            )}

            <div style={{ display: "grid", gap: "12px" }}>
                {news.length > 0 ? (
                    news.map((article) => (
                        <div key={article.id} style={{
                            background: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            display: "flex",
                            gap: "16px"
                        }}>
                            {article.image && (
                                <img src={article.image} alt={article.title} style={{ width: "100px", height: "100px", borderRadius: "6px", objectFit: "cover" }} />
                            )}
                            <div style={{ flex: 1 }}>
                                <strong>{article.title}</strong>
                                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666", lineHeight: 1.4 }}>
                                    {article.content.substring(0, 100)}...
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignSelf: "center" }}>
                                <button className="btn btn-outline" style={{ padding: "6px 12px" }}>Edit</button>
                                <button onClick={() => deleteNews(article.id)} className="btn btn-outline" style={{ padding: "6px 12px", color: "#ef4444" }}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#999" }}>No news articles yet.</p>
                )}
            </div>
        </div>
    );
}

// ============ HALL OF FAME TAB ============
function HallOfFameTab() {
    const [hallOfFame, setHallOfFame] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", achievement: "", category: "Academic" });

    useEffect(() => {
        fetchHallOfFame();
    }, []);

    const fetchHallOfFame = async () => {
        try {
            const { data } = await client.get("/news/hall-of-fame");
            setHallOfFame(data.hallOfFame || []);
        } catch (error) {
            console.error("Error fetching hall of fame:", error);
        }
    };

    const addEntry = async (e) => {
        e.preventDefault();
        try {
            await client.post("/news/hall-of-fame", formData);
            setFormData({ name: "", achievement: "", category: "Academic" });
            setShowForm(false);
            fetchHallOfFame();
        } catch (error) {
            console.error("Error adding entry:", error);
        }
    };

    const removeEntry = async (entryId) => {
        if (window.confirm("Remove from hall of fame?")) {
            try {
                await client.delete(`/news/hall-of-fame/${entryId}`);
                fetchHallOfFame();
            } catch (error) {
                console.error("Error removing entry:", error);
            }
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>Hall of Fame</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "+ Add Entry"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={addEntry} style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                    <label style={{ display: "block", marginBottom: "12px" }}>
                        Student Name
                        <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #ddd", borderRadius: "6px" }}
                        />
                    </label>
                    <label style={{ display: "block", marginBottom: "12px" }}>
                        Achievement
                        <textarea
                            required
                            value={formData.achievement}
                            onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #ddd", borderRadius: "6px", minHeight: "100px" }}
                        />
                    </label>
                    <label style={{ display: "block", marginBottom: "12px" }}>
                        Category
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            style={{ width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #ddd", borderRadius: "6px" }}
                        >
                            <option>Academic</option>
                            <option>Skills</option>
                            <option>Discipline</option>
                            <option>Leadership</option>
                        </select>
                    </label>
                    <button type="submit" className="btn btn-primary">Add to Hall of Fame</button>
                </form>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {hallOfFame.length > 0 ? (
                    hallOfFame.map((entry) => (
                        <div key={entry.id} style={{
                            background: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            border: "2px solid #ffd700"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                <div>
                                    <strong style={{ fontSize: "1.1rem" }}>ðŸ† {entry.name}</strong>
                                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#999" }}>{entry.category}</p>
                                </div>
                                <button onClick={() => removeEntry(entry.id)} style={{
                                    background: "none",
                                    border: "none",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    fontSize: "1.2rem"
                                }}>Ã—</button>
                            </div>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "#666", lineHeight: 1.4 }}>
                                {entry.achievement}
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#999" }}>No hall of fame entries yet.</p>
                )}
            </div>
        </div>
    );
}

// ============ TEACHER APPROVALS TAB ============
function TeacherApprovalsTab() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await client.get("/admin/stats"); // Adjust endpoint as needed
            setApplications(data.pendingTeacherApplications || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const approveTeacher = async (userId) => {
        try {
            await client.put(`/admin/users/${userId}/role`, { role: "TEACHER" });
            fetchApplications();
        } catch (error) {
            console.error("Error approving teacher:", error);
        }
    };

    const rejectApplication = async (userId) => {
        if (window.confirm("Reject this teacher application?")) {
            try {
                await client.delete(`/admin/users/${userId}/application`);
                fetchApplications();
            } catch (error) {
                console.error("Error rejecting application:", error);
            }
        }
    };

    return (
        <div>
            <h1 style={{ margin: "0 0 24px 0" }}>Teacher Applications</h1>

            <div style={{ display: "grid", gap: "12px" }}>
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <div key={app.id} style={{
                            background: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <strong>{app.name}</strong>
                                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                                    {app.qualifications || "No details provided"}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => approveTeacher(app.id)} className="btn btn-primary" style={{ padding: "6px 12px" }}>Approve</button>
                                <button onClick={() => rejectApplication(app.id)} className="btn btn-outline" style={{ padding: "6px 12px", color: "#ef4444" }}>Reject</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#999" }}>No pending teacher applications.</p>
                )}
            </div>
        </div>
    );
}

// ============ MODERATION TAB ============
function ModerationTab() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const { data } = await client.get("/admin/logs");
            setReports(data.reports || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    return (
        <div>
            <h1 style={{ margin: "0 0 24px 0" }}>Moderation & Reports</h1>

            <div style={{ display: "grid", gap: "12px" }}>
                {reports.length > 0 ? (
                    reports.map((report) => (
                        <div key={report.id} style={{
                            background: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                        }}>
                            <strong>{report.type}</strong>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>
                                {report.description}
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#999" }}>No reports at this time.</p>
                )}
            </div>
        </div>
    );
}

// ============ ANALYTICS TAB ============
function AnalyticsTab() {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await client.get("/admin/stats");
            setAnalytics(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        }
    };

    return (
        <div>
            <h1 style={{ margin: "0 0 24px 0" }}>Analytics & Reports</h1>

            {analytics ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}>
                        <h3 style={{ margin: "0 0 16px 0" }}>User Growth</h3>
                        <p style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>{analytics.totalUsers}</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>Total registered users</p>
                    </div>

                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}>
                        <h3 style={{ margin: "0 0 16px 0" }}>Revenue</h3>
                        <p style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>â‚¦{analytics.totalRevenue?.toLocaleString() || "0"}</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>From premium subscriptions</p>
                    </div>

                    <div style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}>
                        <h3 style={{ margin: "0 0 16px 0" }}>Engagement</h3>
                        <p style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>{analytics.activeUsers || "0"}</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#666" }}>Active users (30 days)</p>
                    </div>
                </div>
            ) : (
                <p>Loading analytics...</p>
            )}
        </div>
    );
}
