import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../../api/client";
import logoImg from "../../assets/St. Lawrence Next Gen Academy logo.png";

// ─── Crisp, Professional SVG Vector Line Icons (Feather / Lucide Style) ───────
export function SvgIcon({ name, size = 18, color = "currentColor", stroke = 1.8, style = {} }) {
  const icons = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    progress: (
      <>
        <path d="M3 20h18" />
        <path d="M7 16V10" />
        <path d="M12 16V6" />
        <path d="M17 16V12" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    assignment: (
      <>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </>
    ),
    courses: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M10 6h6" />
        <path d="M10 10h6" />
      </>
    ),
    friends: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    messages: (
      <>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="8" cy="10" r="1" fill="currentColor" />
        <circle cx="12" cy="10" r="1" fill="currentColor" />
        <circle cx="16" cy="10" r="1" fill="currentColor" />
      </>
    ),
    groups: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M18 10a3 3 0 0 0 0-6" />
        <path d="M22 20v-1a3 3 0 0 0-2-2.8" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    edit: (
      <>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </>
    ),
    arrowUpRight: (
      <>
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </>
    ),
    arrowDownRight: (
      <>
        <line x1="7" y1="7" x2="17" y2="17" />
        <polyline points="17 7 17 17 7 17" />
      </>
    ),
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    menu: (
      <>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
    send: (
      <>
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    video: (
      <>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </>
    ),
    bulb: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5" />
      </>
    )
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
    >
      {icons[name] || icons.overview}
    </svg>
  );
}

// ─── Toast Feedback Notification ─────────────────────────────────────────────
function ToastNotification({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 99999,
      background: toast.type === "error" ? "#ef4444" : "#101c44",
      color: "#ffffff",
      padding: "12px 20px",
      borderRadius: "14px",
      fontWeight: 700,
      fontSize: "0.88rem",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      animation: "slideInUp 0.25s ease"
    }}>
      <SvgIcon name={toast.type === "error" ? "x" : "check"} size={16} color="#fef08a" stroke={2.5} />
      <span>{toast.message}</span>
    </div>
  );
}

