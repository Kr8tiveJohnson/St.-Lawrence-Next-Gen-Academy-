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
                <div className="profile-stat-num">2</div>
                <div className="profile-stat-lbl">Courses Active</div>
              </div>
              <div className="profile-stat">
                <div
                  className="profile-stat-num"
                  style={{ color: "var(--gold)" }}
                >
                  1
                </div>
                <div className="profile-stat-lbl">Certificates</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-num">18</div>
                <div className="profile-stat-lbl">Hours Learned</div>
              </div>
              <div className="profile-stat">
                <div
                  className="profile-stat-num"
                  style={{ color: "var(--green)" }}
                >
                  4
                </div>
                <div className="profile-stat-lbl">Lessons This Week</div>
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
              { label: "My Courses", icon: "📚" },
              { label: "Certificates", icon: "🏆" },
              { label: "Settings", icon: "⚙️" },
            ].map(({ label, icon }) => (
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
                    <h3>Courses in Progress</h3>
                    <p
                      style={{
                        fontSize: "2.4rem",
                        fontWeight: 900,
                        fontFamily: "var(--font-h)",
                        color: "var(--navy)",
                        margin: "6px 0 0",
                      }}
                    >
                      2
                    </p>
                  </div>
                  <div className="dash-card">
                    <div className="dash-card-icon gold">🏆</div>
                    <h3>Certificates Earned</h3>
                    <p
                      style={{
                        fontSize: "2.4rem",
                        fontWeight: 900,
                        fontFamily: "var(--font-h)",
                        color: "var(--gold)",
                        margin: "6px 0 0",
                      }}
                    >
                      1
                    </p>
                  </div>
                  <div className="dash-card">
                    <div className="dash-card-icon green">⏱️</div>
                    <h3>Hours Learned</h3>
                    <p
                      style={{
                        fontSize: "2.4rem",
                        fontWeight: 900,
                        fontFamily: "var(--font-h)",
                        color: "var(--navy)",
                        margin: "6px 0 0",
                      }}
                    >
                      18
                    </p>
                  </div>
                </div>

                {/* Continue Learning */}
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-h)",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--navy)",
                      marginBottom: "16px",
                    }}
                  >
                    Continue Learning
                  </h3>
                  <div
                    className="dash-card dashboard-feature-card"
                    style={{
                      display: "flex",
                      gap: "24px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #e0f2fe, #bfdbfe)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        flexShrink: 0,
                      }}
                    >
                      💻
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-3)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "4px",
                        }}
                      >
                        Tech &amp; Design
                      </div>
                      <h4
                        style={{
                          fontFamily: "var(--font-h)",
                          fontSize: "1.1rem",
                          fontWeight: 800,
                          color: "var(--navy)",
                          marginBottom: "10px",
                        }}
                      >
                        Full-Stack Web Development
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div className="progress-bar-track" style={{ flex: 1 }}>
                          <div
                            className="progress-bar-fill"
                            style={{ width: "45%" }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: "var(--text-2)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          45%
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ padding: "10px 22px", whiteSpace: "nowrap" }}
                    >
                      Resume →
                    </button>
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
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
                    borderRadius: "28px",
                    padding: "40px 32px",
                    color: "var(--white)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    border: "3px solid rgba(212,168,83,0.35)",
                    boxShadow: "0 24px 48px rgba(29, 78, 216, 0.22)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(circle at 80% 20%, rgba(212,168,83,0.12) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "var(--gold)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.4rem",
                      marginBottom: "20px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    🏆
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "var(--gold)",
                      fontWeight: 800,
                      marginBottom: "10px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Certificate of Completion
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-h)",
                      fontSize: "1.9rem",
                      fontWeight: 900,
                      marginBottom: "10px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Virtual Assistant Professional
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "28px",
                      fontSize: "1rem",
                      maxWidth: "380px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    This certifies that{" "}
                    <strong>
                      {user.firstName} {user.lastName || ""}
                    </strong>{" "}
                    has successfully completed the premium curriculum and
                    milestone projects.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <button
                      className="btn-primary"
                      style={{
                        background: "var(--white)",
                        color: "var(--navy)",
                        boxShadow: "none",
                      }}
                    >
                      Download PDF
                    </button>
                    <button
                      className="btn-ghost"
                      style={{
                        borderColor: "var(--gold)",
                        color: "var(--gold)",
                      }}
                    >
                      Share to LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── MY COURSES / SETTINGS TABS ── */}
            {(activeTab === "My Courses" || activeTab === "Settings") && (
              <div
                className="dash-card dashboard-empty-card"
                style={{
                  textAlign: "center",
                  padding: "80px 24px",
                  background: "var(--white)",
                  borderRadius: "28px",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: "3rem",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  🚧
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-h)",
                    fontSize: "1.4rem",
                    color: "var(--navy)",
                    marginBottom: "8px",
                  }}
                >
                  Under Construction
                </h3>
                <p style={{ color: "var(--text-3)" }}>
                  This section is currently being built.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
