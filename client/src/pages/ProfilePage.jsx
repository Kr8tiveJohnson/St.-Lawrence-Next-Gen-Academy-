import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : (parts[0]?.[0] || "S").toUpperCase();
}

function Avatar({ name = "", size = 40, style = {} }) {
  const initials = getInitials(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "var(--navy)", color: "var(--gold)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.35, flexShrink: 0, ...style
    }}>
      {initials || "?"}
    </div>
  );
}

function Toast({ msg, type = "success" }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: type === "success" ? "#10b981" : "#ef4444",
      color: "#fff", padding: "12px 22px", borderRadius: "12px",
      fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      animation: "fadeIn 0.3s ease"
    }}>
      {type === "success" ? "✅" : "❌"} {msg}
    </div>
  );
}

// ─── Sub-tabs for Friends ─────────────────────────────────────────────────────
function FriendsTab({ currentUserId }) {
  const [subTab, setSubTab] = useState("friends"); // friends | requests | find
  const [friends, setFriends]     = useState([]);
  const [requests, setRequests]   = useState([]);
  const [search, setSearch]       = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadFriends = useCallback(async () => {
    try {
      const [fr, req] = await Promise.all([
        client.get("/friends"),
        client.get("/friends/requests/pending"),
      ]);
      setFriends(fr.data.friends || []);
      setRequests(req.data.requests || []);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadFriends(); }, [loadFriends]);

  const searchUsers = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      // search by username/name via GET /users (adapt to your API)
      // Using the friend-request endpoint with receiverId as a proxy is not ideal;
      // Here we do a basic GET /users/search?q=... — if not available, we show message
      const res = await client.get(`/users/search?q=${encodeURIComponent(search)}`);
      setSearchResults(res.data.users || []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const sendRequest = async (receiverId) => {
    try {
      await client.post("/friends/request", { receiverId });
      notify("Friend request sent!");
      setSearchResults(prev => prev.filter(u => u.id !== receiverId));
    } catch (e) {
      notify(e?.response?.data?.error || "Could not send request", "error");
    }
  };

  const acceptRequest = async (id) => {
    try {
      await client.put(`/friends/${id}/accept`);
      notify("Friend request accepted! 🎉");
      loadFriends();
    } catch {
      notify("Failed to accept request", "error");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await client.put(`/friends/${id}/reject`);
      notify("Request declined.");
      loadFriends();
    } catch {
      notify("Failed to decline request", "error");
    }
  };

  const subTabStyle = (active) => ({
    padding: "7px 18px", border: "none", borderRadius: "8px",
    fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit",
    background: active ? "var(--navy)" : "transparent",
    color: active ? "#fff" : "var(--text-3)", transition: "all 0.15s"
  });

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
          🤝 Friends
        </h3>
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", padding: 4, borderRadius: 10 }}>
          <button style={subTabStyle(subTab === "friends")} onClick={() => setSubTab("friends")}>My Friends {friends.length > 0 && `(${friends.length})`}</button>
          <button style={subTabStyle(subTab === "requests")} onClick={() => setSubTab("requests")}>Requests {requests.length > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: "50%", padding: "1px 6px", marginLeft: 4, fontSize: "0.75rem" }}>{requests.length}</span>}</button>
          <button style={subTabStyle(subTab === "find")} onClick={() => setSubTab("find")}>Find People</button>
        </div>
      </div>

      {/* MY FRIENDS */}
      {subTab === "friends" && (
        loading ? <div style={{ textAlign: "center", color: "var(--text-3)", padding: 40 }}>Loading...</div>
        : friends.length === 0
          ? (
            <div className="dash-card" style={{ textAlign: "center", padding: "40px 30px", color: "var(--text-3)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 10 }}>👥</div>
              <p style={{ fontWeight: 600, margin: 0 }}>You haven't connected with anyone yet.</p>
              <button onClick={() => setSubTab("find")} style={{ marginTop: 16, padding: "10px 20px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
                Find People
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {friends.map(f => (
                <div key={f.id} className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                  <Avatar name={f.profile?.fullName || f.username || "?"} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {f.profile?.fullName || f.username}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>{f.role}</div>
                  </div>
                  <Link to="/chat" style={{ padding: "6px 12px", background: "rgba(15,33,68,0.07)", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}>
                    💬 Chat
                  </Link>
                </div>
              ))}
            </div>
          )
      )}

      {/* PENDING REQUESTS */}
      {subTab === "requests" && (
        requests.length === 0
          ? (
            <div className="dash-card" style={{ textAlign: "center", padding: "40px 30px", color: "var(--text-3)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 10 }}>📭</div>
              <p style={{ fontWeight: 600, margin: 0 }}>No pending friend requests.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {requests.map(req => (
                <div key={req.id} className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                  <Avatar name={req.requester?.profile?.fullName || req.requester?.username || "?"} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--navy)" }}>
                      {req.requester?.profile?.fullName || req.requester?.username}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>Sent you a friend request</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => acceptRequest(req.id)} style={{ padding: "7px 14px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>
                      Accept
                    </button>
                    <button onClick={() => rejectRequest(req.id)} style={{ padding: "7px 14px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
      )}

      {/* FIND PEOPLE */}
      {subTab === "find" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchUsers()}
              placeholder="Search by name or username..."
              style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", fontFamily: "inherit", outline: "none" }}
            />
            <button onClick={searchUsers} disabled={searching} style={{ padding: "12px 20px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
              {searching ? "..." : "Search"}
            </button>
          </div>
          {searchResults.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {searchResults.map(u => (
                <div key={u.id} className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}>
                  <Avatar name={u.profile?.fullName || u.username || "?"} size={42} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--navy)" }}>{u.profile?.fullName || u.username}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>{u.role}</div>
                  </div>
                  <button onClick={() => sendRequest(u.id)} style={{ padding: "7px 16px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, cursor: "pointer", fontSize: "0.83rem" }}>
                    + Add Friend
                  </button>
                </div>
              ))}
            </div>
          ) : search && !searching ? (
            <div className="dash-card" style={{ textAlign: "center", padding: "30px", color: "var(--text-3)" }}>
              <p style={{ margin: 0 }}>No users found for "<strong>{search}</strong>"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── Messages Preview Tab ────────────────────────────────────────────────────
function MessagesTab() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/friends")
      .then(r => setFriends(r.data.friends || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
          💬 Messages
        </h3>
        <Link to="/chat" style={{ padding: "9px 18px", background: "var(--navy)", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
          Open Full Chat →
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "var(--text-3)", padding: 40 }}>Loading...</div>
      ) : friends.length === 0 ? (
        <div className="dash-card" style={{ textAlign: "center", padding: "40px 30px", color: "var(--text-3)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 10 }}>💬</div>
          <p style={{ fontWeight: 600, margin: 0 }}>No conversations yet.</p>
          <p style={{ fontSize: "0.88rem", marginTop: 6 }}>Add friends first to start chatting.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {friends.map(f => (
            <Link to="/chat" key={f.id} style={{ textDecoration: "none" }}>
              <div className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer", transition: "transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{ position: "relative" }}>
                  <Avatar name={f.profile?.fullName || f.username || "?"} size={46} />
                  <span style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, background: "#22c55e", borderRadius: "50%", border: "2px solid #fff" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.95rem" }}>
                    {f.profile?.fullName || f.username}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>Tap to open chat →</div>
                </div>
                <span style={{ fontSize: "1.2rem" }}>💬</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Groups Tab ───────────────────────────────────────────────────────────────
const GROUP_CARD_COLORS = [
  "#dbeafe", "#dcfce7", "#fae8ff", "#fef3c7", "#fee2e2", "#e0f2fe"
];
const GROUP_EMOJIS = ["🔬", "📖", "💻", "🤝", "🎯", "📐"];

function GroupsTab({ authUser }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedIds, setJoinedIds] = useState(new Set());
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadGroups = useCallback(async () => {
    try {
      const res = await client.get("/groups");
      setGroups(res.data.groups || []);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  useEffect(() => {
    if (authUser?.enrollments) {
      setJoinedIds(new Set(authUser.enrollments.map(e => e.groupId)));
    }
  }, [authUser]);

  const handleJoin = async (groupId) => {
    try {
      await client.post(`/groups/${groupId}/join`);
      setJoinedIds(prev => new Set([...prev, groupId]));
      notify("Joined group! 🎉");
      loadGroups();
    } catch (e) { notify(e?.response?.data?.error || "Could not join.", "error"); }
  };

  const handleLeave = async (groupId) => {
    try {
      await client.delete(`/groups/${groupId}/leave`);
      setJoinedIds(prev => { const s = new Set(prev); s.delete(groupId); return s; });
      notify("Left group.");
      loadGroups();
    } catch (e) { notify(e?.response?.data?.error || "Could not leave.", "error"); }
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
          👥 Study Groups
        </h3>
        <Link to="/groups" style={{ padding: "9px 18px", background: "var(--navy)", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
          Browse All →
        </Link>
      </div>
      {loading ? (
        <p style={{ color: "var(--text-3)", textAlign: "center", padding: 24 }}>Loading groups...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {groups.map((g, idx) => {
            const isMember = joinedIds.has(g.id);
            const memberCount = g._count?.enrollments ?? 0;
            const color = GROUP_CARD_COLORS[idx % GROUP_CARD_COLORS.length];
            const emoji = GROUP_EMOJIS[idx % GROUP_EMOJIS.length];
            return (
              <div key={g.id} className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ background: color, padding: "20px 20px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "2rem" }}>{emoji}</span>
                  <div>
                    <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.95rem" }}>{g.name}</div>
                    {isMember && <span style={{ fontSize: "0.72rem", background: "rgba(15,33,68,0.12)", color: "var(--navy)", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>✅ Joined</span>}
                  </div>
                </div>
                <div style={{ padding: "14px 20px 18px" }}>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-2)", margin: "0 0 12px", lineHeight: 1.6 }}>
                    {g.description || "No description provided."}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-3)", fontWeight: 600 }}>👥 {memberCount} member{memberCount !== 1 ? "s" : ""}</span>
                    {isMember ? (
                      <button onClick={() => handleLeave(g.id)} style={{ padding: "6px 14px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
                        Leave
                      </button>
                    ) : (
                      <button onClick={() => handleJoin(g.id)} style={{ padding: "6px 14px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {groups.length === 0 && (
            <div className="dash-card" style={{ textAlign: "center", color: "var(--text-3)", padding: 40, gridColumn: "1/-1" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>👥</div>
              <p style={{ fontWeight: 600, margin: 0 }}>No study groups available yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────
function SettingsTab({ authUser, onProfileUpdate }) {
  const [form, setForm]       = useState({
    fullName:    authUser?.profile?.fullName    || "",
    phone:       authUser?.profile?.phone       || "",
    dateOfBirth: authUser?.profile?.dateOfBirth ? authUser.profile.dateOfBirth.slice(0, 10) : "",
  });
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);
  const [avatar, setAvatar]   = useState(authUser?.profile?.avatarUrl || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { notify("Image must be under 2MB.", "error"); return; }
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      try {
        await client.post("/users/me/photo", { avatarUrl: dataUrl });
        notify("Profile photo updated! ✅");
      } catch {
        notify("Failed to upload photo.", "error");
      }
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await client.put("/users/me", {
        fullName: form.fullName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || undefined,
      });
      if (onProfileUpdate) onProfileUpdate(res.data.user);
      notify("Profile updated successfully!");
    } catch (err) {
      notify(err?.response?.data?.error || "Failed to save profile.", "error");
    }
    setSaving(false);
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: 22 }}>
        ⚙️ Account Settings
      </h3>

      {/* Avatar Upload */}
      <div className="dash-card" style={{ maxWidth: 600, padding: 24, marginBottom: 18 }}>
        <h4 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 16px" }}>Profile Photo</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "3px solid var(--border)", flexShrink: 0, background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {avatar
              ? <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ color: "var(--gold)", fontWeight: 900, fontSize: "1.8rem" }}>{getInitials(form.fullName || authUser?.email)}</span>
            }
          </div>
          <div>
            <label style={{ display: "inline-block", padding: "9px 18px", background: "var(--navy)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              {uploadingAvatar ? "Uploading..." : "📸 Upload Photo"}
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} disabled={uploadingAvatar} />
            </label>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 6 }}>JPG, PNG or GIF · Max 2MB</p>
          </div>
        </div>
      </div>

      <div className="dash-card" style={{ maxWidth: 600, padding: 28 }}>
        <form onSubmit={handleSave}>
          {/* Full Name */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+234..."
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Date of Birth */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Email — read only with note */}
          <div style={{ marginBottom: 26 }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Email Address
            </label>
            <input
              type="email"
              value={authUser?.email || ""}
              readOnly
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", fontFamily: "inherit", background: "#f8fafc", color: "var(--text-3)", boxSizing: "border-box", cursor: "not-allowed" }}
            />
            <p style={{ margin: "6px 0 0", fontSize: "0.78rem", color: "#f59e0b" }}>
              ⚠️ Email changes require OTP verification — coming soon.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="dash-card" style={{ maxWidth: 600, marginTop: 20, padding: 24, borderColor: "#fecaca", background: "#fff5f5" }}>
        <h4 style={{ margin: "0 0 6px", color: "#dc2626", fontFamily: "var(--font-h)" }}>⚠️ Danger Zone</h4>
        <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "var(--text-3)" }}>
          Permanently delete your account and all data. This action cannot be undone.
        </p>
        <button style={{ padding: "9px 20px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
          onClick={() => alert("Account deletion requires contacting support. Coming soon.")}>
          Delete My Account
        </button>
      </div>
    </div>
  );
}

// ─── Notifications Tab ───────────────────────────────────────────────────────
function NotificationsTab({ authUser }) {
  const [pushGranted, setPushGranted] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );
  const [prefs, setPrefs] = useState({
    inAppFriendRequests: true,
    inAppMessages: true,
    inAppAnnouncements: true,
    emailCourseUpdates: false,
    emailNewsletters: false,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (authUser?.permissionOverrides) {
      const newPrefs = {
        inAppFriendRequests: true,
        inAppMessages: true,
        inAppAnnouncements: true,
        emailCourseUpdates: false,
        emailNewsletters: false,
      };
      authUser.permissionOverrides.forEach(override => {
        if (override.key in newPrefs) {
          newPrefs[override.key] = override.value;
        }
      });
      setPrefs(newPrefs);
    }
  }, [authUser]);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const requestPush = async () => {
    if (!("Notification" in window)) {
      notify("Your browser doesn't support push notifications.", "error");
      return;
    }
    const result = await Notification.requestPermission();
    setPushGranted(result);
    if (result === "granted") {
      notify("Push notifications enabled! 🔔");
    } else {
      notify("Permission denied. Enable in browser settings.", "error");
    }
  };

  const savePrefs = async () => {
    setSaving(true);
    try {
      await client.put("/users/me/privacy", { settings: prefs });
      notify("Notification preferences saved!");
    } catch {
      notify("Failed to save preferences.", "error");
    }
    setSaving(false);
  };

  const Toggle = ({ label, desc, value, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.9rem" }}>{label}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 48, height: 26, borderRadius: 99, border: "none", cursor: "pointer",
          background: value ? "var(--navy)" : "#e2e8f0",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3, left: value ? "calc(100% - 22px)" : 3,
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: 22 }}>
        🔔 Notifications
      </h3>

      {/* Push Notifications */}
      <div className="dash-card" style={{ maxWidth: 600, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ fontSize: "2rem" }}>📱</div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 4px" }}>Browser Push Notifications</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-2)", margin: "0 0 14px", lineHeight: 1.6 }}>
              Allow St. Lawrence to send you real-time alerts for messages, friend requests, and announcements — even when you're not on the page.
            </p>
            {pushGranted === "granted" ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", color: "#15803d", padding: "6px 14px", borderRadius: 99, fontWeight: 700, fontSize: "0.82rem" }}>
                ✅ Notifications Enabled
              </div>
            ) : pushGranted === "denied" ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fee2e2", color: "#dc2626", padding: "6px 14px", borderRadius: 99, fontWeight: 700, fontSize: "0.82rem" }}>
                🚫 Blocked — Enable in Browser Settings
              </div>
            ) : (
              <button onClick={requestPush} style={{ padding: "10px 20px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit" }}>
                🔔 Enable Push Notifications
              </button>
            )}
          </div>
        </div>
      </div>

      {/* In-App Preferences */}
      <div className="dash-card" style={{ maxWidth: 600, marginBottom: 16 }}>
        <h4 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 4px" }}>In-App Notifications</h4>
        <p style={{ fontSize: "0.82rem", color: "var(--text-3)", margin: "0 0 10px" }}>Choose what you're notified about while using the platform.</p>
        <Toggle label="Friend Requests" desc="When someone sends you a friend request" value={prefs.inAppFriendRequests} onChange={v => setPrefs({ ...prefs, inAppFriendRequests: v })} />
        <Toggle label="New Messages" desc="When you receive a direct message" value={prefs.inAppMessages} onChange={v => setPrefs({ ...prefs, inAppMessages: v })} />
        <Toggle label="Announcements" desc="School news and important updates" value={prefs.inAppAnnouncements} onChange={v => setPrefs({ ...prefs, inAppAnnouncements: v })} />
      </div>

      {/* Email Preferences */}
      <div className="dash-card" style={{ maxWidth: 600, marginBottom: 20 }}>
        <h4 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 4px" }}>Email Notifications</h4>
        <p style={{ fontSize: "0.82rem", color: "var(--text-3)", margin: "0 0 10px" }}>Control what we send to your inbox.</p>
        <Toggle label="Course Updates" desc="When new lessons or materials are added" value={prefs.emailCourseUpdates} onChange={v => setPrefs({ ...prefs, emailCourseUpdates: v })} />
        <Toggle label="Newsletter" desc="Monthly academy news and student highlights" value={prefs.emailNewsletters} onChange={v => setPrefs({ ...prefs, emailNewsletters: v })} />
      </div>

      <button onClick={savePrefs} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
        {saving ? "Saving..." : "💾 Save Preferences"}
      </button>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!loading && !authUser) navigate("/login");
  }, [authUser, loading, navigate]);

  // Load pending friend request count for badge
  useEffect(() => {
    if (authUser) {
      client.get("/friends/requests/pending")
        .then(r => setPendingCount((r.data.requests || []).length))
        .catch(() => {});
    }
  }, [authUser]);

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading || !authUser)
    return <div style={{ minHeight: "100vh", background: "#f3f6fb" }} />;

  const user = {
    firstName:   authUser.profile?.fullName?.split(" ")[0] || authUser.email?.split("@")[0] || "Student",
    lastName:    authUser.profile?.fullName?.split(" ").slice(1).join(" ") || "",
    fullName:    authUser.profile?.fullName || authUser.email?.split("@")[0] || "Student",
    role:        authUser.role || "STUDENT",
    tier:        authUser.tier || "UNPAID",
    email:       authUser.email,
  };

  const initials = getInitials(user.fullName || user.firstName);

  const NAV = [
    { label: "Overview",    icon: "🏠" },
    { label: user.role === "TEACHER" ? "My Classes" : "My Courses", icon: "📚" },
    { label: "Friends",     icon: "🤝", badge: pendingCount > 0 ? pendingCount : null },
    { label: "Messages",    icon: "💬" },
    { label: "Groups",      icon: "👥" },
    user.role !== "TEACHER" ? { label: "Certificates", icon: "🏆" } : null,
    { label: "Notifications", icon: "🔔" },
    { label: "Settings",    icon: "⚙️" },
  ].filter(Boolean);

  return (
    <div className="profile-shell product-dashboard-page">
      {/* ── TOP NAV ─────────────────────────────────── */}
      <nav className="nav profile-page-nav">
        <Link to="/" className="nav-logo">
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
          <div className="nav-brand-name">
            ST. LAWRENCE
            <span style={{ display: "block", fontSize: "0.6rem", fontWeight: 500, color: "var(--text-3)" }}>
              Next Gen Academy
            </span>
          </div>
        </Link>
        <div className="profile-top-actions" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/classrooms" style={{ color: "var(--text-2)", fontWeight: 600, fontSize: "0.87rem", whiteSpace: "nowrap" }}>
            Browse Courses
          </Link>
          <Link to="/chat" style={{ color: "var(--text-2)", fontWeight: 600, fontSize: "0.87rem", whiteSpace: "nowrap" }}>
            💬 Chat
          </Link>
          <button onClick={handleLogout} className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
            Log Out
          </button>
        </div>
      </nav>

      {/* ── PAGE BODY ─────────────────────────────── */}
      <div className="profile-wrap">
        {/* ── PROFILE HEADER ──────────────────────── */}
        <div className="profile-header-card">
          <div className="profile-avatar-ring" style={{ overflow: authUser?.profile?.avatarUrl ? "hidden" : "visible", padding: 0 }}>
            {authUser?.profile?.avatarUrl
              ? <img src={authUser.profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : initials
            }
            <span className="profile-avatar-badge">✓</span>
          </div>
          <div className="profile-info" style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0 }}>Welcome back, {user.firstName}!</h2>
            </div>
            <p style={{ margin: "0 0 14px" }}>{user.role} · St. Lawrence Next Gen Academy</p>
            <div className="profile-badges">
              <span className="profile-badge gold">🏆 Top Learner</span>
              <span className="profile-badge green">✓ Verified</span>
              <span className="profile-badge blue">🎓 {user.role}</span>
              {user.tier === "PAID" && <span className="profile-badge gold">⭐ Premium</span>}
            </div>
            <div className="profile-stats-row">
              <div className="profile-stat">
                <div className="profile-stat-num">0</div>
                <div className="profile-stat-lbl">{user.role === "TEACHER" ? "Courses Taught" : "Courses Active"}</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num" style={{ color: "var(--gold)" }}>0</div>
                <div className="profile-stat-lbl">{user.role === "TEACHER" ? "Total Students" : "Certificates"}</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">0</div>
                <div className="profile-stat-lbl">{user.role === "TEACHER" ? "Hours Taught" : "Hours Learned"}</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num" style={{ color: pendingCount > 0 ? "#22c55e" : undefined }}>
                  {pendingCount}
                </div>
                <div className="profile-stat-lbl">Friend Requests</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DASHBOARD LAYOUT ─────────────────── */}
        <div className="dashboard-layout">
          {/* SIDEBAR */}
          <div className="dashboard-sidebar">
            {NAV.map(({ label, icon, badge }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`dashboard-sidebar-item${activeTab === label ? " active" : ""}`}
              >
                <span>{icon}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{ background: "#ef4444", color: "#fff", borderRadius: 99, padding: "1px 7px", fontSize: "0.72rem", fontWeight: 800 }}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* MAIN CONTENT */}
          <div className="dashboard-main">

            {/* ── OVERVIEW ── */}
            {activeTab === "Overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div className="dashboard-grid">
                  <div className="dash-card">
                    <div className="dash-card-icon blue">📘</div>
                    <h3>{user.role === "TEACHER" ? "Active Classes" : "Courses in Progress"}</h3>
                    <p style={{ fontSize: "2.4rem", fontWeight: 900, fontFamily: "var(--font-h)", color: "var(--navy)", margin: "6px 0 0" }}>0</p>
                  </div>
                  <div className="dash-card">
                    <div className="dash-card-icon gold">{user.role === "TEACHER" ? "👥" : "🏆"}</div>
                    <h3>{user.role === "TEACHER" ? "Total Students" : "Certificates Earned"}</h3>
                    <p style={{ fontSize: "2.4rem", fontWeight: 900, fontFamily: "var(--font-h)", color: "var(--gold)", margin: "6px 0 0" }}>0</p>
                  </div>
                  <div className="dash-card">
                    <div className="dash-card-icon green">👥</div>
                    <h3>Groups Joined</h3>
                    <p style={{ fontSize: "2.4rem", fontWeight: 900, fontFamily: "var(--font-h)", color: "var(--navy)", margin: "6px 0 0" }}>{authUser?.enrollments?.length ?? 0}</p>
                  </div>
                </div>

                {/* Quick shortcuts */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", marginBottom: 14 }}>
                    Quick Actions
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                    {[
                      { label: "Browse Courses", icon: "📚", to: "/classrooms" },
                      { label: "Open Chat",       icon: "💬", to: "/chat" },
                      { label: "Study Groups",    icon: "👥", to: "/groups" },
                      { label: "Past Questions",  icon: "📝", to: "/past-questions" },
                      { label: "Hall of Fame",    icon: "🏆", to: "/hall-of-fame" },
                      { label: "Latest News",     icon: "📰", to: "/news" },
                    ].map(item => (
                      <Link key={item.label} to={item.to} style={{ textDecoration: "none" }}>
                        <div className="dash-card" style={{ textAlign: "center", padding: "18px 12px", cursor: "pointer", transition: "transform 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{item.icon}</div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)" }}>{item.label}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Continue Learning */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", marginBottom: 14 }}>
                    {user.role === "TEACHER" ? "Recent Activity" : "Continue Learning"}
                  </h3>
                  <div className="dash-card dashboard-feature-card" style={{ padding: "30px", textAlign: "center", color: "var(--text-3)" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 10 }}>📭</div>
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      {user.role === "TEACHER" ? "No recent activity yet." : "You are not enrolled in any courses yet."}
                    </p>
                    {user.role !== "TEACHER" && (
                      <Link to="/classrooms" className="btn-primary" style={{ display: "inline-flex", marginTop: 20 }}>Browse Courses</Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── MY COURSES / MY CLASSES ── */}
            {(activeTab === "My Courses" || activeTab === "My Classes") && (
              <div>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: 20 }}>
                  {user.role === "TEACHER" ? "My Classes" : "Enrolled Courses"}
                </h3>
                <div className="dash-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-3)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 10 }}>📭</div>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {user.role === "TEACHER" ? "You haven't created any classes yet." : "You haven't enrolled in any courses yet."}
                  </p>
                  {user.role !== "TEACHER" && (
                    <Link to="/classrooms" className="btn-primary" style={{ display: "inline-flex", marginTop: 20 }}>Browse Courses</Link>
                  )}
                </div>
              </div>
            )}

            {/* ── FRIENDS ── */}
            {activeTab === "Friends" && <FriendsTab currentUserId={authUser?.id} />}

            {/* ── MESSAGES ── */}
            {activeTab === "Messages" && <MessagesTab />}

            {/* ── GROUPS ── */}
            {activeTab === "Groups" && <GroupsTab authUser={authUser} />}

            {/* ── CERTIFICATES ── */}
            {activeTab === "Certificates" && (
              <div>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: 20 }}>
                  My Certificates
                </h3>
                <div className="dash-card" style={{ textAlign: "center", padding: "40px", color: "var(--text-3)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 10 }}>🏅</div>
                  <p style={{ margin: 0, fontWeight: 500 }}>You haven't earned any certificates yet.</p>
                  <p style={{ fontSize: "0.85rem", marginTop: 8 }}>Complete a course to earn your first certificate!</p>
                  <Link to="/classrooms" className="btn-primary" style={{ display: "inline-flex", marginTop: 20 }}>Browse Courses</Link>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "Notifications" && <NotificationsTab authUser={authUser} />}

            {/* ── SETTINGS ── */}
            {activeTab === "Settings" && (
              <SettingsTab authUser={authUser} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
