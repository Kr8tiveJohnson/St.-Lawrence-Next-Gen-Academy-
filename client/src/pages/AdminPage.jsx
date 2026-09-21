import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import HomepageSettings from "../features/admin/HomepageSettings";
import SchoolDashboardView from "../components/dashboard/SchoolDashboardView";

// ─── SVG Icon ────────────────────────────────────────────────────────────────
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
  news:      "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  fame:      "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  analytics: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  shield:    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  trash:     "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  edit:      "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  plus:      "M12 4v16m8-8H4",
  logout:    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  menu:      "M4 6h16M4 12h16M4 18h16",
  check:     "M5 13l4 4L19 7",
  x:         "M6 18L18 6M6 6l12 12",
  wallet:    "M20 12V8H6a2 2 0 012-2h12V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2h-2m-4 0v4H6V12z",
  settings:  "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  bell:      "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  message:   "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  search:    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 5l7 7-7 7"
};

const NAV_GROUPS = [
  {
    category: "Home",
    items: [
      { id: "Dashboard",   label: "Admin Dashboard",    icon: "dashboard" },
    ]
  },
  {
    category: "Academic Management",
    items: [
      { id: "Users",       label: "Students",           icon: "users"     },
      { id: "Teachers",    label: "Teachers",           icon: "teachers"  },
      { id: "Courses",     label: "Classrooms & Courses", icon: "courses" },
      { id: "QuestionBank",label: "Question Bank",      icon: "news"      },
      { id: "TipsManager", label: "TIPS Routine",       icon: "fame"      },
      { id: "Resources",   label: "Library Resources",   icon: "analytics" },
    ]
  },
  {
    category: "Communication",
    items: [
      { id: "Groups",      label: "Communities & Groups", icon: "users"   },
      { id: "News",        label: "Notice & News",       icon: "news"      },
      { id: "Fame",        label: "Hall of Fame",        icon: "fame"      },
    ]
  },
  {
    category: "Finance & Operations",
    items: [
      { id: "Earnings",    label: "Account & Earnings",  icon: "wallet"    },
      { id: "Analytics",   label: "Analytics",           icon: "analytics" },
      { id: "Settings",    label: "Homepage Settings",   icon: "settings"  },
      { id: "Moderation",  label: "Exam & Moderation",   icon: "shield"    },
    ]
  }
];

const NAV = NAV_GROUPS.flatMap(g => g.items);


const adminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ width: 42, height: 42, borderRadius: "12px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon path={ICONS[icon]} size={22} color={color} />
        </div>
        <span style={{ fontSize: "0.7rem", color: "#16a34a", fontWeight: 700, background: "#f0fdf4", padding: "2px 8px", borderRadius: "20px" }}>Live</span>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f2144", lineHeight: 1 }}>{value ?? "—"}</div>
      <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "5px" }}>{label}</div>
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f2144" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon path={ICONS.x} size={16} color="#64748b" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text", placeholder, required, as }) {
  const base = { width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", color: "#0f2144" };
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {as === "textarea"
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} required={required} rows={4} style={{ ...base, resize: "vertical" }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} style={base} />}
    </div>
  );
}

// ─── Image Uploader ──────────────────────────────────────────────────────────
function ImageUploader({ label = "Image", value, onChange }) {
  const [tab, setTab] = useState("upload"); // "upload" | "url"
  const fileRef = useState(null);
  const inputRef = fileRef[1];
  const [inputEl, setInputEl] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => onChange(evt.target.result);
    reader.readAsDataURL(file);
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: "7px",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "0.78rem",
    cursor: "pointer",
    fontFamily: "inherit",
    background: active ? "#0f2144" : "transparent",
    color: active ? "#fff" : "#64748b",
    transition: "all 0.15s",
  });

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", padding: "4px", borderRadius: "10px", marginBottom: "10px" }}>
        <button type="button" style={tabStyle(tab === "upload")} onClick={() => setTab("upload")}>📁 Upload from Device</button>
        <button type="button" style={tabStyle(tab === "url")} onClick={() => setTab("url")}>🔗 Image URL</button>
      </div>
      {tab === "upload" ? (
        <div
          onClick={() => inputEl?.click()}
          style={{ border: "2px dashed #c7d4e0", borderRadius: "12px", padding: "20px", textAlign: "center", cursor: "pointer", background: "#f8fafc", transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#0f2144"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#c7d4e0"}
        >
          {value && (value.startsWith("data:") || value.startsWith("http")) ? (
            <img src={value} alt="preview" style={{ maxHeight: 120, maxWidth: "100%", borderRadius: "8px", objectFit: "cover" }} />
          ) : (
            <>
              <div style={{ fontSize: "2rem", marginBottom: "6px" }}>🖼️</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b" }}>Click to select an image from your device</div>
              <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "3px" }}>JPG, PNG, GIF, WebP — max 5MB</div>
            </>
          )}
          <input
            ref={el => setInputEl(el)}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.9rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box", color: "#0f2144" }}
        />
      )}
      {value && (
        <button type="button" onClick={() => onChange("")} style={{ marginTop: "6px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}>✕ Remove Image</button>
      )}
    </div>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", background: loading ? "#9ca3af" : "#0f2144", color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
      {loading ? "Saving..." : label}
    </button>
  );
}