// ─── MAIN STUDENT DASHBOARD VIEW COMPONENT ───────────────────────────────────
export default function StudentDashboardView({
  user = {},
  activeTab = "Overview",
  setActiveTab,
  pendingCount = 0,
  onLogout
}) {
  const navigate = useNavigate();
  const currentTab = activeTab || "Overview";

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(25);
  const [courseFilter, setCourseFilter] = useState("All");
  const [toast, setToast] = useState(null);

  // Dynamic Tab States
  const [progressData, setProgressData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  const [cbtAttempts, setCbtAttempts] = useState([]);
  const [loadingCbt, setLoadingCbt] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitModal, setSubmitModal] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendSubTab, setFriendSubTab] = useState("friends"); // friends | requests | find
  const [friendSearch, setFriendSearch] = useState("");
  const [friendResults, setFriendResults] = useState([]);
  const [searchingFriends, setSearchingFriends] = useState(false);

  const [groupsList, setGroupsList] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
    targetClass: user?.targetClass || "SSS 3 / Exam Candidate",
    selectedSubjects: Array.isArray(user?.selectedSubjects) ? user.selectedSubjects : ["Mathematics", "English Language", "Physics", "Chemistry"]
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [savingSettings, setSavingSettings] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const studentName = user?.firstName || user?.fullName?.split(" ")[0] || "Student";
  const studentFullName = user?.fullName || user?.firstName || "Academy Student";
  const studentEmail = user?.email || "student@academy.edu";

  // Sidebar navigation configuration
  const navTabs = [
    { id: "Overview", label: "Overview", icon: "overview" },
    { id: "Learning Progress", label: "Learning Progress", icon: "progress" },
    { id: "CBT History", label: "CBT History", icon: "clock" },
    { id: "Assignments", label: "Assignments", icon: "assignment", badge: assignments.filter(a => !a.submissions?.[0]).length || null },
    { id: "My Courses", label: "My Courses", icon: "courses" },
    { id: "Friends", label: "Friends", icon: "friends", badge: pendingCount > 0 ? pendingCount : null },
    { id: "Messages", label: "Messages", icon: "messages" },
    { id: "Groups", label: "Groups", icon: "groups" },
    { id: "Notifications", label: "Notifications", icon: "bell" },
    { id: "Settings", label: "Settings", icon: "settings" }
  ];

  // ── DATA FETCHERS ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentTab === "Learning Progress" && !progressData) {
      setLoadingProgress(true);
      client.get("/progress/me")
        .then((res) => setProgressData(res.data))
        .catch((err) => console.error("progress load error", err))
        .finally(() => setLoadingProgress(false));
    }

    if (currentTab === "CBT History" && cbtAttempts.length === 0) {
      setLoadingCbt(true);
      client.get("/cbt/attempts/me")
        .then((res) => setCbtAttempts(res.data.attempts || []))
        .catch((err) => console.error("cbt load error", err))
        .finally(() => setLoadingCbt(false));
    }

    if ((currentTab === "Assignments" || currentTab === "Overview") && assignments.length === 0) {
      setLoadingAssignments(true);
      client.get("/assignments")
        .then((res) => setAssignments(res.data.assignments || []))
        .catch((err) => console.error("assignments load error", err))
        .finally(() => setLoadingAssignments(false));
    }

    if ((currentTab === "Friends" || currentTab === "Messages") && friends.length === 0) {
      Promise.all([
        client.get("/friends").catch(() => ({ data: { friends: [] } })),
        client.get("/friends/requests/pending").catch(() => ({ data: { requests: [] } }))
      ]).then(([frRes, reqRes]) => {
        setFriends(frRes.data.friends || []);
        setFriendRequests(reqRes.data.requests || []);
      });
    }

    if (currentTab === "Groups" && groupsList.length === 0) {
      setLoadingGroups(true);
      client.get("/groups")
        .then((res) => setGroupsList(res.data.groups || []))
        .catch(() => {})
        .finally(() => setLoadingGroups(false));
    }
  }, [currentTab]);

  // Tab switcher
  const handleSelectTab = (tabId) => {
    if (setActiveTab) setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Submit assignment handler
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!submitModal) return;
    setSubmittingAssignment(true);
    try {
      await client.post(`/assignments/${submitModal.id}/submit`, { submissionText });
      showToast("Assignment submitted to instructor! 🎉");
      setSubmitModal(null);
      setSubmissionText("");
      const res = await client.get("/assignments");
      setAssignments(res.data.assignments || []);
    } catch (err) {
      showToast(err.response?.data?.error || "Could not submit assignment", "error");
    } finally {
      setSubmittingAssignment(false);
    }
  };

  // Friends Actions
  const searchClassmates = async () => {
    if (!friendSearch.trim()) return;
    setSearchingFriends(true);
    try {
      const res = await client.get(`/users/search?q=${encodeURIComponent(friendSearch)}`);
      setFriendResults(res.data.users || []);
    } catch {
      setFriendResults([]);
    } finally {
      setSearchingFriends(false);
    }
  };

  const sendFriendRequest = async (receiverId) => {
    try {
      await client.post("/friends/request", { receiverId });
      showToast("Friend request dispatched!");
      setFriendResults((prev) => prev.filter((u) => u.id !== receiverId));
    } catch (err) {
      showToast(err?.response?.data?.error || "Failed to send request", "error");
    }
  };

  const acceptFriendRequest = async (id) => {
    try {
      await client.put(`/friends/${id}/accept`);
      showToast("Friend request accepted! 🤝");
      const [fr, req] = await Promise.all([
        client.get("/friends"),
        client.get("/friends/requests/pending")
      ]);
      setFriends(fr.data.friends || []);
      setFriendRequests(req.data.requests || []);
    } catch {
      showToast("Failed to accept friend request", "error");
    }
  };

  const declineFriendRequest = async (id) => {
    try {
      await client.put(`/friends/${id}/reject`);
      showToast("Request declined");
      const req = await client.get("/friends/requests/pending");
      setFriendRequests(req.data.requests || []);
    } catch {
      showToast("Failed to decline request", "error");
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await client.put("/users/me", {
        fullName: settingsForm.fullName,
        phone: settingsForm.phone,
        dateOfBirth: settingsForm.dateOfBirth || undefined,
        targetClass: settingsForm.targetClass,
        selectedSubjects: settingsForm.selectedSubjects
      });
      showToast("Profile & study subjects saved!");
    } catch (err) {
      showToast(err?.response?.data?.error || "Could not save preferences", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Photo must be less than 2MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setAvatarPreview(dataUrl);
      try {
        await client.post("/users/me/photo", { avatarUrl: dataUrl });
        showToast("Profile photo updated!");
      } catch {
        showToast("Photo upload failed", "error");
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleSubject = (subj) => {
    setSettingsForm((prev) => {
      const exists = prev.selectedSubjects.includes(subj);
      return {
        ...prev,
        selectedSubjects: exists
          ? prev.selectedSubjects.filter((s) => s !== subj)
          : [...prev.selectedSubjects, subj]
      };
    });
  };

  // Sample verified academy courses dataset matching reference design
  const coursesCatalog = [
    {
      id: "math",
      title: "Core Mathematics Mastery",
      tutor: "Prof. Alicia Mayer",
      level: "Beginner level",
      levelColor: "#16a34a",
      lessons: 90,
      hours: 62,
      students: 71,
      progress: 75,
      status: "Active",
      accentBg: "#f0fdf4",
      iconName: "courses"
    },
    {
      id: "physics",
      title: "Physics Mechanics & Waves",
      tutor: "Dr. Mike Dickens",
      level: "Advanced level",
      levelColor: "#0284c7",
      lessons: 25,
      hours: 52,
      students: 22,
      progress: 30,
      status: "Active",
      accentBg: "#f0f9ff",
      iconName: "bulb"
    },
    {
      id: "biology",
      title: "Biology & Human Anatomy",
      tutor: "Mahnoor Moably",
      level: "Certificated 🎉",
      levelColor: "#d97706",
      lessons: 31,
      hours: 28,
      students: 11,
      progress: 100,
      status: "Completed",
      accentBg: "#fffbeb",
      iconName: "award"
    }
  ];

  const filteredCourses = coursesCatalog.filter((c) => {
    if (courseFilter === "Active") return c.status === "Active";
    if (courseFilter === "Completed") return c.status === "Completed";
    return true;
  });

  return (
    <div className="student-dashboard-root" style={{
      background: "#eef2f8",
      minHeight: "100vh",
      padding: "20px",
      boxSizing: "border-box",
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <ToastNotification toast={toast} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap');
        
        * { box-sizing: border-box; }
        
        .student-board-shell {
          display: grid;
          grid-template-columns: 220px 1fr 310px;
          gap: 20px;
          max-width: 1440px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 36px;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(16, 28, 68, 0.07);
          overflow: hidden;
          position: relative;
        }

        /* ── Tablet Breakpoint ── */
        @media (max-width: 1180px) {
          .student-board-shell {
            grid-template-columns: 210px 1fr;
          }
          .student-right-column {
            grid-column: span 2;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            border-left: none !important;
            border-top: 1px solid #f1f5f9;
            padding-top: 24px !important;
            padding-left: 0 !important;
          }
        }

        /* ── Mobile Breakpoint (<768px) ── */
        @media (max-width: 768px) {
          .student-dashboard-root {
            padding: 8px !important;
          }
          .student-board-shell {
            display: flex;
            flex-direction: column;
            padding: 16px !important;
            border-radius: 24px !important;
          }
          .student-sidebar {
            display: none !important;
          }
          .student-sidebar.mobile-open {
            display: flex !important;
            position: fixed;
            inset: 0;
            background: #ffffff;
            z-index: 9999;
            padding: 24px;
            overflow-y: auto;
          }
          .student-right-column {
            display: flex !important;
            flex-direction: column !important;
            grid-column: span 1;
            padding-left: 0 !important;
            border-left: none !important;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px !important;
          }
          .mobile-top-bar {
            display: flex !important;
          }
          .course-cards-row, .home-tasks-grid, .stats-row-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Nav Pills */
        .nav-pill-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 14px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }
        .nav-pill-btn:hover {
          background: #f8fafc;
          color: #101c44;
        }
        .nav-pill-active {
          background: #fef08a !important; /* Pastel Yellow/Gold from reference */
          color: #0f172a !important;
          font-weight: 800 !important;
          box-shadow: 0 4px 14px rgba(234, 179, 8, 0.2);
          position: relative;
        }
        .nav-pill-active::before {
          content: "";
          position: absolute;
          left: -4px;
          top: 6px;
          bottom: 6px;
          width: 6px;
          background: #0f172a;
          border-radius: 4px;
        }

        .student-card {
          background: #ffffff;
          border-radius: 22px;
          padding: 20px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 18px rgba(16, 28, 68, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .student-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 28, 68, 0.06);
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="student-board-shell">

        {/* ── MOBILE HEADER (Mobile only) ─────────────────────────── */}
        <div className="mobile-top-bar" style={{
          display: "none",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "14px",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{ background: "#f1f5f9", border: "none", borderRadius: "10px", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              aria-label="Open Navigation Menu"
            >
              <SvgIcon name="menu" size={20} color="#101c44" />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img src={logoImg} alt="Logo" style={{ width: 26, height: 26, objectFit: "contain" }} />
              <span style={{ fontWeight: 900, color: "#101c44", fontSize: "0.95rem", letterSpacing: "0.02em" }}>ST. LAWRENCE</span>
            </div>
          </div>

          <div
            onClick={() => handleSelectTab("Settings")}
            style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid #dfa921", cursor: "pointer" }}
            title="Account Settings"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt={studentName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#101c44", color: "#fef08a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem" }}>
                {studentName[0]}
              </div>
            )}
          </div>
        </div>

        {/* ── 1. LEFT SIDEBAR COLUMN ───────────────────────────────── */}
        <aside className={`student-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`} style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingRight: "14px",
          borderRight: "1px solid #f8fafc"
        }}>
          <div>
            {/* Logo & Academy Brand */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: "12px",
                  background: "#101c44",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(16,28,68,0.15)"
                }}>
                  <img src={logoImg} alt="Logo" style={{ width: 24, height: 24, objectFit: "contain" }} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 900,
                    fontSize: "0.95rem",
                    color: "#101c44",
                    lineHeight: 1.15
                  }}>
                    ART ACADEMY
                  </div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#dfa921", letterSpacing: "0.06em" }}>
                    ST. LAWRENCE
                  </div>
                </div>
              </div>

              {mobileMenuOpen && (
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: "6px" }}
                  aria-label="Close Navigation"
                >
                  <SvgIcon name="x" size={20} color="#64748b" />
                </button>
              )}
            </div>

            {/* Navigation Tabs */}
            <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {navTabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`nav-pill-btn ${isActive ? "nav-pill-active" : ""}`}
                  >
                    <SvgIcon
                      name={tab.icon}
                      size={18}
                      color={isActive ? "#0f172a" : "#64748b"}
                      stroke={isActive ? 2.3 : 1.8}
                    />
                    <span style={{ flex: 1 }}>{tab.label}</span>
                    {tab.badge ? (
                      <span style={{
                        background: "#ef4444",
                        color: "#ffffff",
                        fontSize: "0.68rem",
                        fontWeight: 900,
                        padding: "2px 7px",
                        borderRadius: "99px"
                      }}>
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Area: Help Center Dark Floating Card */}
          <div style={{ marginTop: "32px" }}>
            <div style={{
              background: "#101c44",
              borderRadius: "22px",
              padding: "24px 16px 16px",
              position: "relative",
              textAlign: "center",
              boxShadow: "0 14px 30px rgba(16,28,68,0.18)"
            }}>
              {/* Gold Floating Circle Badge with Crisp Question Mark */}
              <div style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#fef08a",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 16px rgba(254, 240, 138, 0.5)",
                fontWeight: 900
              }}>
                <SvgIcon name="help" size={20} color="#0f172a" stroke={2.5} />
              </div>

              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.92rem", marginBottom: "4px" }}>
                Help center
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.74rem", margin: "0 0 12px", lineHeight: 1.4 }}>
                Have a question?<br />Send an instructor a message!
              </p>
              <button
                onClick={() => handleSelectTab("Messages")}
                style={{
                  width: "100%",
                  padding: "9px",
                  background: "#ffffff",
                  color: "#101c44",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  cursor: "pointer"
                }}
              >
                Go to help center
              </button>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "8px",
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <SvgIcon name="logout" size={15} color="#94a3b8" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </aside>

        {/* ── 2. CENTER FEED COLUMN ───────────────────────────────── */}
        <main style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          minWidth: 0
        }}>
          {/* Top Bar: Personalized Greeting & Search Input */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <div>
              <h1 style={{
                fontSize: "1.45rem",
                fontWeight: 900,
                color: "#101c44",
                margin: 0,
                letterSpacing: "-0.01em"
              }}>
                Hello {studentName} 👋
              </h1>
              <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
                Let's learn something new today !
              </p>
            </div>

            {/* Search Input & Bell */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 260px", maxWidth: "400px", justifyContent: "flex-end" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
                borderRadius: "16px",
                padding: "9px 14px",
                flex: 1
              }}>
                <SvgIcon name="search" size={16} color="#94a3b8" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for classes, tasks, tests..."
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    width: "100%",
                    fontSize: "0.84rem",
                    color: "#101c44",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Notification Bell Button */}
              <button
                onClick={() => handleSelectTab("Notifications")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "14px",
                  background: currentTab === "Notifications" ? "#fef08a" : "#f8fafc",
                  border: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative"
                }}
                title="Notifications"
                aria-label="View notifications"
              >
                <SvgIcon name="bell" size={18} color="#0f172a" />
                <span style={{
                  position: "absolute",
                  top: 9,
                  right: 9,
                  width: 7,
                  height: 7,
                  background: "#ef4444",
                  borderRadius: "50%",
                  border: "2px solid #ffffff"
                }} />
              </button>
            </div>
          </div>

          {/* ════════════ TAB 1: OVERVIEW ════════════ */}
          {currentTab === "Overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* My Courses Section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#101c44", margin: 0 }}>
                    My Courses
                  </h2>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ display: "flex", gap: "14px", fontSize: "0.82rem", fontWeight: 700 }}>
                      {["All", "Active", "Completed"].map((tab) => (
                        <span
                          key={tab}
                          onClick={() => setCourseFilter(tab)}
                          style={{
                            cursor: "pointer",
                            color: courseFilter === tab ? "#101c44" : "#94a3b8",
                            borderBottom: courseFilter === tab ? "2px solid #101c44" : "2px solid transparent",
                            paddingBottom: "2px"
                          }}
                        >
                          {tab}
                        </span>
                      ))}
                    </div>

                    <span
                      onClick={() => handleSelectTab("My Courses")}
                      style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 600, cursor: "pointer" }}
                    >
                      See all
                    </span>
                  </div>
                </div>

                {/* Course Cards Grid */}
                <div className="course-cards-row" style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "16px"
                }}>
                  {filteredCourses.map((c) => (
                    <div
                      key={c.id}
                      className="student-card"
                      style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}
                    >
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{
                          width: 44,
                          height: 44,
                          borderRadius: "14px",
                          background: c.accentBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}>
                          <SvgIcon name={c.iconName} size={22} color="#101c44" stroke={2} />
                        </div>
                        <div style={{ overflow: "hidden" }}>
                          <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#101c44", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {c.title}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>
                            {c.tutor}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: c.levelColor }}>
                        {c.level}
                      </div>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#f8fafc",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        fontSize: "0.72rem",
                        color: "#64748b",
                        fontWeight: 600
                      }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <SvgIcon name="calendar" size={13} color="#64748b" /> {c.lessons}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <SvgIcon name="clock" size={13} color="#64748b" /> {c.hours}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <SvgIcon name="friends" size={13} color="#64748b" /> {c.students}
                        </span>
                      </div>

                      <div>
                        <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden", marginBottom: "6px" }}>
                          <div style={{ height: "100%", width: `${c.progress}%`, background: c.progress === 100 ? "#0f172a" : "#94a3b8", borderRadius: "99px" }} />
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>
                          Completed: <strong style={{ color: "#101c44" }}>{c.progress}%</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignments Section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 900, color: "#101c44", margin: 0 }}>
                    Assignments
                  </h2>
                  <button
                    onClick={() => handleSelectTab("Assignments")}
                    style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
                  >
                    Share <SvgIcon name="share" size={13} color="#94a3b8" />
                  </button>
                </div>

                <div className="student-card" style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: 46,
                      height: 46,
                      borderRadius: "14px",
                      background: "#fef08a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0f172a"
                    }}>
                      <SvgIcon name="award" size={22} color="#0f172a" stroke={2} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#101c44" }}>
                        Award Show discussion & Mock CBT Mathematics
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
                        20 June 2026, 12:30 AM
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700 }}>Duration</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#101c44" }}>02 h 45 m</div>
                    </div>

                    <button
                      onClick={() => handleSelectTab("Assignments")}
                      style={{
                        padding: "8px 16px",
                        background: "transparent",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#64748b",
                        cursor: "pointer"
                      }}
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleSelectTab("Assignments")}
                      style={{
                        padding: "8px 18px",
                        background: "#dcfce7",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        color: "#16a34a",
                        cursor: "pointer"
                      }}
                    >
                      Accept invite
                    </button>
                  </div>
                </div>
              </div>

              {/* Home Tasks Section */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 900, color: "#101c44", margin: 0 }}>
                    Home Tasks
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      Today <SvgIcon name="chevronDown" size={12} color="#64748b" />
                    </span>
                    <button
                      onClick={() => handleSelectTab("Assignments")}
                      style={{ background: "transparent", border: "none", color: "#16a34a", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer" }}
                    >
                      Add new +
                    </button>
                  </div>
                </div>

                <div className="home-tasks-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Task 1: Dark Navy Card */}
                  <div style={{
                    background: "#101c44",
                    borderRadius: "22px",
                    padding: "22px",
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "18px",
                    boxShadow: "0 10px 24px rgba(16,28,68,0.15)"
                  }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                          Texture & Detail
                        </h3>
                        <span style={{
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#f87171",
                          padding: "2px 8px",
                          borderRadius: "8px",
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px"
                        }}>
                          High <SvgIcon name="arrowUpRight" size={11} color="#f87171" stroke={2.5} />
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                        How to analyze and solve problems by breaking complex concepts into foundational rules.
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", fontWeight: 700, marginBottom: "8px" }}>
                        History of Design & Analysis
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                          Due: 29.06.2026
                        </span>
                        <div style={{ display: "flex" }}>
                          {["#fef08a", "#93c5fd", "#86efac"].map((bg, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: bg,
                                border: "2px solid #101c44",
                                marginLeft: idx === 0 ? 0 : -6,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                color: "#0f172a"
                              }}
                            >
                              {String.fromCharCode(65 + idx)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task 2: Warm Yellow Card */}
                  <div style={{
                    background: "#fef08a",
                    borderRadius: "22px",
                    padding: "22px",
                    color: "#0f172a",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "18px",
                    boxShadow: "0 10px 24px rgba(254, 240, 138, 0.25)"
                  }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                          Formula Drill & Practice
                        </h3>
                        <span style={{
                          background: "rgba(15, 23, 42, 0.1)",
                          color: "#0f172a",
                          padding: "2px 8px",
                          borderRadius: "8px",
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px"
                        }}>
                          Low <SvgIcon name="arrowDownRight" size={11} color="#0f172a" stroke={2.5} />
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(15,23,42,0.75)", lineHeight: 1.4 }}>
                        Calculus and geometry formula recall drills for the upcoming semester examination.
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#0f172a", fontWeight: 800, marginBottom: "8px" }}>
                        Mathematics Revision
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.7rem", color: "rgba(15,23,42,0.65)", fontWeight: 600 }}>
                          Due: 15.07.2026
                        </span>
                        <div style={{ display: "flex" }}>
                          {["#fed7aa", "#bfdbfe"].map((bg, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: bg,
                                border: "2px solid #fef08a",
                                marginLeft: idx === 0 ? 0 : -6,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                color: "#0f172a"
                              }}
                            >
                              {String.fromCharCode(77 + idx)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════ TAB 2: LEARNING PROGRESS ════════════ */}
          {currentTab === "Learning Progress" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                    Academic Progress & Mastery
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                    Real-time performance analytics across quiz drills, CBT mock tests, and curriculum lessons.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/cbt")}
                  style={{
                    padding: "9px 16px",
                    background: "#101c44",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <SvgIcon name="plus" size={14} color="#fef08a" stroke={2.5} />
                  <span>Take Drill</span>
                </button>
              </div>

              {loadingProgress ? (
                <div className="student-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  Calculating performance metrics...
                </div>
              ) : (
                <>
                  {/* Top Pastel Metric Cards */}
                  <div className="stats-row-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                    <div className="student-card" style={{ background: "#f8fafc", padding: "18px" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "12px", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                        <SvgIcon name="clock" size={20} color="#0284c7" stroke={2} />
                      </div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#101c44" }}>
                        {progressData?.totalTestsTaken ?? 0}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700 }}>CBT Exams Completed</div>
                    </div>

                    <div className="student-card" style={{ background: "#fffbeb", padding: "18px" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "12px", background: "#fef08a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                        <SvgIcon name="courses" size={20} color="#0f172a" stroke={2} />
                      </div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0f172a" }}>
                        {progressData?.totalCompletedLessons ?? 0}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700 }}>Lessons Completed</div>
                    </div>

                    <div className="student-card" style={{ background: "#f0fdf4", padding: "18px" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "12px", background: "#bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                        <SvgIcon name="award" size={20} color="#16a34a" stroke={2} />
                      </div>
                      <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#16a34a" }}>
                        {progressData?.strongSubjects?.length ?? 0}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700 }}>Strong Performance Areas</div>
                    </div>
                  </div>

                  {/* Subject Breakdown Bars */}
                  <div className="student-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#101c44", margin: "0 0 16px" }}>
                      Subject Mastery Breakdown
                    </h3>

                    {(!progressData?.subjectProgress || progressData.subjectProgress.length === 0) ? (
                      <div style={{ textAlign: "center", padding: "28px", color: "#94a3b8" }}>
                        No subject activity recorded yet. Take your first CBT test to start tracking!
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {progressData.subjectProgress.map((item) => (
                          <div key={item.subject}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                              <span style={{ fontWeight: 800, color: "#101c44", fontSize: "0.9rem" }}>
                                {item.subject}
                              </span>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                                  Avg CBT: <strong>{typeof item.avgCbtScore === "number" ? `${item.avgCbtScore}%` : item.avgCbtScore}</strong>
                                </span>
                                <span style={{
                                  fontWeight: 900,
                                  fontSize: "0.88rem",
                                  color: item.masteryPercent >= 70 ? "#16a34a" : item.masteryPercent >= 50 ? "#d97706" : "#dc2626"
                                }}>
                                  {item.masteryPercent}%
                                </span>
                              </div>
                            </div>

                            <div style={{ height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                              <div style={{
                                height: "100%",
                                width: `${Math.min(100, Math.max(0, item.masteryPercent))}%`,
                                borderRadius: 99,
                                background: item.masteryPercent >= 70
                                  ? "linear-gradient(90deg, #16a34a, #22c55e)"
                                  : item.masteryPercent >= 50
                                    ? "linear-gradient(90deg, #d97706, #f59e0b)"
                                    : "linear-gradient(90deg, #dc2626, #ef4444)",
                                transition: "width 0.6s ease"
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ════════════ TAB 3: CBT HISTORY ════════════ */}
          {currentTab === "CBT History" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                    CBT Examination History
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                    Review past examination attempts, time used, and accuracy metrics.
                  </p>
                </div>
                <Link
                  to="/cbt"
                  style={{
                    padding: "9px 18px",
                    background: "#101c44",
                    color: "#ffffff",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <SvgIcon name="plus" size={14} color="#fef08a" stroke={2.5} />
                  <span>Take New CBT Test</span>
                </Link>
              </div>

              {loadingCbt ? (
                <div className="student-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  Loading CBT drill attempts...
                </div>
              ) : cbtAttempts.length === 0 ? (
                <div className="student-card" style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <SvgIcon name="clock" size={32} color="#94a3b8" />
                  </div>
                  <h3 style={{ color: "#101c44", margin: "0 0 8px", fontSize: "1.1rem", fontWeight: 800 }}>
                    No CBT Tests Taken Yet
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "#64748b", margin: "0 0 20px" }}>
                    Test your knowledge with our timed JAMB and WAEC exam practice engine.
                  </p>
                  <Link
                    to="/cbt"
                    style={{
                      padding: "10px 22px",
                      background: "#101c44",
                      color: "#ffffff",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "0.85rem"
                    }}
                  >
                    Start First CBT Drill →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {cbtAttempts.map((att) => {
                    const formattedDate = new Date(att.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    });
                    const mins = Math.floor(att.timeSpentSeconds / 60);
                    const secs = att.timeSpentSeconds % 60;

                    return (
                      <div key={att.id} className="student-card" style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "18px 22px",
                        flexWrap: "wrap",
                        gap: "14px"
                      }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ background: "rgba(16,28,68,0.06)", color: "#101c44", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 800 }}>
                              {att.examType}
                            </span>
                            <span style={{ fontWeight: 800, color: "#101c44", fontSize: "0.98rem" }}>
                              {att.subject}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "#94a3b8" }}>
                            {formattedDate} · Time used: {mins}m {secs}s
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "1.2rem", fontWeight: 900, color: att.percentage >= 60 ? "#16a34a" : "#dc2626" }}>
                              {att.score} / {att.totalQuestions}
                            </div>
                            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8" }}>
                              {att.percentage}%
                            </div>
                          </div>

                          <span style={{
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            background: att.percentage >= 75 ? "#dcfce7" : att.percentage >= 50 ? "#fef3c7" : "#fee2e2",
                            color: att.percentage >= 75 ? "#15803d" : att.percentage >= 50 ? "#b45309" : "#b91c1c"
                          }}>
                            {att.percentage >= 75 ? "Distinction" : att.percentage >= 50 ? "Credit" : "Review"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════════════ TAB 4: ASSIGNMENTS ════════════ */}
          {currentTab === "Assignments" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                  Homework & Assignments
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                  View tasks published by academy instructors, submit your answers, and review teacher remarks.
                </p>
              </div>

              {loadingAssignments ? (
                <div className="student-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  Loading homework assignments...
                </div>
              ) : assignments.length === 0 ? (
                <div className="student-card" style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <SvgIcon name="assignment" size={32} color="#94a3b8" />
                  </div>
                  <h3 style={{ color: "#101c44", margin: "0 0 6px", fontSize: "1.1rem", fontWeight: 800 }}>
                    No Assignments Active
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                    You are completely up to date on all classroom tasks!
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {assignments.map((item) => {
                    const mySub = item.submissions?.[0] || null;
                    const isGraded = mySub?.status === "GRADED";
                    const isSubmitted = mySub?.status === "SUBMITTED" || isGraded;

                    return (
                      <div key={item.id} className="student-card" style={{ padding: "22px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                              <span style={{ background: "rgba(16,28,68,0.06)", color: "#101c44", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 800 }}>
                                {item.subject}
                              </span>
                              <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
                                Target: {item.targetClass}
                              </span>
                            </div>
                            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#101c44", margin: 0 }}>
                              {item.title}
                            </h3>
                          </div>

                          <span style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            background: isGraded ? "#dcfce7" : isSubmitted ? "#fef3c7" : "#fee2e2",
                            color: isGraded ? "#15803d" : isSubmitted ? "#b45309" : "#b91c1c"
                          }}>
                            {isGraded ? `Graded: ${mySub.score}/100` : isSubmitted ? "Submitted (Pending)" : "Pending Submission"}
                          </span>
                        </div>

                        <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.6, margin: "0 0 16px" }}>
                          {item.description}
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "14px", flexWrap: "wrap", gap: "10px" }}>
                          <span style={{ fontSize: "0.76rem", color: "#94a3b8", fontWeight: 600 }}>
                            {item.dueDate ? `Deadline: ${new Date(item.dueDate).toLocaleDateString("en-NG")}` : "No specific deadline"}
                          </span>

                          <button
                            onClick={() => {
                              setSubmitModal(item);
                              setSubmissionText(mySub?.submissionText || "");
                            }}
                            style={{
                              padding: "8px 16px",
                              background: "#101c44",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px"
                            }}
                          >
                            <SvgIcon name="edit" size={13} color="#fef08a" />
                            <span>{isSubmitted ? "Edit Submission" : "Submit Answer"}</span>
                          </button>
                        </div>

                        {/* Teacher Feedback Callout */}
                        {isGraded && mySub.feedback && (
                          <div style={{ marginTop: "14px", background: "#f0fdf4", borderLeft: "4px solid #16a34a", padding: "10px 14px", borderRadius: "8px" }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", color: "#166534", marginBottom: "2px" }}>
                              Instructor Remark:
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "#15803d" }}>
                              {mySub.feedback}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Assignment Submission Modal */}
              {submitModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(16,28,68,0.45)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                  <div style={{ background: "#ffffff", borderRadius: "24px", padding: "28px", maxWidth: "520px", width: "100%", boxShadow: "0 24px 48px rgba(16,28,68,0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#101c44", margin: 0 }}>
                        Submit: {submitModal.title}
                      </h3>
                      <button onClick={() => setSubmitModal(null)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                        <SvgIcon name="x" size={18} color="#64748b" />
                      </button>
                    </div>

                    <p style={{ color: "#64748b", fontSize: "0.84rem", margin: "0 0 16px" }}>
                      Type your working, explanation, essay, or link to your work:
                    </p>

                    <form onSubmit={handleAssignmentSubmit}>
                      <textarea
                        required
                        rows={6}
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Write your answer or provide solution link..."
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          fontSize: "0.88rem",
                          resize: "vertical",
                          boxSizing: "border-box",
                          marginBottom: "18px",
                          fontFamily: "inherit"
                        }}
                      />

                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => setSubmitModal(null)}
                          style={{ padding: "9px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#ffffff", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submittingAssignment}
                          style={{
                            padding: "9px 20px",
                            borderRadius: "10px",
                            border: "none",
                            background: "#101c44",
                            color: "#ffffff",
                            fontWeight: 800,
                            cursor: "pointer",
                            fontSize: "0.82rem"
                          }}
                        >
                          {submittingAssignment ? "Submitting..." : "Submit to Teacher"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════ TAB 5: MY COURSES ════════════ */}
          {currentTab === "My Courses" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                    Enrolled Courses & Syllabi
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                    Structured video curriculums and topic modules taught by master instructors.
                  </p>
                </div>
                <Link
                  to="/classrooms"
                  style={{
                    padding: "9px 18px",
                    background: "#101c44",
                    color: "#ffffff",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <SvgIcon name="video" size={14} color="#fef08a" />
                  <span>Browse Video Classrooms</span>
                </Link>
              </div>

              {/* Course Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "18px" }}>
                {coursesCatalog.map((c) => (
                  <div key={c.id} className="student-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ width: 48, height: 48, borderRadius: "14px", background: c.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <SvgIcon name={c.iconName} size={24} color="#101c44" stroke={2} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#101c44" }}>{c.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{c.tutor}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: c.levelColor }}>{c.level}</span>
                      <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{c.lessons} Lessons · {c.hours}h</span>
                    </div>

                    <div>
                      <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden", marginBottom: "6px" }}>
                        <div style={{ height: "100%", width: `${c.progress}%`, background: c.progress === 100 ? "#16a34a" : "#101c44", borderRadius: "99px" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#94a3b8" }}>
                        <span>Progress</span>
                        <strong style={{ color: "#101c44" }}>{c.progress}%</strong>
                      </div>
                    </div>

                    <Link
                      to="/classrooms"
                      style={{
                        padding: "9px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        textAlign: "center",
                        textDecoration: "none",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        color: "#101c44"
                      }}
                    >
                      Open Course Lessons →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════ TAB 6: FRIENDS ════════════ */}
          {currentTab === "Friends" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                    Friends & Classmates
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                    Collaborate with peers, form study partnerships, and compare mock scores.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", padding: "4px", borderRadius: "12px" }}>
                  <button
                    onClick={() => setFriendSubTab("friends")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "10px",
                      border: "none",
                      background: friendSubTab === "friends" ? "#101c44" : "transparent",
                      color: friendSubTab === "friends" ? "#ffffff" : "#64748b",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    My Friends ({friends.length})
                  </button>
                  <button
                    onClick={() => setFriendSubTab("requests")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "10px",
                      border: "none",
                      background: friendSubTab === "requests" ? "#101c44" : "transparent",
                      color: friendSubTab === "requests" ? "#ffffff" : "#64748b",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    Requests {friendRequests.length > 0 && `(${friendRequests.length})`}
                  </button>
                  <button
                    onClick={() => setFriendSubTab("find")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "10px",
                      border: "none",
                      background: friendSubTab === "find" ? "#101c44" : "transparent",
                      color: friendSubTab === "find" ? "#ffffff" : "#64748b",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer"
                    }}
                  >
                    Find Classmates
                  </button>
                </div>
              </div>

              {/* Subtab: Friends List */}
              {friendSubTab === "friends" && (
                friends.length === 0 ? (
                  <div className="student-card" style={{ textAlign: "center", padding: "40px" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <SvgIcon name="friends" size={28} color="#94a3b8" />
                    </div>
                    <h3 style={{ color: "#101c44", margin: "0 0 6px", fontSize: "1.05rem", fontWeight: 800 }}>
                      No connected friends yet
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.84rem", margin: "0 0 16px" }}>
                      Connect with fellow exam candidates to discuss lessons and past questions.
                    </p>
                    <button
                      onClick={() => setFriendSubTab("find")}
                      style={{ padding: "9px 20px", background: "#101c44", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}
                    >
                      Find Classmates →
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
                    {friends.map((f) => (
                      <div key={f.id} className="student-card" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px" }}>
                        <div style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: "#101c44",
                          color: "#fef08a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          flexShrink: 0
                        }}>
                          {f.profile?.fullName?.[0] || f.username?.[0] || "S"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, color: "#101c44", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {f.profile?.fullName || f.username}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "#94a3b8" }}>{f.role}</div>
                        </div>
                        <Link
                          to="/chat"
                          style={{
                            padding: "6px 12px",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            borderRadius: "10px",
                            fontSize: "0.78rem",
                            fontWeight: 800,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <SvgIcon name="messages" size={13} color="#16a34a" />
                          <span>Chat</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Subtab: Requests */}
              {friendSubTab === "requests" && (
                friendRequests.length === 0 ? (
                  <div className="student-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No pending friend requests.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {friendRequests.map((req) => (
                      <div key={req.id} className="student-card" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px" }}>
                        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#101c44", color: "#fef08a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                          {req.requester?.profile?.fullName?.[0] || "R"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, color: "#101c44", fontSize: "0.9rem" }}>
                            {req.requester?.profile?.fullName || req.requester?.username}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "#94a3b8" }}>Sent you a friend request</div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => acceptFriendRequest(req.id)}
                            style={{ padding: "7px 14px", background: "#101c44", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer" }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => declineFriendRequest(req.id)}
                            style={{ padding: "7px 14px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer" }}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Subtab: Find Classmates */}
              {friendSubTab === "find" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      value={friendSearch}
                      onChange={(e) => setFriendSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchClassmates()}
                      placeholder="Search classmates by name or email..."
                      style={{
                        flex: 1,
                        padding: "11px 16px",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.88rem",
                        outline: "none",
                        fontFamily: "inherit"
                      }}
                    />
                    <button
                      onClick={searchClassmates}
                      disabled={searchingFriends}
                      style={{
                        padding: "11px 20px",
                        background: "#101c44",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "14px",
                        fontWeight: 800,
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}
                    >
                      {searchingFriends ? "Searching..." : "Search"}
                    </button>
                  </div>

                  {friendResults.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {friendResults.map((u) => (
                        <div key={u.id} className="student-card" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px" }}>
                          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#101c44", color: "#fef08a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                            {u.profile?.fullName?.[0] || u.username?.[0] || "U"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, color: "#101c44", fontSize: "0.9rem" }}>{u.profile?.fullName || u.username}</div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{u.role}</div>
                          </div>
                          <button
                            onClick={() => sendFriendRequest(u.id)}
                            style={{ padding: "7px 16px", background: "#101c44", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer" }}
                          >
                            + Add Friend
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ════════════ TAB 7: MESSAGES ════════════ */}
          {currentTab === "Messages" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                    Direct Conversations
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                    Communicate with classmates and instructors in real-time.
                  </p>
                </div>
                <Link
                  to="/chat"
                  style={{
                    padding: "9px 18px",
                    background: "#101c44",
                    color: "#ffffff",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <SvgIcon name="messages" size={14} color="#fef08a" />
                  <span>Open Full Chat</span>
                </Link>
              </div>

              {friends.length === 0 ? (
                <div className="student-card" style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <SvgIcon name="messages" size={30} color="#94a3b8" />
                  </div>
                  <h3 style={{ color: "#101c44", margin: "0 0 8px", fontSize: "1.05rem", fontWeight: 800 }}>
                    No Active Conversations
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0 0 18px" }}>
                    Connect with your classmates to start study discussions.
                  </p>
                  <button
                    onClick={() => handleSelectTab("Friends")}
                    style={{ padding: "9px 20px", background: "#101c44", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}
                  >
                    View Friends & Classmates
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {friends.map((f) => (
                    <Link to="/chat" key={f.id} style={{ textDecoration: "none" }}>
                      <div className="student-card" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", cursor: "pointer" }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#101c44", color: "#fef08a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                          {f.profile?.fullName?.[0] || f.username?.[0] || "U"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, color: "#101c44", fontSize: "0.92rem" }}>
                            {f.profile?.fullName || f.username}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Tap to open direct message thread →</div>
                        </div>
                        <SvgIcon name="send" size={16} color="#101c44" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════ TAB 8: GROUPS ════════════ */}
          {currentTab === "Groups" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                    Study Circles & Groups
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                    Collaborative peer circles for exam preparation and assignment discussions.
                  </p>
                </div>
                <Link
                  to="/groups"
                  style={{
                    padding: "9px 18px",
                    background: "#101c44",
                    color: "#ffffff",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <SvgIcon name="groups" size={14} color="#fef08a" />
                  <span>Browse All Circles</span>
                </Link>
              </div>

              {loadingGroups ? (
                <div className="student-card" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  Loading study circles...
                </div>
              ) : groupsList.length === 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                  {[
                    { id: "g1", name: "JAMB Mathematics Masters", desc: "Daily practice of JAMB UTME past question calculus and geometry drills." },
                    { id: "g2", name: "WAEC Physics Revision", desc: "Formulas, optics, mechanics and practical physics paper discussion." },
                    { id: "g3", name: "English Oral & Literature Circle", desc: "Poetry analysis, prose summary, and phonetic mastery drills." }
                  ].map((g) => (
                    <div key={g.id} className="student-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}>
                      <div>
                        <div style={{ fontWeight: 800, color: "#101c44", fontSize: "1rem", marginBottom: "6px" }}>{g.name}</div>
                        <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>{g.desc}</p>
                      </div>
                      <Link to="/groups" style={{ fontSize: "0.8rem", fontWeight: 800, color: "#101c44", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                        View Circle Discussion <SvgIcon name="arrowUpRight" size={13} color="#101c44" stroke={2.5} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
                  {groupsList.map((g) => (
                    <div key={g.id} className="student-card" style={{ padding: "20px" }}>
                      <div style={{ fontWeight: 800, color: "#101c44", fontSize: "1rem", marginBottom: "6px" }}>{g.name}</div>
                      <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "0 0 14px", lineHeight: 1.5 }}>
                        {g.description || "Active academy circle for peer accountability."}
                      </p>
                      <Link to="/groups" style={{ fontSize: "0.8rem", fontWeight: 800, color: "#101c44" }}>
                        View Circle Discussion →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════ TAB 9: NOTIFICATIONS ════════════ */}
          {currentTab === "Notifications" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                  Academy Notifications
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                  Stay informed on test announcements, teacher feedback, and new learning resources.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  {
                    icon: "clock",
                    bg: "#e0f2fe",
                    color: "#0284c7",
                    title: "CBT Examination Practice Live",
                    desc: "Past questions for JAMB UTME and WAEC SSCE are available in the CBT Examination Center.",
                    time: "Today"
                  },
                  {
                    icon: "bulb",
                    bg: "#fef08a",
                    color: "#0f172a",
                    title: "New TIPS Recall Trick Added",
                    desc: "Quick recall mnemonics for Trigonometry identities are available in the TIPS library.",
                    time: "Yesterday"
                  },
                  {
                    icon: "assignment",
                    bg: "#f0fdf4",
                    color: "#16a34a",
                    title: "Weekly Calculus Assignment Published",
                    desc: "Check the Assignments tab to review the problem set and submit your answer.",
                    time: "3 days ago"
                  }
                ].map((note, idx) => (
                  <div key={idx} className="student-card" style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "18px" }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      background: note.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <SvgIcon name={note.icon} size={20} color={note.color} stroke={2} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                        <div style={{ fontWeight: 800, color: "#101c44", fontSize: "0.92rem" }}>{note.title}</div>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{note.time}</span>
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0, lineHeight: 1.4 }}>{note.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════════ TAB 10: SETTINGS ════════════ */}
          {currentTab === "Settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#101c44", margin: "0 0 4px" }}>
                  Account & Study Personalization
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                  Manage your academic program, enrolled subjects, and profile information.
                </p>
              </div>

              {/* Photo Upload Card */}
              <div className="student-card" style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#101c44", margin: "0 0 14px" }}>Profile Photo</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", border: "3px solid #dfa921", background: "#101c44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ color: "#fef08a", fontWeight: 900, fontSize: "1.6rem" }}>{studentName[0]}</span>
                    )}
                  </div>
                  <div>
                    <label style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "#101c44",
                      color: "#ffffff",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer"
                    }}>
                      <SvgIcon name="edit" size={13} color="#fef08a" />
                      <span>Upload New Photo</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                    </label>
                    <p style={{ fontSize: "0.74rem", color: "#94a3b8", margin: "6px 0 0" }}>PNG or JPG · Max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Preferences Form */}
              <div className="student-card" style={{ padding: "24px" }}>
                <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.fullName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, fullName: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "0.9rem", fontFamily: "inherit" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                      Academic Class / Target Program
                    </label>
                    <select
                      value={settingsForm.targetClass}
                      onChange={(e) => setSettingsForm({ ...settingsForm, targetClass: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "0.9rem", fontWeight: 700, color: "#101c44", fontFamily: "inherit", background: "#ffffff" }}
                    >
                      <option value="SSS 3">SSS 3 (Senior Secondary School 3)</option>
                      <option value="SSS 2">SSS 2 (Senior Secondary School 2)</option>
                      <option value="SSS 1">SSS 1 (Senior Secondary School 1)</option>
                      <option value="JSS 3">JSS 3 (Junior Secondary School 3)</option>
                      <option value="JAMB UTME Candidate">JAMB UTME Candidate</option>
                      <option value="WAEC Candidate">WAEC SSCE Candidate</option>
                      <option value="Digital Skills Student">Digital Skills Student</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "8px", textTransform: "uppercase" }}>
                      Enrolled / Target Subjects
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
                      {[
                        "Mathematics",
                        "English Language",
                        "Physics",
                        "Chemistry",
                        "Biology",
                        "Economics",
                        "Government",
                        "Literature in English",
                        "Computer Studies / Coding"
                      ].map((subj) => {
                        const checked = settingsForm.selectedSubjects.includes(subj);
                        return (
                          <div
                            key={subj}
                            onClick={() => toggleSubject(subj)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              borderRadius: "10px",
                              border: checked ? "1px solid #101c44" : "1px solid #e2e8f0",
                              background: checked ? "rgba(16,28,68,0.05)" : "#ffffff",
                              cursor: "pointer"
                            }}
                          >
                            <input type="checkbox" checked={checked} readOnly style={{ accentColor: "#101c44" }} />
                            <span style={{ fontSize: "0.82rem", fontWeight: checked ? 800 : 500, color: "#101c44" }}>{subj}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        placeholder="+234..."
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "0.9rem", fontFamily: "inherit" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={settingsForm.dateOfBirth}
                        onChange={(e) => setSettingsForm({ ...settingsForm, dateOfBirth: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "0.9rem", fontFamily: "inherit" }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    style={{
                      marginTop: "8px",
                      padding: "11px 24px",
                      background: "#101c44",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      cursor: savingSettings ? "not-allowed" : "pointer",
                      opacity: savingSettings ? 0.7 : 1,
                      alignSelf: "flex-start"
                    }}
                  >
                    {savingSettings ? "Saving..." : "Save Preferences"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* ── 3. RIGHT PROFILE & SCHEDULE COLUMN ──────────────────── */}
        <aside className="student-right-column" style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          borderLeft: "1px solid #f1f5f9",
          paddingLeft: "18px"
        }}>
          {/* Profile Header Capsule matching reference */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#101c44" }}>Profile</span>
              <button
                onClick={() => handleSelectTab("Settings")}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}
                title="Edit Profile"
                aria-label="Edit Profile"
              >
                <SvgIcon name="edit" size={16} color="#94a3b8" />
              </button>
            </div>

            {/* Circular Avatar in Cyan background ring */}
            <div style={{
              width: "74px",
              height: "74px",
              borderRadius: "50%",
              background: "#0284c7",
              padding: "3px",
              boxShadow: "0 6px 18px rgba(2, 132, 199, 0.2)",
              marginBottom: "10px"
            }}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={studentFullName}
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#101c44", color: "#fef08a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.4rem" }}>
                  {studentName[0]}
                </div>
              )}
            </div>

            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#101c44", margin: "0 0 2px" }}>
              {studentFullName}
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>
              {studentEmail}
            </span>
          </div>

          {/* ── Interactive Calendar Widget ──────────────────────── */}
          <div style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "16px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 16px rgba(16,28,68,0.02)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <SvgIcon name="chevronLeft" size={14} color="#94a3b8" />
              </button>
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#101c44" }}>
                September 2026
              </span>
              <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <SvgIcon name="chevronRight" size={14} color="#94a3b8" />
              </button>
            </div>

            {/* Weekdays */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", marginBottom: "8px" }}>
              {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
                <span key={d} style={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 700 }}>{d}</span>
              ))}
            </div>

            {/* Day numbers with active day pill */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", alignItems: "center" }}>
              {[20, 21, 22, 23, 24, 25, 26].map((day) => {
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      background: isSelected ? "#0f172a" : "transparent",
                      color: isSelected ? "#ffffff" : "#64748b",
                      border: "none",
                      borderRadius: "10px",
                      padding: "6px 0",
                      fontSize: "0.75rem",
                      fontWeight: isSelected ? 800 : 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Schedule Section ─────────────────────────────────── */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "#101c44" }}>Schedule</span>
              <span
                onClick={() => handleSelectTab("My Courses")}
                style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, cursor: "pointer" }}
              >
                See all
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700, marginBottom: "4px" }}>22 Sept</div>
                <div style={{
                  background: "linear-gradient(90deg, #f0fdf4 0%, #fef9c3 100%)",
                  borderRadius: "14px",
                  padding: "10px 14px",
                  borderLeft: "4px solid #0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#101c44" }}>12:00</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#101c44" }}>Mathematics & Geometry</div>
                    <div style={{ fontSize: "0.68rem", color: "#64748b" }}>SSS 3 Term 1</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700, marginBottom: "4px" }}>25 Sept</div>
                <div style={{
                  background: "linear-gradient(90deg, #ecfeff 0%, #fef9c3 100%)",
                  borderRadius: "14px",
                  padding: "10px 14px",
                  borderLeft: "4px solid #0891b2",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#101c44" }}>14:30</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#101c44" }}>Physics Mechanics</div>
                    <div style={{ fontSize: "0.68rem", color: "#64748b" }}>JAMB Preparation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Reminders Section ────────────────────────────────── */}
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#101c44", marginBottom: "12px" }}>
              Reminders
            </div>

            <div style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "12px 14px",
              border: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "#e0f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <SvgIcon name="clock" size={16} color="#0284c7" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#101c44" }}>
                  JAMB Mock CBT Exam
                </div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                  Friday 10:00 AM
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
