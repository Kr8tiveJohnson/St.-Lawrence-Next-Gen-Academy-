import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

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
};

const NAV = [
  { id: "Dashboard",  label: "Dashboard",         icon: "dashboard" },
  { id: "Users",      label: "Users",              icon: "users"     },
  { id: "Teachers",   label: "Teacher Approvals",  icon: "teachers"  },
  { id: "Courses",    label: "Courses & Lessons",  icon: "courses"   },
  { id: "News",       label: "News Management",    icon: "news"      },
  { id: "Fame",       label: "Hall of Fame",       icon: "fame"      },
  { id: "Analytics",  label: "Analytics",          icon: "analytics" },
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
      <div style={{ background: "#fff", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "540px", boxShadow: "0 25px 60px rgba(0,0,0,0.25)" }}>
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
              { label: "View Analytics",         tab: "Analytics",color: "#22c55e" },
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
  const [form, setForm] = useState({ title: "", tag: "general", summary: "", details: "" });
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

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await client.post("/news", form, { headers: adminHeaders() });
      setModal(false);
      setForm({ title: "", tag: "general", summary: "", details: "" });
      load();
    } catch (e) { alert(e.response?.data?.error || "Failed to create article"); }
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
        <button onClick={() => setModal(true)} style={{ background: "#0f2144", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Add Article</button>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {news.filter(n => n.tag !== "hall-of-fame").map(n => (
            <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1px solid #f0f0f0", borderRadius: "12px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: tagColor[n.tag] || "#6366f1", background: `${tagColor[n.tag] || "#6366f1"}15`, padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase" }}>{n.tag}</span>
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <div style={{ fontWeight: 700, color: "#0f2144", fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                <div style={{ fontSize: "0.82rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.summary}</div>
              </div>
              <button onClick={() => del(n.id)} style={{ marginLeft: "16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "7px 12px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", flexShrink: 0 }}>Delete</button>
            </div>
          ))}
          {news.filter(n => n.tag !== "hall-of-fame").length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>No articles yet.</p>}
        </div>
      )}
      {modal && (
        <Modal title="Add News Article" onClose={() => setModal(false)}>
          <form onSubmit={submit}>
            <FormInput label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Article title" required />
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tag</label>
              <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.9rem", fontFamily: "inherit", color: "#0f2144" }}>
                {["general", "exam", "update", "event"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <FormInput label="Summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Short summary" required />
            <FormInput as="textarea" label="Full Details" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Full article content..." required />
            <SubmitBtn loading={saving} label="Publish Article" />
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
  const [form, setForm] = useState({ title: "", summary: "", details: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/news/hall-of-fame/entries");
      setEntries(data.entries || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await client.post("/news/hall-of-fame/add", form, { headers: adminHeaders() });
      setModal(false);
      setForm({ title: "", summary: "", details: "" });
      load();
    } catch (e) { alert(e.response?.data?.error || "Failed to add entry"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Remove this Hall of Fame entry?")) return;
    try { await client.delete(`/news/${id}`, { headers: adminHeaders() }); load(); } catch (e) { alert("Failed to delete"); }
  };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Hall of Fame ({entries.length})</h2>
        <button onClick={() => setModal(true)} style={{ background: "#d4a853", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Add Entry</button>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {entries.map(e => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", border: "1px solid #fef9c3", borderRadius: "12px", background: "#fffbeb" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#92400e", marginBottom: "2px" }}>{e.title}</div>
                <div style={{ fontSize: "0.82rem", color: "#a16207" }}>{e.summary}</div>
              </div>
              <button onClick={() => del(e.id)} style={{ marginLeft: "16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "7px 12px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Remove</button>
            </div>
          ))}
          {entries.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>No Hall of Fame entries yet.</p>}
        </div>
      )}
      {modal && (
        <Modal title="Add Hall of Fame Entry" onClose={() => setModal(false)}>
          <form onSubmit={submit}>
            <FormInput label="Name / Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. John Doe — WAEC Top Score 2025" required />
            <FormInput label="Achievement Summary" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} placeholder="Brief description of the achievement" required />
            <FormInput as="textarea" label="Full Story" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Full details about this achievement..." />
            <SubmitBtn loading={saving} label="Add to Hall of Fame" />
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
  const [form, setForm] = useState({ title: "", category: "", subject: "", isPaid: false });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/classrooms");
      setCourses(data.courses || data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await client.post("/classrooms", { ...form, isPaid: form.isPaid === "true" || form.isPaid === true }, { headers: adminHeaders() });
      setModal(false);
      setForm({ title: "", category: "", subject: "", isPaid: false });
      load();
    } catch (err) { alert(err.response?.data?.error || "Failed to create course"); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("Delete this course? All lessons will also be removed.")) return;
    try { await client.delete(`/classrooms/${id}`, { headers: adminHeaders() }); load(); } catch (e) { alert("Failed to delete"); }
  };

  return (
    <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f2144" }}>Courses ({courses.length})</h2>
        <button onClick={() => setModal(true)} style={{ background: "#ec4899", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit" }}>+ Create Course</button>
      </div>
      {loading ? <p style={{ color: "#9ca3af", textAlign: "center" }}>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
          {Array.isArray(courses) && courses.map(c => (
            <div key={c.id} style={{ padding: "16px", border: "1px solid #f0f0f0", borderRadius: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ fontWeight: 700, color: "#0f2144", fontSize: "0.95rem", flex: 1 }}>{c.title}</div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: c.isPaid ? "#d4a853" : "#22c55e", background: c.isPaid ? "#fffbeb" : "#f0fdf4", padding: "2px 8px", borderRadius: "20px", marginLeft: "8px" }}>{c.isPaid ? "PAID" : "FREE"}</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "12px" }}>{c.category} &bull; {c.subject}</div>
              <button onClick={() => del(c.id)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "5px 12px", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>Delete</button>
            </div>
          ))}
          {courses.length === 0 && <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px", gridColumn: "1/-1" }}>No courses yet.</p>}
        </div>
      )}
      {modal && (
        <Modal title="Create Course" onClose={() => setModal(false)}>
          <form onSubmit={submit}>
            <FormInput label="Course Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. WAEC Mathematics 2025" required />
            <FormInput label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. WAEC, JAMB, NECO" required />
            <FormInput label="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics, English" required />
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Access Type</label>
              <select value={form.isPaid} onChange={e => setForm({ ...form, isPaid: e.target.value })} style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.9rem", fontFamily: "inherit", color: "#0f2144" }}>
                <option value={false}>Free</option>
                <option value={true}>Paid (Premium)</option>
              </select>
            </div>
            <SubmitBtn loading={saving} label="Create Course" />
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

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/admin-login"); return; }
    client.get("/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, [navigate]);

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
      case "Analytics":  return <AnalyticsTab stats={stats} />;
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
