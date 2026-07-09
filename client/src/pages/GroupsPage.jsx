import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const GROUPS = [
  {
    name: "WAEC Science Circle",
    members: 182,
    topics: 42,
    color: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
    label: "Exam Prep",
    desc: "Focused group for Physics, Chemistry, and Biology drills with weekly coordinator-led discussions.",
  },
  {
    name: "JAMB Elite Reading Room",
    members: 139,
    topics: 28,
    color: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    label: "Reading Sprint",
    desc: "Timed comprehension sessions, vocabulary drills, and peer accountability for Use of English prep.",
  },
  {
    name: "Frontend Builders Guild",
    members: 91,
    topics: 35,
    color: "linear-gradient(135deg, #fae8ff, #f5d0fe)",
    label: "Tech Cohort",
    desc: "A practical discussion board for UI reviews, React debugging help, and shipping portfolio projects.",
  },
  {
    name: "Virtual Assistant Accountability Pod",
    members: 67,
    topics: 19,
    color: "linear-gradient(135deg, #fef3c7, #fde68a)",
    label: "Career Track",
    desc: "Daily wins, tool walk-throughs, SOP sharing, and check-ins for remote career students.",
  },
];

const DISCUSSIONS = [
  "Best way to revise 100 past questions in one weekend",
  "Show your portfolio landing page for peer review",
  "How I improved my speed in JAMB mock CBT practice",
  "Client communication script templates for VA students",
];

export default function GroupsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("sl_token");
    if (!token) {
      navigate("/login");
      return;
    }
    setUser(
      JSON.parse(localStorage.getItem("sl_user")) || { firstName: "Student" },
    );
  }, [navigate]);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--off-white)" }} />
    );
  }

  return (
    <div
      className="page-wrapper"
      style={{ background: "var(--off-white)", minHeight: "100vh" }}
    >
      <nav
        className="nav internal-page-nav"
        style={{
          position: "sticky",
          top: 0,
          borderRadius: 0,
          borderBottom: "1px solid var(--border)",
          zIndex: 100,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "var(--navy)",
            fontWeight: 900,
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              background: "var(--navy)",
              color: "var(--gold)",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
            }}
          >
            SL
          </div>
          ST. LAWRENCE
        </Link>
        <div className="internal-page-actions">
          <Link
            to="/chat"
            className="btn-ghost"
            style={{ padding: "8px 16px", fontSize: "0.8rem" }}
          >
            Chat Hub
          </Link>
          <Link
            to="/profile"
            className="btn-primary"
            style={{
              padding: "8px 16px",
              fontSize: "0.8rem",
              boxShadow: "none",
            }}
          >
            My Dashboard
          </Link>
        </div>
      </nav>

      <div
        className="wrap community-wrap"
        style={{ paddingTop: "56px", paddingBottom: "88px" }}
      >
        <div
          className="internal-page-header"
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <div className="hero-chip" style={{ marginBottom: "18px" }}>
            <span className="chip-dot" /> Guided Study Circles
          </div>
          <h1
            className="hero-h1"
            style={{
              fontSize: "clamp(2.3rem, 5vw, 3.6rem)",
              marginInline: "auto",
              marginBottom: "14px",
            }}
          >
            Groups Built for Focused Progress
          </h1>
          <p className="hero-desc" style={{ marginInline: "auto" }}>
            Join peer-led discussion boards, cohort pods, and performance-driven
            study communities tailored to your learning goals.
          </p>
        </div>

        <div
          className="community-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div className="groups-grid" style={{ display: "grid", gap: "18px" }}>
            {GROUPS.map((group) => (
              <div
                key={group.name}
                className="community-card"
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--border)",
                  borderRadius: "28px",
                  padding: "24px",
                  boxShadow: "0 12px 30px rgba(10,22,40,0.03)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "82px",
                    borderRadius: "20px",
                    background: group.color,
                    marginBottom: "16px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "var(--text-3)",
                        fontWeight: 800,
                        fontSize: "0.76rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {group.label}
                    </div>
                    <h3
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        color: "var(--navy)",
                      }}
                    >
                      {group.name}
                    </h3>
                  </div>
                  <div
                    style={{
                      background: "var(--off-white)",
                      borderRadius: "var(--r-full)",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: "var(--text-2)",
                    }}
                  >
                    {group.members} members
                  </div>
                </div>
                <p
                  style={{
                    color: "var(--text-2)",
                    lineHeight: 1.65,
                    marginBottom: "16px",
                  }}
                >
                  {group.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ color: "var(--text-3)", fontWeight: 700 }}>
                    {group.topics} active topics
                  </span>
                  <button
                    className="btn-primary"
                    style={{ padding: "11px 18px" }}
                  >
                    Join Group
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            <div
              className="community-card"
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "28px",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.12rem",
                  fontWeight: 800,
                  color: "var(--navy)",
                  marginBottom: "14px",
                }}
              >
                Trending Discussions
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {DISCUSSIONS.map((topic, index) => (
                  <div
                    key={topic}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      paddingBottom: "12px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--off-white)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        color: "var(--navy)",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <p
                      style={{
                        color: "var(--text-2)",
                        lineHeight: 1.6,
                        fontSize: "0.94rem",
                      }}
                    >
                      {topic}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="community-card"
              style={{
                background: "linear-gradient(145deg, #0f2040, #132d55)",
                color: "var(--white)",
                borderRadius: "28px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  color: "var(--gold)",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Weekly Goal
              </div>
              <h3
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 900,
                  marginBottom: "10px",
                }}
              >
                Stay visible in your learning circle
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.65,
                  marginBottom: "18px",
                }}
              >
                Post a question, answer someone else, and join one scheduled
                room this week to keep your momentum alive.
              </p>
              <button
                className="btn-primary"
                style={{
                  background: "var(--white)",
                  color: "var(--navy)",
                  boxShadow: "none",
                }}
              >
                Open My Groups
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
