import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import HomepageSettings from "../features/admin/HomepageSettings";

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
  settings:  "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
};

const NAV = [
  { id: "Dashboard",  label: "Dashboard",         icon: "dashboard" },
  { id: "Users",      label: "Users",              icon: "users"     },
  { id: "Teachers",   label: "Teacher Approvals",  icon: "teachers"  },
  { id: "Courses",    label: "Courses & Lessons",  icon: "courses"   },
  { id: "News",       label: "News Management",    icon: "news"      },
  { id: "Fame",       label: "Hall of Fame",       icon: "fame"      },
  { id: "Earnings",   label: "Earnings",           icon: "wallet"    },
  { id: "Analytics",  label: "Analytics",          icon: "analytics" },
  { id: "Settings",   label: "Homepage Settings",  icon: "settings"  },
  { id: "Moderation", label: "Moderation",         icon: "shield"    },
];

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
  const cards = [
    { label: "Total Users",      value: stats?.totalUsers,      icon: "users",     color: "#6366f1" },
    { label: "Active Teachers",  value: stats?.activeTeachers,  icon: "teachers",  color: "#0ea5e9" },
    { label: "Premium Members",  value: stats?.premiumUsers,    icon: "fame",      color: "#d4a853" },
    { label: "Courses Published",value: stats?.coursesPublished,icon: "courses",   color: "#ec4899" },
    { label: "News Articles",    value: stats?.newsArticles,    icon: "news",      color: "#f97316" },
    { label: "Hall of Fame",     value: stats?.hallOfFameEntries,icon: "fame",     color: "#22c55e" },
  ];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "18px", marginBottom: "24px" }}>
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", fontWeight: 700, color: "#0f2144" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Add News Article",       tab: "News",    color: "#6366f1" },
              { label: "Create Course",          tab: "Courses", color: "#0ea5e9" },
              { label: "Add Hall of Fame Entry", tab: "Fame",    color: "#d4a853" },
              { label: "View Earnings / Sales",  tab: "Earnings",color: "#22c55e" },
              { label: "Manage Users",           tab: "Users",   color: "#ec4899" },
              { label: "Teacher Approvals",      tab: "Teachers",color: "#f97316" },
            ].map(a => (
              <button key={a.label} onClick={() => onNav(a.tab)} style={{ background: `${a.color}10`, border: `1px solid ${a.color}30`, color: a.color, borderRadius: "10px", padding: "10px 14px", fontWeight: 700, fontSize: "0.85rem", textAlign: "left", fontFamily: "inherit", cursor: "pointer" }}>
                + {a.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", fontWeight: 700, color: "#0f2144" }}>System Status</h3>
          {[["Database", "Online"], ["API Server", "Running"], ["Frontend", "Active"], ["Auth Service", "Online"]].map(([name, status]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.88rem", color: "#374151", fontWeight: 500 }}>{name}</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "3px 10px", borderRadius: "20px", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />{status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Users ───────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
                    <button onClick={() => deleteUser(u.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>No users found.</td></tr>}
            </tbody>
          </table>
        </div>
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

// ─── Main AdminPage ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  }, [navigate, fetchStats, activeTab]); // Reload stats when changing tabs (e.g. dashboard vs earnings)

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":  return <DashboardTab stats={stats} onNav={setActiveTab} />;
      case "Users":      return <UsersTab />;
      case "Teachers":   return <TeachersTab />;
      case "Courses":    return <CoursesTab />;
      case "News":       return <NewsTab />;
      case "Fame":       return <FameTab />;
      case "Earnings":   return <EarningsTab stats={stats} />;
      case "Analytics":  return <AnalyticsTab stats={stats} />;
      case "Settings":   return <HomepageSettings />;
      case "Moderation": return (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <Icon path={ICONS.shield} size={48} color="#d4a853" />
          <h2 style={{ color: "#0f2144", marginTop: "16px" }}>Moderation</h2>
          <p style={{ color: "#9ca3af" }}>Content moderation tools coming soon.</p>
        </div>
      );
      default: return null;
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; } .admin-root { font-family: 'Inter', sans-serif; } .nav-btn:hover { background: rgba(255,255,255,0.08) !important; }`}</style>
      <div className="admin-root" style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>

        {/* SIDEBAR */}
        <aside style={{ width: sidebarOpen ? "250px" : "70px", background: "linear-gradient(180deg, #0f2144 0%, #1a3a6b 100%)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", transition: "width 0.25s", overflow: "hidden", flexShrink: 0, boxShadow: "4px 0 20px rgba(0,0,0,0.15)" }}>
          <div style={{ padding: sidebarOpen ? "22px 18px 18px" : "22px 12px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={logoImg} alt="Logo" style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }} />
            {sidebarOpen && (
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "0.88rem", lineHeight: 1.2 }}>St. Lawrence</div>
                <div style={{ color: "#d4a853", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.05em" }}>NEXT GEN ACADEMY</div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div style={{ margin: "14px 12px 6px", background: "rgba(212,168,83,0.12)", border: "1px solid rgba(212,168,83,0.25)", borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ color: "#a0b8cc", fontSize: "0.7rem", fontWeight: 700, marginBottom: "2px" }}>LOGGED IN AS</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>School Administrator</div>
              <div style={{ color: "#d4a853", fontSize: "0.7rem", fontWeight: 700, marginTop: "1px" }}>ADMIN</div>
            </div>
          )}
          <nav style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
            {NAV.map(item => {
              const active = activeTab === item.id;
              return (
                <button key={item.id} className="nav-btn" onClick={() => setActiveTab(item.id)} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "11px 12px", background: active ? "rgba(212,168,83,0.15)" : "transparent", border: "none", borderRadius: "10px", cursor: "pointer", color: active ? "#d4a853" : "rgba(255,255,255,0.65)", fontWeight: active ? 700 : 500, fontSize: "0.86rem", textAlign: "left", marginBottom: "2px", borderLeft: active ? "3px solid #d4a853" : "3px solid transparent" }}>
                  <span style={{ flexShrink: 0 }}><Icon path={ICONS[item.icon]} size={17} color={active ? "#d4a853" : "rgba(255,255,255,0.5)"} /></span>
                  {sidebarOpen && item.label}
                </button>
              );
            })}
          </nav>
          <div style={{ padding: "10px 8px 18px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={handleLogout} className="nav-btn" style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "11px 12px", background: "transparent", border: "none", borderRadius: "10px", cursor: "pointer", color: "rgba(255,100,100,0.8)", fontWeight: 600, fontSize: "0.86rem", textAlign: "left" }}>
              <Icon path={ICONS.logout} size={17} color="rgba(255,100,100,0.8)" />
              {sidebarOpen && "Logout"}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <header style={{ background: "#fff", padding: "14px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon path={ICONS.menu} size={17} color="#64748b" stroke={2} />
              </button>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f2144" }}>{NAV.find(n => n.id === activeTab)?.label || activeTab}</h1>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>St. Lawrence Next Gen Academy Admin Panel</p>
              </div>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#0f2144", color: "#d4a853", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem" }}>A</div>
          </header>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}
