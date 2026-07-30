import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

const GROUP_COLORS = [
  { bg: "linear-gradient(135deg, #dbeafe, #bfdbfe)", accent: "#3b82f6" },
  { bg: "linear-gradient(135deg, #dcfce7, #bbf7d0)", accent: "#22c55e" },
  { bg: "linear-gradient(135deg, #fae8ff, #f5d0fe)", accent: "#a855f7" },
  { bg: "linear-gradient(135deg, #fef3c7, #fde68a)", accent: "#f59e0b" },
  { bg: "linear-gradient(135deg, #fee2e2, #fecaca)", accent: "#ef4444" },
  { bg: "linear-gradient(135deg, #e0f2fe, #bae6fd)", accent: "#0ea5e9" },
];

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

const DISCUSSIONS = [
  "Best way to revise 100 past questions in one weekend",
  "Show your portfolio landing page for peer review",
  "How I improved my speed in JAMB mock CBT practice",
  "Client communication script templates for VA students",
];

export default function GroupsPage() {
  const navigate = useNavigate();
  const { user: authUser, loading } = useAuth();
  const [groups, setGroups] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const [joinedIds, setJoinedIds] = useState(new Set());

  const isAdmin = authUser?.role === "ADMIN" || authUser?.role === "MAIN_ADMIN" || !!localStorage.getItem("adminToken");

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadGroups = useCallback(async () => {
    setFetching(true);
    try {
      const res = await client.get("/groups");
      setGroups(res.data.groups || []);
    } catch {
      notify("Failed to load groups.", "error");
    }
    setFetching(false);
  }, []);

  useEffect(() => {
    if (!loading) loadGroups();
  }, [loading, loadGroups]);

  // Sync joined groups from authenticated user payload on mount / changes
  useEffect(() => {
    if (authUser?.enrollments) {
      setJoinedIds(new Set(authUser.enrollments.map(e => e.groupId)));
    }
  }, [authUser]);

  const handleJoin = async (groupId) => {
    try {
      await client.post(`/groups/${groupId}/join`);
      setJoinedIds(prev => new Set([...prev, groupId]));
      notify("You joined the group! 🎉");
      loadGroups();
    } catch (e) {
      notify(e?.response?.data?.error || "Could not join group.", "error");
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await client.delete(`/groups/${groupId}/leave`);
      setJoinedIds(prev => { const s = new Set(prev); s.delete(groupId); return s; });
      notify("You left the group.");
      loadGroups();
    } catch (e) {
      notify(e?.response?.data?.error || "Could not leave group.", "error");
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "var(--off-white)" }} />;

  return (
    <div style={{ background: "var(--off-white)", minHeight: "100vh" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="nav" style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderRadius: 0, borderBottom: "1px solid var(--border)", zIndex: 100 }}>
        <Link to="/" className="nav-logo" style={{ textDecoration: "none" }}>
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
          <div>
            <div className="nav-brand-name" style={{ color: "var(--navy)" }}>ST. LAWRENCE</div>
            <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
          </div>
        </Link>
        <div className="internal-page-actions" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!localStorage.getItem("adminToken") && (
            <>
              <Link to="/chat" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.82rem" }}>💬 Chat</Link>
              <Link to="/profile" className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.82rem", boxShadow: "none" }}>My Dashboard</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div className="wrap" style={{ paddingTop: 56, paddingBottom: 88 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="hero-chip" style={{ marginBottom: 18 }}>
            <span className="chip-dot" /> Guided Study Circles
          </div>
          <h1 className="hero-h1" style={{ fontSize: "clamp(2.3rem, 5vw, 3.6rem)", marginInline: "auto", marginBottom: 14 }}>
            Groups Built for Focused Progress
          </h1>
          <p className="hero-desc" style={{ marginInline: "auto" }}>
            Join peer-led discussion boards, cohort pods, and performance-driven study communities tailored to your learning goals.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24, alignItems: "start" }}>
          {/* GROUPS GRID */}
          <div style={{ display: "grid", gap: 18 }}>
            {fetching ? (
              [1, 2, 3].map(i => (
                <div key={i} style={{ background: "#fff", borderRadius: 28, padding: 24, border: "1px solid var(--border)", opacity: 0.5, height: 180 }} />
              ))
            ) : groups.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 28, padding: "48px 24px", border: "1px solid var(--border)", textAlign: "center", color: "var(--text-3)" }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>👥</div>
                <p style={{ fontWeight: 600 }}>No groups available yet.</p>
              </div>
            ) : groups.map((group, idx) => {
              const colorSet = GROUP_COLORS[idx % GROUP_COLORS.length];
              const isMember = joinedIds.has(group.id);
              const memberCount = group._count?.enrollments ?? 0;
              return (
                <div key={group.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 28, padding: 24, boxShadow: "0 12px 30px rgba(10,22,40,0.03)" }}>
                  <div style={{ width: "100%", height: 72, borderRadius: 20, background: colorSet.bg, marginBottom: 16, display: "flex", alignItems: "center", paddingLeft: 20 }}>
                    <span style={{ fontSize: "1.8rem" }}>👥</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>{group.name}</h3>
                      {group.description && <p style={{ color: "var(--text-2)", fontSize: "0.88rem", marginTop: 4, lineHeight: 1.6 }}>{group.description}</p>}
                    </div>
                    <div style={{ background: "var(--off-white)", borderRadius: 99, padding: "5px 12px", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-2)", whiteSpace: "nowrap" }}>
                      {memberCount} member{memberCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {!isAdmin && (
                        authUser ? (
                          isMember ? (
                            <button onClick={() => handleLeave(group.id)} style={{ padding: "9px 18px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                              Leave Group
                            </button>
                          ) : (
                            <button onClick={() => handleJoin(group.id)} className="btn-primary" style={{ padding: "9px 18px" }}>
                              Join Group
                            </button>
                          )
                        ) : (
                          <Link to="/login" className="btn-primary" style={{ padding: "9px 18px" }}>Join Group</Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SIDEBAR */}
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 28, padding: 24 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", marginBottom: 14 }}>Trending Discussions</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {DISCUSSIONS.map((topic, i) => (
                  <div key={topic} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: 12, borderBottom: i < DISCUSSIONS.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--off-white)", display: "flex", alignItems: "center", justifycontent: "center", fontWeight: 800, color: "var(--navy)", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <p style={{ color: "var(--text-2)", lineHeight: 1.6, fontSize: "0.92rem", margin: 0 }}>{topic}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(145deg, #0f2040, #132d55)", color: "#fff", borderRadius: 28, padding: 24 }}>
              <div style={{ color: "var(--gold)", fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                Weekly Goal
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, marginBottom: 10 }}>Stay visible in your learning circle</h3>
              <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.65, marginBottom: 18, fontSize: "0.9rem" }}>
                Post a question, answer someone else, and join one scheduled room this week to keep your momentum alive.
              </p>
              <Link to="/profile" style={{ display: "inline-block", padding: "11px 20px", background: "#fff", color: "var(--navy)", borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                Open My Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
