import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CHAT_ROOMS = [
  {
    name: "Virtual Assistant Mentorship Hub",
    category: "Premium Room",
    members: 128,
    activity: "Mentor live in 8 mins",
    accent: "rgba(212,168,83,0.16)",
    icon: "🎗️",
    desc: "Weekly support room for VA students working through client onboarding, SOPs, and productivity workflows.",
  },
  {
    name: "JAMB Intensive Revision Room",
    category: "Exam Circle",
    members: 214,
    activity: "42 active now",
    accent: "rgba(59,130,246,0.14)",
    icon: "📝",
    desc: "Peer-powered revision chat for timed drills, rapid-fire questions, and explanation sharing before mock tests.",
  },
  {
    name: "Frontend Build Review",
    category: "Tech Lab",
    members: 76,
    activity: "Projects under review",
    accent: "rgba(34,197,94,0.14)",
    icon: "💻",
    desc: "Students post portfolio builds, receive instructor review, and discuss UI, React, deployment, and debugging.",
  },
  {
    name: "Career & Remote Jobs Lounge",
    category: "Career Room",
    members: 93,
    activity: "3 new job leads",
    accent: "rgba(168,85,247,0.14)",
    icon: "🚀",
    desc: "A premium networking room for remote role leads, CV feedback, LinkedIn polishing, and interview prep.",
  },
];

const CHAT_FEED = [
  {
    name: "Sarah J.",
    time: "2 mins ago",
    text: "I just uploaded a new checklist for client onboarding. Please review before tonight's session.",
  },
  {
    name: "Chinedu N.",
    time: "8 mins ago",
    text: "Can someone explain the shortcut for simultaneous equations in yesterday's JAMB revision room?",
  },
  {
    name: "Elena R.",
    time: "14 mins ago",
    text: "Frontend lab starts by 7 PM. Share your landing page links before the critique round.",
  },
];

export default function ChatPage() {
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
            to="/groups"
            className="btn-ghost"
            style={{ padding: "8px 16px", fontSize: "0.8rem" }}
          >
            Study Groups
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
            Dashboard
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
            <span className="chip-dot" /> Live Collaboration Rooms
          </div>
          <h1
            className="hero-h1"
            style={{
              fontSize: "clamp(2.3rem, 5vw, 3.6rem)",
              marginInline: "auto",
              marginBottom: "14px",
            }}
          >
            Chat Hub for Enrolled Students
          </h1>
          <p className="hero-desc" style={{ marginInline: "auto" }}>
            Jump into peer-to-peer rooms, instructor office hours, and focused
            revision spaces built to keep your learning momentum high.
          </p>
        </div>

        <div
          className="community-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: "18px" }}>
            {CHAT_ROOMS.map((room) => (
              <div
                key={room.name}
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "18px",
                        background: room.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.6rem",
                        flexShrink: 0,
                      }}
                    >
                      {room.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "0.76rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          color: "var(--text-3)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        {room.category}
                      </div>
                      <h3
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: 800,
                          color: "var(--navy)",
                          lineHeight: 1.25,
                        }}
                      >
                        {room.name}
                      </h3>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "var(--off-white)",
                      borderRadius: "var(--r-full)",
                      padding: "6px 12px",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      color: "var(--text-2)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {room.members} members
                  </div>
                </div>
                <p
                  style={{
                    color: "var(--text-2)",
                    lineHeight: 1.65,
                    marginBottom: "18px",
                  }}
                >
                  {room.desc}
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
                  <span
                    style={{
                      color: "var(--green)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    {room.activity}
                  </span>
                  <button
                    className="btn-primary"
                    style={{ padding: "11px 18px" }}
                  >
                    Enter Room
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            <div
              className="community-card"
              style={{
                background: "linear-gradient(145deg, #0f2040, #132d55)",
                color: "var(--white)",
                borderRadius: "28px",
                padding: "24px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-60px",
                  right: "-30px",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(212,168,83,0.18), transparent 70%)",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    color: "var(--gold)",
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    letterSpacing: "0.09em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Access Status
                </div>
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 900,
                    marginBottom: "10px",
                  }}
                >
                  Premium Chat Unlocked
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    lineHeight: 1.65,
                    marginBottom: "18px",
                  }}
                >
                  {user.firstName}, your enrolled account can join mentor rooms,
                  revision circles, and focused cohort support sessions.
                </p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {[
                    "Mentor office hours every weekday",
                    "Room-based moderation and study etiquette",
                    "Priority access for premium cohorts",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                      }}
                    >
                      <span style={{ color: "var(--gold)", fontWeight: 900 }}>
                        •
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.82)" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "var(--navy)",
                  marginBottom: "16px",
                }}
              >
                Recent Room Activity
              </h3>
              <div style={{ display: "grid", gap: "14px" }}>
                {CHAT_FEED.map((item) => (
                  <div
                    key={item.name + item.time}
                    style={{
                      paddingBottom: "14px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "6px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontWeight: 800, color: "var(--navy)" }}>
                        {item.name}
                      </span>
                      <span
                        style={{ color: "var(--text-3)", fontSize: "0.82rem" }}
                      >
                        {item.time}
                      </span>
                    </div>
                    <p
                      style={{
                        color: "var(--text-2)",
                        lineHeight: 1.6,
                        fontSize: "0.92rem",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
