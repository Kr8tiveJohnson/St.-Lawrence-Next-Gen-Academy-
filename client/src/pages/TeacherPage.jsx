import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import SchoolDashboardView from "../components/dashboard/SchoolDashboardView";

// ─── SVG Icons Helper ────────────────────────────────────────────────────────
function Icon({ path, size = 18, color = "currentColor", stroke = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  users:     "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  teachers:  "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  courses:   "M15 10l4.553-2.069A1 1 0 0121 8.82V15a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  assignments: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  questionBank: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  news:      "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  resources: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  messages:  "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  search:    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  menu:      "M4 6h16M4 12h16M4 18h16",
  logout:    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 5l7 7-7 7",
  plus:      "M12 4v16m8-8H4",
  x:         "M6 18L18 6M6 6l12 12",
  check:     "M5 13l4 4L19 7"
};

const TEACHER_NAV_GROUPS = [
  {
    category: "Home",
    items: [
      { id: "Dashboard", label: "Teacher Dashboard", icon: "dashboard" }
    ]
  },
  {
    category: "Academic & Teaching",
    items: [
      { id: "Assignments", label: "Assignments Manager", icon: "assignments" },
      { id: "QuestionBank", label: "Question Bank", icon: "questionBank" },
      { id: "Classrooms", label: "My Classrooms", icon: "courses" },
      { id: "Resources", label: "Resources Library", icon: "resources" }
    ]
  },
  {
    category: "Communication",
    items: [
      { id: "Students", label: "Students", icon: "users" },
      { id: "Communities", label: "Groups & Forums", icon: "users" },
      { id: "Messages", label: "Messages & Chat", icon: "messages" }
    ]
  }
];

export default function TeacherPage() {
  const navigate = useNavigate();
  const { user: authUser, logout, isTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Teacher specific stats
  const [teacherStats, setTeacherStats] = useState({
    totalUsers: 240,
    activeTeachers: 4,
    premiumUsers: 48,
    totalRevenue: 98,
    coursesPublished: 6
  });

  // Fetch teacher classroom or student counts if available
  useEffect(() => {
    (async () => {
      try {
        const res = await client.get("/assignments");
        const list = res.data.assignments || [];
        setTeacherStats((prev) => ({
          ...prev,
          premiumUsers: list.length || 48
        }));
      } catch (e) {}
    })();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleCategory = (cat) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const filteredNavGroups = useMemo(() => {
    if (!searchQuery.trim()) return TEACHER_NAV_GROUPS;
    const q = searchQuery.toLowerCase();
    return TEACHER_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (it) => it.label.toLowerCase().includes(q) || it.id.toLowerCase().includes(q)
      )
    })).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  const teacherName = authUser?.profile?.fullName || authUser?.email?.split("@")[0] || "Faculty Instructor";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .teacher-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .nav-item-btn:hover { background: #f8fafc !important; color: #101c44 !important; }
        .nav-item-active { background: #f5f3ff !important; color: #6b21a8 !important; border-left: 4px solid #6b21a8 !important; font-weight: 800 !important; }
        .header-icon-btn:hover { background: #f1f4fa !important; transform: translateY(-1px); }
      `}</style>

      <div className="teacher-root" style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb" }}>
        
        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <aside style={{
          width: sidebarOpen ? "260px" : "78px",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
          flexShrink: 0,
          borderRight: "1px solid rgba(16,28,68,0.06)",
          boxShadow: "2px 0 16px rgba(16,28,68,0.02)",
          zIndex: 40
        }}>
          {/* Logo & Academy Name */}
          <div style={{
            padding: sidebarOpen ? "22px 20px 20px" : "22px 14px 20px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer"
          }} onClick={() => setActiveTab("Dashboard")}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "var(--navy, #101c44)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(16,28,68,0.15)"
            }}>
              <img src={logoImg} alt="Logo" style={{ width: 28, height: 28, objectFit: "contain" }} />
            </div>
            {sidebarOpen && (
              <div style={{ overflow: "hidden" }}>
                <div style={{ color: "var(--navy, #101c44)", fontWeight: 900, fontSize: "0.95rem", lineHeight: 1.15, fontFamily: "var(--font-h, 'Outfit', sans-serif)" }}>
                  ia Academy
                </div>
                <div style={{ color: "var(--gold, #dfa921)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Teacher Portal
                </div>
              </div>
            )}
          </div>

          {/* Navigation Groups List */}
          <nav style={{ flex: 1, padding: sidebarOpen ? "14px 12px" : "14px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {filteredNavGroups.map((group) => {
              const isCollapsed = !!collapsedCategories[group.category];
              return (
                <div key={group.category}>
                  {sidebarOpen && (
                    <div
                      onClick={() => toggleCategory(group.category)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "6px 10px 6px 12px",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        cursor: "pointer",
                        userSelect: "none"
                      }}
                    >
                      <span>{group.category}</span>
                      <Icon path={isCollapsed ? ICONS.chevronRight : ICONS.chevronDown} size={12} color="#94a3b8" />
                    </div>
                  )}

                  {!isCollapsed && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                      {group.items.map((item) => {
                        const active = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            className={`nav-item-btn ${active ? "nav-item-active" : ""}`}
                            onClick={() => {
                              if (item.id === "Classrooms") navigate("/classrooms");
                              else if (item.id === "Communities") navigate("/groups");
                              else if (item.id === "Messages") navigate("/chat");
                              else if (item.id === "Resources") navigate("/resources");
                              else setActiveTab(item.id);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              width: "100%",
                              padding: sidebarOpen ? "10px 14px" : "11px 12px",
                              background: active ? "#f5f3ff" : "transparent",
                              border: "none",
                              borderRadius: "12px",
                              cursor: "pointer",
                              color: active ? "#6b21a8" : "#64748b",
                              fontWeight: active ? 800 : 600,
                              fontSize: "0.85rem",
                              textAlign: "left",
                              borderLeft: active ? "4px solid #6b21a8" : "4px solid transparent",
                              transition: "all 0.15s ease",
                              justifyContent: sidebarOpen ? "flex-start" : "center"
                            }}
                            title={!sidebarOpen ? item.label : undefined}
                          >
                            <span style={{ flexShrink: 0, display: "flex" }}>
                              <Icon path={ICONS[item.icon]} size={18} color={active ? "#6b21a8" : "#94a3b8"} stroke={active ? 2.2 : 1.8} />
                            </span>
                            {sidebarOpen && <span style={{ flex: 1 }}>{item.label}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div style={{ padding: sidebarOpen ? "12px 14px 18px" : "12px 8px 18px", borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={handleLogout}
              className="nav-item-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                color: "#ef4444",
                fontWeight: 700,
                fontSize: "0.85rem",
                textAlign: "left",
                justifyContent: sidebarOpen ? "flex-start" : "center"
              }}
              title="Logout"
            >
              <Icon path={ICONS.logout} size={18} color="#ef4444" stroke={2} />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          
          {/* Top Header */}
          <header style={{
            height: "76px",
            background: "#ffffff",
            padding: "0 32px",
            borderBottom: "1px solid rgba(16,28,68,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            boxShadow: "0 2px 12px rgba(16,28,68,0.02)",
            position: "sticky",
            top: 0,
            zIndex: 30
          }}>
            {/* Search Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "18px", flex: 1, maxWidth: "540px" }}>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: "#f4f6fb",
                  border: "none",
                  borderRadius: "12px",
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
                title="Toggle Sidebar"
              >
                <Icon path={ICONS.menu} size={18} color="#64748b" stroke={2} />
              </button>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#f4f6fb",
                padding: "8px 16px",
                borderRadius: "14px",
                flex: 1
              }}>
                <Icon path={ICONS.search} size={16} color="#94a3b8" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you want to find?"
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.88rem",
                    color: "var(--navy, #101c44)",
                    fontFamily: "inherit"
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                    <Icon path={ICONS.x} size={14} color="#94a3b8" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification Icons & Teacher Profile Pill */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                className="header-icon-btn"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid rgba(16,28,68,0.06)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative"
                }}
                onClick={() => navigate("/profile")}
                title="Notifications"
              >
                <Icon path={ICONS.bell} size={18} color="#64748b" />
                <span style={{ position: "absolute", top: 9, right: 9, width: 7, height: 7, background: "#ef4444", borderRadius: "50%", border: "2px solid #ffffff" }} />
              </button>

              <button
                className="header-icon-btn"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid rgba(16,28,68,0.06)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onClick={() => navigate("/chat")}
                title="Messages"
              >
                <Icon path={ICONS.messages} size={18} color="#64748b" />
              </button>

              {/* Profile Pill */}
              <div style={{ position: "relative" }}>
                <div
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 14px 6px 8px",
                    borderRadius: "99px",
                    background: "#ffffff",
                    border: "1px solid rgba(16,28,68,0.08)",
                    boxShadow: "0 2px 8px rgba(16,28,68,0.03)",
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                >
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0284c7 0%, var(--navy, #101c44) 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "0.85rem",
                    flexShrink: 0
                  }}>
                    {teacherName[0].toUpperCase()}
                  </div>
                  <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--navy, #101c44)" }}>
                      {teacherName}
                    </div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#94a3b8" }}>
                      Teacher
                    </div>
                  </div>
                  <Icon path={ICONS.chevronDown} size={14} color="#94a3b8" />
                </div>

                {profileMenuOpen && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "180px",
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "8px",
                    boxShadow: "0 12px 36px rgba(16,28,68,0.12)",
                    border: "1px solid rgba(16,28,68,0.08)",
                    zIndex: 50,
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}>
                    <button
                      onClick={() => { navigate("/profile"); setProfileMenuOpen(false); }}
                      style={{ background: "transparent", border: "none", padding: "8px 12px", borderRadius: "8px", textAlign: "left", fontSize: "0.82rem", fontWeight: 600, color: "var(--navy, #101c44)", cursor: "pointer" }}
                      className="nav-item-btn"
                    >
                      👤 Full Profile
                    </button>
                    <button
                      onClick={() => { navigate("/classrooms"); setProfileMenuOpen(false); }}
                      style={{ background: "transparent", border: "none", padding: "8px 12px", borderRadius: "8px", textAlign: "left", fontSize: "0.82rem", fontWeight: 600, color: "var(--navy, #101c44)", cursor: "pointer" }}
                      className="nav-item-btn"
                    >
                      🎓 My Classrooms
                    </button>
                    <div style={{ height: "1px", background: "#f1f5f9", margin: "4px 0" }} />
                    <button
                      onClick={handleLogout}
                      style={{ background: "transparent", border: "none", padding: "8px 12px", borderRadius: "8px", textAlign: "left", fontSize: "0.82rem", fontWeight: 700, color: "#ef4444", cursor: "pointer" }}
                      className="nav-item-btn"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Dashboard Canvas */}
          <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
            {activeTab === "Dashboard" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <SchoolDashboardView
                  role="TEACHER"
                  stats={teacherStats}
                  onNavigateTab={(tab) => {
                    if (tab === "Teachers" || tab === "Courses") navigate("/classrooms");
                    else if (tab === "Groups") navigate("/groups");
                    else setActiveTab(tab);
                  }}
                  onViewAllActivity={() => navigate("/profile")}
                />

                {/* Quick Shortcuts for Teacher */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" }}>
                  <div
                    onClick={() => navigate("/profile")}
                    style={{
                      background: "#ffffff",
                      borderRadius: "20px",
                      padding: "22px",
                      border: "1px solid rgba(16,28,68,0.06)",
                      boxShadow: "0 4px 16px rgba(16,28,68,0.03)",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>📝</div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "var(--navy, #101c44)" }}>Assignments Manager</h3>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>Create tasks, grade student submissions, provide feedback.</p>
                  </div>

                  <div
                    onClick={() => navigate("/profile")}
                    style={{
                      background: "#ffffff",
                      borderRadius: "20px",
                      padding: "22px",
                      border: "1px solid rgba(16,28,68,0.06)",
                      boxShadow: "0 4px 16px rgba(16,28,68,0.03)",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>💡</div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "var(--navy, #101c44)" }}>Question Bank Contribution</h3>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>Submit verified past questions & CBT mock questions.</p>
                  </div>

                  <div
                    onClick={() => navigate("/classrooms")}
                    style={{
                      background: "#ffffff",
                      borderRadius: "20px",
                      padding: "22px",
                      border: "1px solid rgba(16,28,68,0.06)",
                      boxShadow: "0 4px 16px rgba(16,28,68,0.03)",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>📹</div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "var(--navy, #101c44)" }}>Live Classrooms</h3>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>Launch video lessons and upload revision modules.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Assignments" && (
              <div style={{ background: "#ffffff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(16,28,68,0.06)" }}>
                <h2 style={{ color: "var(--navy, #101c44)", fontWeight: 800, margin: "0 0 8px" }}>Assignments & Grading Hub</h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0 0 24px" }}>Manage academy tasks and review student submissions.</p>
                <button onClick={() => navigate("/profile")} style={{ padding: "12px 24px", background: "var(--navy, #101c44)", color: "#ffffff", borderRadius: "12px", border: "none", fontWeight: 800, cursor: "pointer" }}>
                  Open Detailed Assignment Portal →
                </button>
              </div>
            )}

            {activeTab === "QuestionBank" && (
              <div style={{ background: "#ffffff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(16,28,68,0.06)" }}>
                <h2 style={{ color: "var(--navy, #101c44)", fontWeight: 800, margin: "0 0 8px" }}>Question Bank Submissions</h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0 0 24px" }}>Upload questions for WAEC, JAMB, NECO and internal mock assessments.</p>
                <button onClick={() => navigate("/profile")} style={{ padding: "12px 24px", background: "var(--navy, #101c44)", color: "#ffffff", borderRadius: "12px", border: "none", fontWeight: 800, cursor: "pointer" }}>
                  Open Question Bank Creator →
                </button>
              </div>
            )}

            {activeTab === "Students" && (
              <div style={{ background: "#ffffff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(16,28,68,0.06)" }}>
                <h2 style={{ color: "var(--navy, #101c44)", fontWeight: 800, margin: "0 0 8px" }}>Class Roster & Student Performance</h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0 0 24px" }}>Enrolled candidates in your department and mock classes.</p>
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: "16px" }}>
                  All 240 assigned students are synchronized with your academic classes.
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