// ─── Section: Dashboard ───────────────────────────────────────────────────────
function DashboardTab({ stats, onNav }) {
  const [liveStudents, setLiveStudents] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await client.get("/admin/users?role=STUDENT&limit=6", { headers: adminHeaders() });
        setLiveStudents(data.users || []);
      } catch (e) {}
    })();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <SchoolDashboardView
        role="ADMIN"
        stats={stats}
        liveUsers={liveStudents}
        onNavigateTab={onNav}
        onViewAllActivity={() => onNav("Analytics")}
      />

      {/* Quick Actions & System Status Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
        <div style={{ background: "#ffffff", borderRadius: "24px", padding: "26px 28px", boxShadow: "0 4px 20px rgba(16,28,68,0.04)", border: "1px solid rgba(16,28,68,0.06)" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "1.05rem", fontWeight: 800, color: "var(--navy, #101c44)" }}>⚡ Quick Operational Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px" }}>
            {[
              { label: "Add News Article", tab: "News", color: "#6366f1" },
              { label: "Create Course", tab: "Courses", color: "#0ea5e9" },
              { label: "Hall of Fame", tab: "Fame", color: "#dfa921" },
              { label: "View Earnings", tab: "Earnings", color: "#22c55e" },
              { label: "Manage Students", tab: "Users", color: "#ec4899" },
              { label: "Teacher Approvals", tab: "Teachers", color: "#f97316" },
            ].map(a => (
              <button key={a.label} onClick={() => onNav(a.tab)} style={{ background: `${a.color}10`, border: `1px solid ${a.color}30`, color: a.color, borderRadius: "12px", padding: "12px 14px", fontWeight: 700, fontSize: "0.82rem", textAlign: "left", fontFamily: "inherit", cursor: "pointer", transition: "transform 0.15s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                + {a.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: "24px", padding: "26px 28px", boxShadow: "0 4px 20px rgba(16,28,68,0.04)", border: "1px solid rgba(16,28,68,0.06)" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "1.05rem", fontWeight: 800, color: "var(--navy, #101c44)" }}>🛡️ Academy Infrastructure Status</h3>
          {[["PostgreSQL Database", "Online · 100%"], ["Express API Gateway", "Running · v1.0"], ["Vite Frontend Client", "Active · Connected"], ["Authentication RBAC", "Enforced · Secure"]].map(([name, status]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.85rem", color: "#374151", fontWeight: 600 }}>{name}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "4px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />{status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── User Detail Modal (Admin) ───────────────────────────────────────────────
function UserDetailModal({ userId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await client.get(`/admin/users/${userId}`, { headers: adminHeaders() });
        setDetail(data);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [userId]);

  const badgeColor = { STUDENT: "#6366f1", TEACHER: "#0ea5e9", ADMIN: "#d4a853", MAIN_ADMIN: "#ef4444" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,22,40,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 32, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f2144" }}>👤 User Profile</h2>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: "1rem" }}>✕</button>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>Loading user details...</p>
        ) : !detail ? (
          <p style={{ textAlign: "center", color: "#ef4444" }}>Failed to load user.</p>
        ) : (() => {
          const { user, stats, friends, groups } = detail;
          return (
            <>
              {/* Avatar + Basic Info */}
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", overflow: "hidden", background: "#0f2144", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {user.profile?.avatarUrl
                    ? <img src={user.profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ color: "#d4a853", fontWeight: 900, fontSize: "1.6rem" }}>{(user.profile?.fullName || user.email || "?")[0].toUpperCase()}</span>
                  }
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#0f2144", fontSize: "1.1rem", fontWeight: 800 }}>{user.profile?.fullName || "No name set"}</h3>
                  <p style={{ margin: "3px 0", color: "#6b7280", fontSize: "0.88rem" }}>{user.email}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    <span style={{ background: `${badgeColor[user.role] || "#6b7280"}18`, color: badgeColor[user.role] || "#6b7280", padding: "3px 10px", borderRadius: 99, fontSize: "0.76rem", fontWeight: 700 }}>{user.role}</span>
                    <span style={{ background: user.tier === "PAID" ? "#fef3c718" : "#f1f5f9", color: user.tier === "PAID" ? "#d97706" : "#6b7280", padding: "3px 10px", borderRadius: 99, fontSize: "0.76rem", fontWeight: 700 }}>{user.tier}</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                {[{label: "Friends", val: stats.friendsCount, icon: "🤝"}, {label: "Groups", val: stats.groupsCount, icon: "👥"}, {label: "Messages Sent", val: stats.messagesSent, icon: "💬"}].map(s => (
                  <div key={s.label} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
                    <div style={{ fontWeight: 900, fontSize: "1.3rem", color: "#0f2144" }}>{s.val}</div>
                    <div style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Profile Fields */}
              <div style={{ background: "#f8fafc", borderRadius: 14, padding: 18, marginBottom: 16 }}>
                <h4 style={{ margin: "0 0 12px", color: "#0f2144", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Profile Details</h4>
                {[{label: "Phone", val: user.profile?.phone}, {label: "Date of Birth", val: user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toLocaleDateString() : null}, {label: "Member Since", val: new Date(user.createdAt).toLocaleDateString()}].map(r => r.val ? (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: "0.82rem", color: "#0f2144", fontWeight: 700 }}>{r.val}</span>
                  </div>
                ) : null)}
              </div>

              {/* Friends */}
              {friends.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: "0 0 10px", color: "#0f2144", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Friends ({friends.length})</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {friends.slice(0, 10).map(f => (
                      <span key={f.id} style={{ background: "#eff6ff", color: "#3b82f6", padding: "4px 12px", borderRadius: 99, fontSize: "0.78rem", fontWeight: 600 }}>{f.fullName || f.email}</span>
                    ))}
                    {friends.length > 10 && <span style={{ color: "#9ca3af", fontSize: "0.78rem", alignSelf: "center" }}>+{friends.length - 10} more</span>}
                  </div>
                </div>
              )}

              {/* Groups */}
              {groups.length > 0 && (
                <div>
                  <h4 style={{ margin: "0 0 10px", color: "#0f2144", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Groups Joined ({groups.length})</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {groups.map(g => (
                      <span key={g.id} style={{ background: "#f0fdf4", color: "#16a34a", padding: "4px 12px", borderRadius: 99, fontSize: "0.78rem", fontWeight: 600 }}>👥 {g.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}

// ─── Section: Users ───────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/admin/users", { headers: adminHeaders() });
      setUsers(data.users || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeRole = async (id, role) => {
    try {
      await client.put(`/admin/users/${id}/role`, { role }, { headers: adminHeaders() });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch (e) { alert("Failed to update role"); }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await client.delete(`/admin/users/${id}`, { headers: adminHeaders() });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) { alert("Failed to delete user"); }
  };

  const filtered = users.filter(u =>
    (u.profile?.fullName || u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = { STUDENT: "#6366f1", TEACHER: "#0ea5e9", ADMIN: "#d4a853", MAIN_ADMIN: "#ef4444" };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>All Users ({users.length})</h2>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none", color: "#0f2144" }} />
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                {["Name", "Email", "Role", "Tier", "Joined", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "#0f2144" }}>{u.profile?.fullName || "—"}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{u.email}</td>
                  <td style={{ padding: "12px" }}>
                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: "6px", border: `1px solid ${roleBadge[u.role] || "#e2e8f0"}`, color: roleBadge[u.role] || "#374151", fontWeight: 700, fontSize: "0.8rem", background: `${roleBadge[u.role] || "#6b7280"}15`, cursor: "pointer" }}>
                      {["STUDENT", "TEACHER", "ADMIN"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{u.tier}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setSelectedUserId(u.id)} style={{ background: "#eff6ff", color: "#3b82f6", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>View</button>
                      <button onClick={() => deleteUser(u.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {selectedUserId && <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}
    </div>
  );
}

// ─── Section: Groups ───────────────────────────────────────────────────────────
function GroupsTab() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/groups");
      setGroups(data.groups || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ name: "", description: "" });
    setEditItem(null);
    setModal(true);
  };

  const openEdit = (item) => {
    setForm({ name: item.name, description: item.description || "" });
    setEditItem(item);
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await client.put(`/groups/${editItem.id}`, form, { headers: adminHeaders() });
      } else {
        await client.post("/groups", form, { headers: adminHeaders() });
      }
      setModal(false);
      load();
    } catch (e) { alert(e.response?.data?.error || "Failed to save group"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this group? This will remove all member enrollments.")) return;
    try {
      await client.delete(`/groups/${id}`, { headers: adminHeaders() });
      load();
    } catch (e) { alert("Failed to delete group"); }
  };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>All Study Groups ({groups.length})</h2>
        <button onClick={openCreate} style={{ background: "#0f2144", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Add Group</button>
      </div>

      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading groups...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                {["Name", "Description", "Members", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <tr key={g.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px", fontWeight: 600, color: "#0f2144" }}>{g.name}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{g.description || "No description provided."}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{g._count?.enrollments ?? 0} members</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(g)} style={{ background: "#eff6ff", color: "#3b82f6", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Edit</button>
                      <button onClick={() => del(g.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>No groups found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={editItem ? "Edit Study Group" : "Create Study Group"} onClose={() => setModal(false)}>
          <form onSubmit={submit}>
            <FormInput label="Group Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. WAEC Science Circle" required />
            <FormInput as="textarea" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Group description..." />
            <SubmitBtn loading={saving} label={editItem ? "Save Changes" : "Create Group"} />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Section: News ────────────────────────────────────────────────────────────
function NewsTab() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", tag: "general", summary: "", details: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/news");
      setNews(data.news || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ title: "", tag: "general", summary: "", details: "", imageUrl: "" });
    setEditItem(null);
    setModal(true);
  };

  const openEdit = (item) => {
    setForm({ title: item.title, tag: item.tag, summary: item.summary, details: item.details, imageUrl: item.imageUrl || "" });
    setEditItem(item);
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await client.put(`/news/${editItem.id}`, form, { headers: adminHeaders() });
      } else {
        await client.post("/news", form, { headers: adminHeaders() });
      }
      setModal(false);
      load();
    } catch (e) { alert(e.response?.data?.error || "Failed to save article"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this article?")) return;
    try { await client.delete(`/news/${id}`, { headers: adminHeaders() }); load(); } catch (e) { alert("Failed to delete"); }
  };

  const tagColor = { general: "#6366f1", exam: "#0ea5e9", update: "#22c55e", event: "#f97316" };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>News Articles ({news.length})</h2>
        <button onClick={openCreate} style={{ background: "#0f2144", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Add Article</button>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {news.filter(n => n.tag !== "hall-of-fame").map(n => (
            <div key={n.id} style={{ display: "flex", gap: "16px", padding: "14px 16px", border: "1px solid #f0f0f0", borderRadius: "12px", background: "#fff" }}>
              <div style={{ width: 80, height: 60, borderRadius: "8px", background: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {n.imageUrl ? (
                  <img src={n.imageUrl} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "1.5rem" }}>📰</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: tagColor[n.tag] || "#6366f1", background: `${tagColor[n.tag] || "#6366f1"}15`, padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase" }}>{n.tag}</span>
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontWeight: 700, color: "#0f2144", fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                <div style={{ fontSize: "0.82rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.summary}</div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                <button onClick={() => openEdit(n)} style={{ background: "#f1f5f9", color: "#0f2144", border: "none", borderRadius: "8px", padding: "7px 12px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Edit</button>
                <button onClick={() => del(n.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "7px 12px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Delete</button>
              </div>
            </div>
          ))}
          {news.filter(n => n.tag !== "hall-of-fame").length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>No articles yet.</p>}
        </div>
      )}
      {modal && (
        <Modal title={editItem ? "Edit News Article" : "Add News Article"} onClose={() => setModal(false)}>
          <form onSubmit={submit}>
            <FormInput label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Article title" required />
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tag</label>
              <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.9rem", fontFamily: "inherit", color: "#0f2144" }}>
                {["general", "exam", "update", "event"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <ImageUploader label="Article Image" value={form.imageUrl} onChange={val => setForm({ ...form, imageUrl: val })} />
            <FormInput label="Summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Short summary" required />
            <FormInput as="textarea" label="Full Details" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Full article content..." required />
            <SubmitBtn loading={saving} label={editItem ? "Save Changes" : "Publish Article"} />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Section: Hall of Fame ────────────────────────────────────────────────────
function FameTab() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", track: "", score: "", achievement: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/news/hall-of-fame/entries");
      const parsed = (data.entries || []).map(e => {
        let extra = {};
        try { extra = JSON.parse(e.details || "{}"); } catch {}
        return { ...e, ...extra };
      });
      setEntries(parsed);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ name: "", track: "", score: "", achievement: "", imageUrl: "" });
    setEditItem(null);
    setModal(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || item.title || "",
      track: item.track || "",
      score: item.score || "",
      achievement: item.achievement || item.summary || "",
      imageUrl: item.imageUrl || "",
    });
    setEditItem(item);
    setModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.track || !form.score || !form.achievement) {
      alert("Please fill in Name, Track, Score, and Achievement.");
      return;
    }
    setSaving(true);
    // We store structured data: title = name, summary = achievement, details = JSON blob
    const payload = {
      title: form.name,
      summary: form.achievement,
      details: JSON.stringify({ name: form.name, track: form.track, score: form.score, achievement: form.achievement }),
      imageUrl: form.imageUrl,
      tag: "hall-of-fame"
    };
    try {
      if (editItem) {
        await client.put(`/news/${editItem.id}`, payload, { headers: adminHeaders() });
      } else {
        await client.post("/news/hall-of-fame/add", { title: form.name, summary: form.achievement, details: JSON.stringify({ name: form.name, track: form.track, score: form.score, achievement: form.achievement }), imageUrl: form.imageUrl }, { headers: adminHeaders() });
      }
      setModal(false);
      load();
    } catch (e) { alert(e.response?.data?.error || "Failed to save entry"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Remove this Hall of Fame entry?")) return;
    try { await client.delete(`/news/${id}`, { headers: adminHeaders() }); load(); } catch (e) { alert("Failed to delete"); }
  };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Hall of Fame ({entries.length})</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#9ca3af" }}>Manage student achievement entries displayed on the homepage</p>
        </div>
        <button onClick={openCreate} style={{ background: "#d4a853", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Add Entry</button>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {entries.map(e => (
            <div key={e.id} style={{ border: "1px solid #fef9c3", borderRadius: "16px", background: "linear-gradient(135deg, #fffbeb 0%, #fff 100%)", overflow: "hidden" }}>
              <div style={{ height: 100, background: "linear-gradient(135deg, #d4a853, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                {e.imageUrl ? (
                  <img src={e.imageUrl} alt={e.name || e.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "3rem" }}>🏆</span>
                )}
                <div style={{ position: "absolute", top: 8, right: 10, background: "rgba(0,0,0,0.45)", color: "#fde68a", fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.04em" }}>
                  {e.track || "Achievement"}
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ fontWeight: 800, color: "#92400e", fontSize: "1rem", marginBottom: "4px" }}>{e.name || e.title}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#d4a853", marginBottom: "6px" }}>{e.score}</div>
                <div style={{ fontSize: "0.82rem", color: "#a16207", lineHeight: 1.5 }}>{e.achievement || e.summary}</div>
                <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                  <button onClick={() => openEdit(e)} style={{ flex: 1, background: "#fef3c7", color: "#92400e", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem" }}>✏️ Edit</button>
                  <button onClick={() => del(e.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem" }}>🗑 Remove</button>
                </div>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 40px", color: "#9ca3af" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏆</div>
              <p style={{ margin: 0, fontWeight: 600 }}>No Hall of Fame entries yet.</p>
              <p style={{ margin: "6px 0 0", fontSize: "0.85rem" }}>Click <strong>+ Add Entry</strong> to celebrate your first student win!</p>
            </div>
          )}
        </div>
      )}

      {modal && (
        <Modal title={editItem ? "Edit Hall of Fame Entry" : "Add Hall of Fame Entry"} onClose={() => setModal(false)}>
          <form onSubmit={submit}>
            <FormInput label="Student Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Adaeze Okonkwo" required />
            <FormInput label="Exam Track & Year" value={form.track} onChange={e => setForm({ ...form, track: e.target.value })} placeholder="e.g. WAEC SSCE · 2024" required />
            <FormInput label="Score / Result" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} placeholder="e.g. 9 A1s   or   340 / 400" required />
            <FormInput label="University / Achievement" value={form.achievement} onChange={e => setForm({ ...form, achievement: e.target.value })} placeholder="e.g. University of Lagos — Medicine" required />
            <ImageUploader label="Student Photo (optional)" value={form.imageUrl} onChange={val => setForm({ ...form, imageUrl: val })} />
            <SubmitBtn loading={saving} label={editItem ? "Save Changes" : "Add to Hall of Fame"} />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Section: Courses ─────────────────────────────────────────────────────────
function CoursesTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", category: "", subject: "", description: "", imageUrl: "", isPaid: false });
  const [saving, setSaving] = useState(false);

  // Lesson states
  const [lessonModal, setLessonModal] = useState(false);
  const [targetCourse, setTargetCourse] = useState(null);
  const [lessonForm, setLessonForm] = useState({ title: "", playbackId: "" });
  const [lessonSaving, setLessonSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/classrooms");
      setCourses(data.classrooms || data.courses || data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ title: "", category: "", subject: "", description: "", imageUrl: "", isPaid: false });
    setEditItem(null);
    setModal(true);
  };

  const openEdit = (course) => {
    setForm({ title: course.title, category: course.category, subject: course.subject, description: course.description || "", imageUrl: course.imageUrl || "", isPaid: course.isPaid });
    setEditItem(course);
    setModal(true);
  };

  const openLessons = (course) => {
    setTargetCourse(course);
    setLessonForm({ title: "", playbackId: "" });
    setLessonModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, isPaid: form.isPaid === "true" || form.isPaid === true };
      if (editItem) {
        await client.put(`/classrooms/${editItem.id}`, payload, { headers: adminHeaders() });
      } else {
        await client.post("/classrooms", payload, { headers: adminHeaders() });
      }
      setModal(false);
      load();
    } catch (err) { alert(err.response?.data?.error || "Failed to save course"); }
    setSaving(false);
  };

  const addLesson = async (e) => {
    e.preventDefault();
    setLessonSaving(true);
    try {
      // In St. Lawrence backend, lessons are associated with Course. Let's see how they are created.
      // Usually there is a POST classroom/:id/lesson or similar route, but since we just need the relation,
      // let's look at schema: Lesson belongs to Course.
      await client.post(`/classrooms/${targetCourse.id}/lessons`, lessonForm, { headers: adminHeaders() });
      alert("Lesson added successfully!");
      setLessonModal(false);
      load();
    } catch (err) {
      // Fallback if backend route isn't standard, we can handle or alert
      alert("Lesson addition endpoint requires course customization, verify server controllers.");
    }
    setLessonSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this course? All lessons will also be removed.")) return;
    try { await client.delete(`/classrooms/${id}`, { headers: adminHeaders() }); load(); } catch (e) { alert("Failed to delete"); }
  };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Courses ({courses.length})</h2>
        <button onClick={openCreate} style={{ background: "#ec4899", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Create Course</button>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {Array.isArray(courses) && courses.map(c => (
            <div key={c.id} style={{ border: "1px solid #f0f0f0", borderRadius: "16px", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 120, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "2.5rem" }}>📚</span>
                )}
                <span style={{ position: "absolute", top: 10, right: 10, fontSize: "0.72rem", fontWeight: 700, color: c.isPaid ? "#d4a853" : "#22c55e", background: c.isPaid ? "#fffbeb" : "#f0fdf4", border: `1px solid ${c.isPaid ? "#fef08a" : "#bbf7d0"}`, padding: "3px 10px", borderRadius: "20px" }}>{c.isPaid ? "PREMIUM" : "FREE"}</span>
              </div>
              <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.03em" }}>{c.category} &bull; {c.subject}</div>
                  <h4 style={{ margin: "4px 0 8px 0", color: "#0f2144", fontWeight: 800, fontSize: "1rem" }}>{c.title}</h4>
                  <p style={{ margin: "0 0 16px 0", fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.5 }}>{c.description || "No description provided."}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openLessons(c)} style={{ flex: 1, background: "#f1f5f9", color: "#0f2144", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem" }}>Lessons</button>
                  <button onClick={() => openEdit(c)} style={{ background: "#f1f5f9", color: "#0f2144", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Edit</button>
                  <button onClick={() => del(c.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px", gridColumn: "1/-1" }}>No courses yet.</p>}
        </div>
      )}

      {/* Course Modal */}
      {modal && (
        <Modal title={editItem ? "Edit Course" : "Create Course"} onClose={() => setModal(false)}>
          <form onSubmit={submit}>
            <FormInput label="Course Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. WAEC Mathematics 2026" required />
            <FormInput label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. WAEC, JAMB, Digital Skills" required />
            <FormInput label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics, English" required />
            <ImageUploader label="Course Cover Image" value={form.imageUrl} onChange={val => setForm({ ...form, imageUrl: val })} />
            <FormInput as="textarea" label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed course description..." />
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Access Type</label>
              <select value={form.isPaid} onChange={e => setForm({ ...form, isPaid: e.target.value })} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.9rem", fontFamily: "inherit", color: "#0f2144" }}>
                <option value={false}>Free</option>
                <option value={true}>Paid (Premium)</option>
              </select>
            </div>
            <SubmitBtn loading={saving} label={editItem ? "Save Changes" : "Create Course"} />
          </form>
        </Modal>
      )}

      {/* Lesson / Video Modal */}
      {lessonModal && targetCourse && (
        <Modal title={`Manage Lessons - ${targetCourse.title}`} onClose={() => setLessonModal(false)}>
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#0f2144" }}>Current Lessons</h4>
            <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {targetCourse.lessons?.map((l, i) => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", background: "#f8fafc", padding: "8px 12px", borderRadius: "8px", fontSize: "0.85rem" }}>
                  <span>{i + 1}. {l.title}</span>
                  <span style={{ color: "#9ca3af", fontFamily: "monospace" }}>{l.playbackId || "No Playback ID"}</span>
                </div>
              ))}
              {(!targetCourse.lessons || targetCourse.lessons.length === 0) && <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: 0 }}>No lessons uploaded yet.</p>}
            </div>
          </div>
          <form onSubmit={addLesson}>
            <h4 style={{ margin: "0 0 14px 0", color: "#0f2144" }}>Add New Lesson / Video</h4>
            <FormInput label="Lesson Title" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="e.g. Introduction to Calculus" required />
            <FormInput label="Video ID / Playback ID" value={lessonForm.playbackId} onChange={e => setLessonForm({ ...lessonForm, playbackId: e.target.value })} placeholder="e.g. youtube_id or video_hash" required />
            <SubmitBtn loading={lessonSaving} label="Upload Lesson" />
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── Section: Teachers ────────────────────────────────────────────────────────
function TeachersTab() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/admin/users?role=TEACHER", { headers: adminHeaders() });
      setTeachers(data.users || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <h2 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Teacher Accounts ({teachers.length})</h2>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {teachers.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1px solid #f0f0f0", borderRadius: "12px" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#0f2144" }}>{t.profile?.fullName || "Unnamed Teacher"}</div>
                <div style={{ fontSize: "0.82rem", color: "#6b7280" }}>{t.email}</div>
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0ea5e9", background: "#e0f2fe", padding: "3px 10px", borderRadius: "20px" }}>TEACHER</span>
            </div>
          ))}
          {teachers.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>No teacher accounts found.</p>}
        </div>
      )}
    </div>
  );
}

// ─── Section: Earnings ────────────────────────────────────────────────────────
function EarningsTab({ stats }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    client.get("/admin/payments", { headers: adminHeaders() })
      .then(({ data }) => setPayments(data.payments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Earning & Sales History</h2>
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#9ca3af" }}>View real-time premium student subscription payments</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.82rem", color: "#9ca3af", fontWeight: 700 }}>TOTAL REVENUE</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#22c55e" }}>
            ₦{(stats?.totalRevenue || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading payments...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                {["Reference", "Student Name", "Email", "Amount", "Type", "Status", "Date"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px", fontFamily: "monospace", color: "#374151" }}>{p.reference}</td>
                  <td style={{ padding: "12px", fontWeight: 600, color: "#0f2144" }}>{p.user?.profile?.fullName || "—"}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{p.user?.email}</td>
                  <td style={{ padding: "12px", fontWeight: 700, color: "#16a34a" }}>₦{p.amount.toLocaleString()}</td>
                  <td style={{ padding: "12px", color: "#6b7280", textTransform: "capitalize" }}>{p.type.replace("_", " ")}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#16a34a", background: "#f0fdf4", padding: "2px 8px", borderRadius: "20px" }}>{p.status}</span>
                  </td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                    No premium subscription payments recorded yet. Earnings are currently ₦0.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Section: Analytics ───────────────────────────────────────────────────────
function AnalyticsTab({ stats }) {
  const items = [
    { label: "Total Registered Users", value: stats?.totalUsers ?? "—", color: "#6366f1" },
    { label: "Active Teachers",        value: stats?.activeTeachers ?? "—", color: "#0ea5e9" },
    { label: "Premium (Paid) Users",   value: stats?.premiumUsers ?? "—", color: "#d4a853" },
    { label: "Courses Published",      value: stats?.coursesPublished ?? "—", color: "#ec4899" },
    { label: "News Articles",          value: stats?.newsArticles ?? "—", color: "#f97316" },
    { label: "Hall of Fame Entries",   value: stats?.hallOfFameEntries ?? "—", color: "#22c55e" },
    { label: "Total Messages Sent",    value: stats?.totalMessages ?? "—", color: "#8b5cf6" },
  ];
  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <h2 style={{ margin: "0 0 24px 0", fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Platform Analytics</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {items.map(item => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: "12px", background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#374151" }}>{item.label}</span>
            <span style={{ fontSize: "1.4rem", fontWeight: 900, color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin: Question Bank ─────────────────────────────────────────────────────
function QuestionBankTab() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [filterExam, setFilterExam] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ examType: "JAMB", subject: "Mathematics", targetClass: "GENERAL", topic: "", year: "", difficulty: "MEDIUM", questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A", explanation: "" });
  const [saving, setSaving] = useState(false);

  const adminHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken")}` });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (filterSubject !== "ALL") params.set("subject", filterSubject);
      if (filterExam !== "ALL") params.set("examType", filterExam);
      if (search) params.set("search", search);
      const { data } = await client.get(`/cbt/questions?${params}`, { headers: adminHeaders() });
      setQuestions(data.questions || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filterSubject, filterExam, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm({ examType: "JAMB", subject: "Mathematics", targetClass: "GENERAL", topic: "", year: "", difficulty: "MEDIUM", questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A", explanation: "" }); setShowModal(true); };
  const openEdit = (q) => { setEditItem(q); const opts = Array.isArray(q.options) ? q.options : []; setForm({ examType: q.examType, subject: q.subject, targetClass: q.targetClass || "GENERAL", topic: q.topic, year: q.year || "", difficulty: q.difficulty, questionText: q.questionText, optionA: opts[0]?.text || "", optionB: opts[1]?.text || "", optionC: opts[2]?.text || "", optionD: opts[3]?.text || "", correctOption: q.correctOption, explanation: q.explanation || "" }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, year: form.year ? parseInt(form.year) : null, options: [{id:"A",text:form.optionA},{id:"B",text:form.optionB},{id:"C",text:form.optionC},{id:"D",text:form.optionD}] };
    delete payload.optionA; delete payload.optionB; delete payload.optionC; delete payload.optionD;
    try {
      if (editItem) { await client.put(`/cbt/questions/${editItem.id}`, payload, { headers: adminHeaders() }); }
      else { await client.post("/cbt/questions", payload, { headers: adminHeaders() }); }
      setShowModal(false); load();
    } catch (e) { alert("Save failed: " + (e.response?.data?.error || e.message)); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this question permanently?")) return;
    try { await client.delete(`/cbt/questions/${id}`, { headers: adminHeaders() }); load(); }
    catch (e) { alert("Delete failed"); }
  };

  const inputStyle = { width: "100%", padding: "10px 13px", border: "1px solid #e2e8f0", borderRadius: "9px", fontSize: "0.88rem", fontFamily: "inherit", outline: "none", color: "#0f2144", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Question Bank ({questions.length})</h2>
        <button onClick={openAdd} style={{ background: "#0f2144", color: "#d4a853", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Add Question</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." style={{ ...inputStyle, width: 220, flex: "none" }} />
        <select value={filterExam} onChange={e => setFilterExam(e.target.value)} style={{ ...inputStyle, width: 140, flex: "none" }}>
          {["ALL","JAMB","WAEC","NECO","INTERNAL"].map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ ...inputStyle, width: 160, flex: "none" }}>
          {["ALL","Mathematics","English Language","Physics","Chemistry","Biology","Economics","Government","Commerce","Geography","Literature"].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center", padding: 24 }}>Loading questions...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
            <thead><tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              {["Exam","Subject","Topic","Difficulty","Year","Actions"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "0.73rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {questions.map(q => (
                <tr key={q.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "10px 12px" }}><span style={{ background: "#eff6ff", color: "#3b82f6", padding: "2px 8px", borderRadius: 6, fontSize: "0.76rem", fontWeight: 700 }}>{q.examType}</span></td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#0f2144" }}>{q.subject}</td>
                  <td style={{ padding: "10px 12px", color: "#374151", maxWidth: 200 }}>{q.topic}</td>
                  <td style={{ padding: "10px 12px" }}><span style={{ background: q.difficulty==="HARD"?"#fef2f2":q.difficulty==="EASY"?"#f0fdf4":"#fefce8", color: q.difficulty==="HARD"?"#dc2626":q.difficulty==="EASY"?"#16a34a":"#ca8a04", padding: "2px 8px", borderRadius: 6, fontSize: "0.76rem", fontWeight: 700 }}>{q.difficulty}</span></td>
                  <td style={{ padding: "10px 12px", color: "#6b7280" }}>{q.year || "—"}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button onClick={() => openEdit(q)} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", color: "#0284c7", borderRadius: 7, padding: "5px 12px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit", marginRight: 6 }}>Edit</button>
                    <button onClick={() => handleDelete(q.id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 7, padding: "5px 12px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {questions.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>No questions match current filters.</p>}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f2144" }}>{editItem ? "Edit Question" : "Add New Question"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: "1rem" }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Exam Type</label><select value={form.examType} onChange={e => setForm(f=>({...f,examType:e.target.value}))} style={inputStyle}>{["JAMB","WAEC","NECO","INTERNAL"].map(v=><option key={v}>{v}</option>)}</select></div>
                <div><label style={labelStyle}>Subject</label><select value={form.subject} onChange={e => setForm(f=>({...f,subject:e.target.value}))} style={inputStyle}>{["Mathematics","English Language","Physics","Chemistry","Biology","Economics","Government","Commerce","Geography","Literature"].map(v=><option key={v}>{v}</option>)}</select></div>
                <div><label style={labelStyle}>Topic</label><input value={form.topic} onChange={e=>setForm(f=>({...f,topic:e.target.value}))} placeholder="e.g. Quadratic Equations" required style={inputStyle}/></div>
                <div><label style={labelStyle}>Year (Optional)</label><input type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:e.target.value}))} placeholder="e.g. 2023" style={inputStyle}/></div>
                <div><label style={labelStyle}>Difficulty</label><select value={form.difficulty} onChange={e=>setForm(f=>({...f,difficulty:e.target.value}))} style={inputStyle}><option>EASY</option><option>MEDIUM</option><option>HARD</option></select></div>
                <div><label style={labelStyle}>Target Class</label><input value={form.targetClass} onChange={e=>setForm(f=>({...f,targetClass:e.target.value}))} placeholder="GENERAL / SSS 3" style={inputStyle}/></div>
              </div>
              <div style={{ marginTop: 12 }}><label style={labelStyle}>Question Text</label><textarea value={form.questionText} onChange={e=>setForm(f=>({...f,questionText:e.target.value}))} required rows={3} style={{...inputStyle,resize:"vertical"}}/></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                <div><label style={labelStyle}>Option A</label><input value={form.optionA} onChange={e=>setForm(f=>({...f,optionA:e.target.value}))} required style={inputStyle}/></div>
                <div><label style={labelStyle}>Option B</label><input value={form.optionB} onChange={e=>setForm(f=>({...f,optionB:e.target.value}))} required style={inputStyle}/></div>
                <div><label style={labelStyle}>Option C</label><input value={form.optionC} onChange={e=>setForm(f=>({...f,optionC:e.target.value}))} required style={inputStyle}/></div>
                <div><label style={labelStyle}>Option D</label><input value={form.optionD} onChange={e=>setForm(f=>({...f,optionD:e.target.value}))} required style={inputStyle}/></div>
              </div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>Correct Answer</label><select value={form.correctOption} onChange={e=>setForm(f=>({...f,correctOption:e.target.value}))} style={inputStyle}><option>A</option><option>B</option><option>C</option><option>D</option></select></div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>Explanation (Worked Solution)</label><textarea value={form.explanation} onChange={e=>setForm(f=>({...f,explanation:e.target.value}))} rows={3} placeholder="Explain the correct answer step-by-step..." style={{...inputStyle,resize:"vertical"}}/></div>
              <button type="submit" disabled={saving} style={{ marginTop: 20, width: "100%", padding: 13, background: saving?"#9ca3af":"#0f2144", color: "#d4a853", border: "none", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", cursor: saving?"not-allowed":"pointer", fontFamily: "inherit" }}>{saving?"Saving...":editItem?"Save Changes":"Add Question"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin: TIPS Manager ──────────────────────────────────────────────────────
function TipsManagerTab() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", subject: "Mathematics", category: "", keyIdea: "", explanation: "", example: "", memoryTrick: "", formulaOrRule: "", commonMistake: "" });
  const [saving, setSaving] = useState(false);

  const adminHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken")}` });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (filterSubject !== "ALL") params.set("subject", filterSubject);
      if (search) params.set("search", search);
      const { data } = await client.get(`/tips?${params}`, { headers: adminHeaders() });
      setTips(data.tips || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filterSubject, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm({ title: "", subject: "Mathematics", category: "", keyIdea: "", explanation: "", example: "", memoryTrick: "", formulaOrRule: "", commonMistake: "" }); setShowModal(true); };
  const openEdit = (t) => { setEditItem(t); setForm({ title: t.title, subject: t.subject, category: t.category, keyIdea: t.keyIdea, explanation: t.explanation, example: t.example || "", memoryTrick: t.memoryTrick || "", formulaOrRule: t.formulaOrRule || "", commonMistake: t.commonMistake || "" }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) { await client.put(`/tips/${editItem.id}`, form, { headers: adminHeaders() }); }
      else { await client.post("/tips", form, { headers: adminHeaders() }); }
      setShowModal(false); load();
    } catch (e) { alert("Save failed: " + (e.response?.data?.error || e.message)); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this TIPS card permanently?")) return;
    try { await client.delete(`/tips/${id}`, { headers: adminHeaders() }); load(); }
    catch (e) { alert("Delete failed"); }
  };

  const inputStyle = { width: "100%", padding: "10px 13px", border: "1px solid #e2e8f0", borderRadius: "9px", fontSize: "0.88rem", fontFamily: "inherit", outline: "none", color: "#0f2144", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>TIPS Learning Cards ({tips.length})</h2>
        <button onClick={openAdd} style={{ background: "#0f2144", color: "#d4a853", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Add TIPS Card</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search TIPS..." style={{ ...inputStyle, width: 220, flex: "none" }} />
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ ...inputStyle, width: 180, flex: "none" }}>
          {["ALL","Mathematics","English Language","Physics","Chemistry","Biology","Economics","General"].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center", padding: 24 }}>Loading TIPS cards...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {tips.map(tip => (
            <div key={tip.id} style={{ background: "#f8fafc", borderRadius: 14, padding: "18px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ background: "#eff6ff", color: "#3b82f6", padding: "2px 8px", borderRadius: 6, fontSize: "0.74rem", fontWeight: 700, marginRight: 6 }}>{tip.subject}</span>
                  <span style={{ background: "#f0fdf4", color: "#16a34a", padding: "2px 8px", borderRadius: 6, fontSize: "0.74rem", fontWeight: 700 }}>{tip.category}</span>
                </div>
              </div>
              <h4 style={{ margin: "0 0 6px", color: "#0f2144", fontSize: "0.95rem", fontWeight: 800 }}>{tip.title}</h4>
              <p style={{ margin: "0 0 12px", color: "#6b7280", fontSize: "0.82rem", lineHeight: 1.5 }}>{tip.keyIdea}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEdit(tip)} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", color: "#0284c7", borderRadius: 7, padding: "5px 12px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                <button onClick={() => handleDelete(tip.id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 7, padding: "5px 12px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
              </div>
            </div>
          ))}
          {tips.length === 0 && <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#9ca3af", padding: 24 }}>No TIPS cards found.</p>}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f2144" }}>{editItem ? "Edit TIPS Card" : "Add New TIPS Card"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: "1rem" }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ gridColumn: "1/-1" }}><label style={labelStyle}>Title</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Solving Quadratic Equations" required style={inputStyle}/></div>
                <div><label style={labelStyle}>Subject</label><select value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} style={inputStyle}>{["Mathematics","English Language","Physics","Chemistry","Biology","Economics","General"].map(v=><option key={v}>{v}</option>)}</select></div>
                <div><label style={labelStyle}>Category</label><input value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} placeholder="e.g. Algebra, Grammar, Mechanics" required style={inputStyle}/></div>
              </div>
              <div style={{ marginTop: 12 }}><label style={labelStyle}>Key Idea (Summary)</label><textarea value={form.keyIdea} onChange={e=>setForm(f=>({...f,keyIdea:e.target.value}))} required rows={2} style={{...inputStyle,resize:"vertical"}}/></div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>Full Explanation</label><textarea value={form.explanation} onChange={e=>setForm(f=>({...f,explanation:e.target.value}))} required rows={3} style={{...inputStyle,resize:"vertical"}}/></div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>Example</label><textarea value={form.example} onChange={e=>setForm(f=>({...f,example:e.target.value}))} rows={2} placeholder="Worked example..." style={{...inputStyle,resize:"vertical"}}/></div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>Memory Trick / Mnemonic</label><input value={form.memoryTrick} onChange={e=>setForm(f=>({...f,memoryTrick:e.target.value}))} placeholder="e.g. BODMAS, SOHCAHTOA..." style={inputStyle}/></div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>Formula or Rule</label><input value={form.formulaOrRule} onChange={e=>setForm(f=>({...f,formulaOrRule:e.target.value}))} placeholder="e.g. a² + b² = c²" style={inputStyle}/></div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>Common Mistake to Avoid</label><textarea value={form.commonMistake} onChange={e=>setForm(f=>({...f,commonMistake:e.target.value}))} rows={2} placeholder="What students often get wrong..." style={{...inputStyle,resize:"vertical"}}/></div>
              <button type="submit" disabled={saving} style={{ marginTop: 20, width: "100%", padding: 13, background: saving?"#9ca3af":"#0f2144", color: "#d4a853", border: "none", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", cursor: saving?"not-allowed":"pointer", fontFamily: "inherit" }}>{saving?"Saving...":editItem?"Save Changes":"Add TIPS Card"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin: Resources Manager ─────────────────────────────────────────────────
function ResourcesManagerTab() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", subject: "Mathematics", targetClass: "", resourceType: "NOTE", description: "", fileUrl: "" });
  const [saving, setSaving] = useState(false);

  const adminHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken")}` });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (filterSubject !== "ALL") params.set("subject", filterSubject);
      if (filterType !== "ALL") params.set("resourceType", filterType);
      if (search) params.set("search", search);
      const { data } = await client.get(`/resources?${params}`, { headers: adminHeaders() });
      setResources(data.resources || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filterSubject, filterType, search]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditItem(null); setForm({ title: "", subject: "Mathematics", targetClass: "", resourceType: "NOTE", description: "", fileUrl: "" }); setShowModal(true); };
  const openEdit = (r) => { setEditItem(r); setForm({ title: r.title, subject: r.subject, targetClass: r.targetClass || "", resourceType: r.resourceType, description: r.description || "", fileUrl: r.fileUrl }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) { await client.put(`/resources/${editItem.id}`, form, { headers: adminHeaders() }); }
      else { await client.post("/resources", form, { headers: adminHeaders() }); }
      setShowModal(false); load();
    } catch (e) { alert("Save failed: " + (e.response?.data?.error || e.message)); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this resource permanently?")) return;
    try { await client.delete(`/resources/${id}`, { headers: adminHeaders() }); load(); }
    catch (e) { alert("Delete failed"); }
  };

  const inputStyle = { width: "100%", padding: "10px 13px", border: "1px solid #e2e8f0", borderRadius: "9px", fontSize: "0.88rem", fontFamily: "inherit", outline: "none", color: "#0f2144", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" };
  const typeColor = { NOTE: "#6366f1", PDF: "#0ea5e9", WORKSHEET: "#f97316", REVISION: "#22c55e", GUIDE: "#d4a853", TIPS: "#ec4899" };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Resource Library ({resources.length})</h2>
        <button onClick={openAdd} style={{ background: "#0f2144", color: "#d4a853", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Add Resource</button>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources..." style={{ ...inputStyle, width: 200, flex: "none" }} />
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ ...inputStyle, width: 160, flex: "none" }}>
          {["ALL","Mathematics","English Language","Physics","Chemistry","Biology","Economics","General"].map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...inputStyle, width: 140, flex: "none" }}>
          {["ALL","NOTE","PDF","WORKSHEET","REVISION","GUIDE","TIPS"].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center", padding: 24 }}>Loading resources...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
            <thead><tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              {["Type","Title","Subject","Class","Downloads","Actions"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "0.73rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "10px 12px" }}><span style={{ background: `${typeColor[r.resourceType]||"#6b7280"}18`, color: typeColor[r.resourceType]||"#6b7280", padding: "2px 8px", borderRadius: 6, fontSize: "0.76rem", fontWeight: 700 }}>{r.resourceType}</span></td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "#0f2144", maxWidth: 200 }}>{r.title}</td>
                  <td style={{ padding: "10px 12px", color: "#374151" }}>{r.subject}</td>
                  <td style={{ padding: "10px 12px", color: "#6b7280" }}>{r.targetClass || "All"}</td>
                  <td style={{ padding: "10px 12px", color: "#6b7280" }}>{r.downloadsCount || 0}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button onClick={() => openEdit(r)} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", color: "#0284c7", borderRadius: 7, padding: "5px 12px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit", marginRight: 6 }}>Edit</button>
                    <button onClick={() => handleDelete(r.id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 7, padding: "5px 12px", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {resources.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>No resources found.</p>}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f2144" }}>{editItem ? "Edit Resource" : "Add New Resource"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: "1rem" }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: 12 }}><label style={labelStyle}>Title</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Mathematics Formulae Sheet" required style={inputStyle}/></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>Subject</label><select value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} style={inputStyle}>{["Mathematics","English Language","Physics","Chemistry","Biology","Economics","General"].map(v=><option key={v}>{v}</option>)}</select></div>
                <div><label style={labelStyle}>Resource Type</label><select value={form.resourceType} onChange={e=>setForm(f=>({...f,resourceType:e.target.value}))} style={inputStyle}><option>NOTE</option><option>PDF</option><option>WORKSHEET</option><option>REVISION</option><option>GUIDE</option><option>TIPS</option></select></div>
                <div><label style={labelStyle}>Target Class</label><input value={form.targetClass} onChange={e=>setForm(f=>({...f,targetClass:e.target.value}))} placeholder="e.g. SSS 3, JAMB/WAEC" style={inputStyle}/></div>
              </div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} placeholder="Brief description of this resource..." style={{...inputStyle,resize:"vertical"}}/></div>
              <div style={{ marginTop: 10 }}><label style={labelStyle}>File URL / Download Link</label><input value={form.fileUrl} onChange={e=>setForm(f=>({...f,fileUrl:e.target.value}))} placeholder="https://drive.google.com/file/..." required style={inputStyle}/></div>
              <button type="submit" disabled={saving} style={{ marginTop: 20, width: "100%", padding: 13, background: saving?"#9ca3af":"#0f2144", color: "#d4a853", border: "none", borderRadius: 12, fontWeight: 700, fontSize: "0.95rem", cursor: saving?"not-allowed":"pointer", fontFamily: "inherit" }}>{saving?"Saving...":editItem?"Save Changes":"Add Resource"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await client.get("/admin/stats");
      setStats(data);
    } catch (e) {}
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/admin-login"); return; }
    fetchStats();
  }, [navigate, fetchStats, activeTab]); // Reload stats when changing tabs

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const toggleCategory = (cat) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Filter navigation items if searching
  const filteredNavGroups = useMemo(() => {
    if (!searchQuery.trim()) return NAV_GROUPS;
    const q = searchQuery.toLowerCase();
    return NAV_GROUPS.map(group => ({
      ...group,
      items: group.items.filter(it => it.label.toLowerCase().includes(q) || it.id.toLowerCase().includes(q))
    })).filter(group => group.items.length > 0);
  }, [searchQuery]);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":   return <DashboardTab stats={stats} onNav={setActiveTab} />;
      case "Users":        return <UsersTab />;
      case "Groups":       return <GroupsTab />;
      case "Teachers":     return <TeachersTab />;
      case "Courses":      return <CoursesTab />;
      case "QuestionBank": return <QuestionBankTab />;
      case "TipsManager":  return <TipsManagerTab />;
      case "Resources":    return <ResourcesManagerTab />;
      case "News":         return <NewsTab />;
      case "Fame":         return <FameTab />;
      case "Earnings":     return <EarningsTab stats={stats} />;
      case "Analytics":    return <AnalyticsTab stats={stats} />;
      case "Settings":     return <HomepageSettings />;
      case "Moderation": return (
        <div style={{ background: "#ffffff", borderRadius: "24px", padding: "48px 32px", textAlign: "center", boxShadow: "0 4px 20px rgba(16,28,68,0.04)", border: "1px solid rgba(16,28,68,0.06)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "24px", background: "#fef3c7", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
            <Icon path={ICONS.shield} size={36} color="#dfa921" />
          </div>
          <h2 style={{ color: "var(--navy, #101c44)", margin: "0 0 8px", fontSize: "1.3rem", fontWeight: 800 }}>Exam Moderation & Security</h2>
          <p style={{ color: "#94a3b8", maxWidth: "420px", margin: "0 auto", fontSize: "0.9rem" }}>
            Automated proctoring logs, flagged questions, and content moderation tools are active in monitor mode.
          </p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .admin-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        .nav-item-btn:hover { background: #f8fafc !important; color: #101c44 !important; }
        .nav-item-active { background: #f5f3ff !important; color: #6b21a8 !important; border-left: 4px solid #6b21a8 !important; font-weight: 800 !important; }
        .header-icon-btn:hover { background: #f1f4fa !important; transform: translateY(-1px); }
      `}</style>
      <div className="admin-root" style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb" }}>

        {/* ── SIDEBAR (School Management Dashboard Style) ─────────────── */}
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
                  St. Lawrence
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
                  {/* Category Header */}
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

                  {/* Category Items */}
                  {!isCollapsed && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                      {group.items.map((item) => {
                        const active = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            className={`nav-item-btn ${active ? "nav-item-active" : ""}`}
                            onClick={() => setActiveTab(item.id)}
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

          {/* Sidebar Footer / Logout */}
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

        {/* ── MAIN CONTENT CONTAINER ────────────────────────────────── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          
          {/* Top Header matching the mockup with Search & Profile Pill */}
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
            {/* Left: Sidebar Toggle + Search Bar */}
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
                  flexShrink: 0,
                  transition: "background 0.15s ease"
                }}
                title="Toggle Sidebar"
              >
                <Icon path={ICONS.menu} size={18} color="#64748b" stroke={2} />
              </button>

              {/* Quick Search Input */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#f4f6fb",
                padding: "8px 16px",
                borderRadius: "14px",
                flex: 1,
                border: "1px solid transparent",
                transition: "border-color 0.2s ease"
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
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <Icon path={ICONS.x} size={14} color="#94a3b8" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Notification Icons + Admin Profile Pill */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {/* Bell Notification Button */}
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
                  position: "relative",
                  transition: "all 0.15s ease"
                }}
                title="Notifications"
                onClick={() => setActiveTab("News")}
              >
                <Icon path={ICONS.bell} size={18} color="#64748b" />
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

              {/* Message Icon Button */}
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
                  transition: "all 0.15s ease"
                }}
                title="Messages"
                onClick={() => setActiveTab("Groups")}
              >
                <Icon path={ICONS.message} size={18} color="#64748b" />
              </button>

              {/* Admin Profile Pill */}
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
                    background: "linear-gradient(135deg, var(--navy, #101c44) 0%, #25408f 100%)",
                    color: "var(--gold, #dfa921)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "0.85rem",
                    flexShrink: 0
                  }}>
                    A
                  </div>
                  <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--navy, #101c44)" }}>
                      Priscilla Lily
                    </div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#94a3b8" }}>
                      Admin
                    </div>
                  </div>
                  <Icon path={ICONS.chevronDown} size={14} color="#94a3b8" />
                </div>

                {/* Profile Dropdown Menu */}
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
                      onClick={() => { setActiveTab("Settings"); setProfileMenuOpen(false); }}
                      style={{ background: "transparent", border: "none", padding: "8px 12px", borderRadius: "8px", textAlign: "left", fontSize: "0.82rem", fontWeight: 600, color: "var(--navy, #101c44)", cursor: "pointer" }}
                      className="nav-item-btn"
                    >
                      ⚙️ Site Settings
                    </button>
                    <button
                      onClick={() => { setActiveTab("Users"); setProfileMenuOpen(false); }}
                      style={{ background: "transparent", border: "none", padding: "8px 12px", borderRadius: "8px", textAlign: "left", fontSize: "0.82rem", fontWeight: 600, color: "var(--navy, #101c44)", cursor: "pointer" }}
                      className="nav-item-btn"
                    >
                      👥 User Roster
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

          {/* Tab Content Canvas with Soft Slate Canvas Background */}
          <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}

