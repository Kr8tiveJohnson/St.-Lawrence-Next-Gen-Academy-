import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const token = localStorage.getItem("sl_token");
    if (!token) {
      navigate("/login");
      return;
    }
    const storedUser = JSON.parse(localStorage.getItem("sl_user")) || {
      firstName: "Student",
      lastName: "One",
      role: "Student",
    };
    setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sl_token");
    localStorage.removeItem("sl_user");
    navigate("/");
  };

  if (!user)
    return <div style={{ minHeight: "100vh", background: "#f3f6fb" }} />;

  const initials = `${user.firstName?.charAt(0) || "S"}${user.lastName?.charAt(0) || ""}`;

  return (
    <div className="profile-shell product-dashboard-page">
      {/* ── TOP NAV ───────────────────────────────────── */}
      <nav className="nav profile-page-nav">
        <Link to="/" className="nav-logo">
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
          <div className="nav-brand-name">
            ST. LAWRENCE
            <span
              style={{
                display: "block",
                fontSize: "0.6rem",
                fontWeight: 500,
                color: "var(--text-3)",
              }}
            >
              Next Gen Academy
            </span>
          </div>
        </Link>

        <div
          className="profile-top-actions"
          style={{ display: "flex", gap: "12px", alignItems: "center" }}
        >
          <Link
            to="/classrooms"
            style={{
              color: "var(--text-2)",
              fontWeight: 600,
              fontSize: "0.87rem",
              whiteSpace: "nowrap",
            }}
          >
            Browse Courses
          </Link>
          <button
            onClick={handleLogout}
            className="btn-ghost"
            style={{
              padding: "8px 16px",
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
            }}
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* ── PAGE BODY ─────────────────────────────────── */}
      <div className="profile-wrap">
        {/* ── PROFILE HEADER CARD ───────────────────── */}
        <div className="profile-header-card">
          {/* Avatar */}
          <div className="profile-avatar-ring">
            {initials}
            <span className="profile-avatar-badge">✓</span>
          </div>

          {/* Info */}
          <div className="profile-info" style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "6px",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0 }}>
                Welcome back, {user.firstName || "Student"}!
              </h2>
            </div>

            <p style={{ margin: "0 0 14px" }}>
              {user.role || "Student"} · St. Lawrence Next Gen Academy
            </p>

            {/* Badges */}
            <div className="profile-badges">
              <span className="profile-badge gold">🏆 Top Learner</span>
              <span className="profile-badge green">✓ Verified</span>
              <span className="profile-badge blue">
                🎓 {user.role || "Student"}
              </span>
            </div>

            {/* Quick stats */}
            <div className="profile-stats-row">
              <div className="profile-stat">
                <div className="profile-stat-num">0</div>
                <div className="profile-stat-lbl">{user.role === 'TEACHER' ? 'Courses Taught' : 'Courses Active'}</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num" style={{ color: "var(--gold)" }}>0</div>
                <div className="profile-stat-lbl">{user.role === 'TEACHER' ? 'Total Students' : 'Certificates'}</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">0</div>
                <div className="profile-stat-lbl">{user.role === 'TEACHER' ? 'Hours Taught' : 'Hours Learned'}</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num" style={{ color: "var(--green)" }}>0</div>
                <div className="profile-stat-lbl">{user.role === 'TEACHER' ? 'Resources Shared' : 'Lessons This Week'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DASHBOARD LAYOUT ──────────────────────── */}
        <div className="dashboard-layout">
          {/* SIDEBAR */}
          <div className="dashboard-sidebar">
            {[
              { label: "Overview", icon: "🏠" },
              { label: user.role === 'TEACHER' ? "My Classes" : "My Courses", icon: "📚" },
              user.role === 'TEACHER' ? null : { label: "Certificates", icon: "🏆" },
              { label: "Settings", icon: "⚙️" },
            ].filter(Boolean).map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`dashboard-sidebar-item${activeTab === label ? " active" : ""}`}
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* MAIN CONTENT */}
          <div className="dashboard-main">
            {/* ── OVERVIEW TAB ── */}
            {activeTab === "Overview" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                }}
              >
                {/* Stat cards */}
                <div className="dashboard-grid">
                  <div className="dash-card">
                    <div className="dash-card-icon blue">📘</div>
                    <h3>{user.role === 'TEACHER' ? 'Active Classes' : 'Courses in Progress'}</h3>
                    <p style={{ fontSize: "2.4rem", fontWeight: 900, fontFamily: "var(--font-h)", color: "var(--navy)", margin: "6px 0 0" }}>0</p>
                  </div>
                  <div className="dash-card">
                    <div className="dash-card-icon gold">{user.role === 'TEACHER' ? '👥' : '🏆'}</div>
                    <h3>{user.role === 'TEACHER' ? 'Total Students' : 'Certificates Earned'}</h3>
                    <p style={{ fontSize: "2.4rem", fontWeight: 900, fontFamily: "var(--font-h)", color: "var(--gold)", margin: "6px 0 0" }}>0</p>
                  </div>
                  <div className="dash-card">
                    <div className="dash-card-icon green">⏱️</div>
                    <h3>{user.role === 'TEACHER' ? 'Hours Taught' : 'Hours Learned'}</h3>
                    <p style={{ fontSize: "2.4rem", fontWeight: 900, fontFamily: "var(--font-h)", color: "var(--navy)", margin: "6px 0 0" }}>0</p>
                  </div>
                </div>

                {/* Continue Learning */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: "16px" }}>
                    {user.role === 'TEACHER' ? 'Recent Activity' : 'Continue Learning'}
                  </h3>
                  <div className="dash-card dashboard-feature-card" style={{ padding: "30px", textAlign: "center", color: "var(--text-3)" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📭</div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{user.role === 'TEACHER' ? 'You have no recent activity.' : 'You are not enrolled in any courses yet.'}</p>
                    {user.role !== 'TEACHER' && (
                      <Link to="/classrooms" className="btn-primary" style={{ display: "inline-flex", marginTop: "20px" }}>Browse Courses</Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── CERTIFICATES TAB ── */}
            {activeTab === "Certificates" && (
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-h)",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--navy)",
                    marginBottom: "20px",
                  }}
                >
                  My Certificates
                </h3>
                  <div className="dash-card" style={{ textAlign: "center", padding: "40px", color: "var(--text-3)" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🏅</div>
                    <p style={{ margin: 0, fontWeight: 500 }}>You haven't earned any certificates yet.</p>
                  </div>
              </div>
            )}

            {/* ── MY COURSES / MY CLASSES TAB ── */}
            {(activeTab === "My Courses" || activeTab === "My Classes") && (
              <div>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: "20px" }}>
                  {user.role === 'TEACHER' ? 'My Classes' : 'Enrolled Courses'}
                </h3>
                <div className="dash-card" style={{ padding: "40px", textAlign: "center", color: "var(--text-3)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📭</div>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    {user.role === 'TEACHER' ? "You haven't created any classes yet." : "You haven't enrolled in any courses yet."}
                  </p>
                </div>
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === "Settings" && (
              <div>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: "20px" }}>
                  Account Settings
                </h3>
                <div className="dash-card" style={{ maxWidth: "600px" }}>
                  <form onSubmit={(e) => { e.preventDefault(); alert("Profile updated successfully!"); }}>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px" }}>First Name</label>
                      <input type="text" defaultValue={user.firstName} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "1rem" }} />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px" }}>Last Name</label>
                      <input type="text" defaultValue={user.lastName} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "1rem" }} />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px" }}>Phone Number</label>
                      <input type="tel" placeholder="+234..." style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "1rem" }} />
                    </div>
                    <div style={{ marginBottom: "30px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "var(--text)", cursor: "pointer" }}>
                        <input type="checkbox" defaultChecked />
                        Opt-in to promotional emails and newsletters
                      </label>
                    </div>
                    <button type="submit" className="btn-primary">Save Changes</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
