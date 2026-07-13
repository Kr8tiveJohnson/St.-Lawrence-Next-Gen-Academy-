import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import client from "../api/client";

const FALLBACK_NEWS = [
  {
    id: 1,
    tag: "Exam Update",
    date: "Aug 15, 2026",
    title: "WAEC 2026 Timetable Released",
    summary: "The official timetable for the upcoming 2026 WAEC examinations has been published. Make sure to download and print your copy.",
    details: "The West African Examinations Council (WAEC) has officially released the timetable for the 2026 Senior School Certificate Examination (SSCE) for school candidates. The exams will commence on Monday, August 17, 2026, and conclude on Friday, September 25, 2026. Students are advised to start their revisions early and utilize the Past Questions portal on our platform to familiarize themselves with the exam format."
  },
  {
    id: 2,
    tag: "Platform Feature",
    date: "Aug 10, 2026",
    title: "New Interactive Digital Skills Modules",
    summary: "We've added three new interactive courses covering Basic Web Design, Data Analysis Basics, and Graphic Design Fundamentals.",
    details: "As part of our commitment to equipping students with 21st-century skills, St. Lawrence Next Gen Academy is thrilled to announce the addition of three new interactive modules to our Digital Skills curriculum. These include: \n\n1. Basic Web Design (HTML/CSS)\n2. Data Analysis Basics using Excel\n3. Graphic Design Fundamentals with Canva\n\nThese courses are now available for all registered students at no extra cost. Head over to the Classrooms section to enroll today!"
  }
];

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch live news
    client.get("/news")
      .then(({ data }) => {
        // Filter out hall-of-fame entries if they are in this list
        const filtered = (data.news || []).filter(n => n.tag !== "hall-of-fame");
        setNews(filtered.length > 0 ? filtered : FALLBACK_NEWS);
      })
      .catch((err) => {
        console.error("Failed to load news, showing fallbacks", err);
        setNews(FALLBACK_NEWS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="product-homepage"
      style={{
        minHeight: "100vh",
        background: "var(--off-white)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── TOP NAV ───────────────────────────────────── */}
      <nav className="nav internal-page-nav" style={{ padding: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <Link to="/" className="nav-logo">
            <img
              src={logoImg}
              alt="St. Lawrence Next Gen Academy"
              className="nav-logo-img"
            />
            <div>
              <div className="nav-brand-name">ST. LAWRENCE</div>
              <div className="nav-brand-sub hide-on-mobile">NEXT GEN ACADEMY</div>
            </div>
          </Link>
          <div
            className="internal-page-actions"
            style={{ display: "flex", gap: "16px", alignItems: "center" }}
          >
            <Link to="/login" style={{ color: "var(--navy)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
              Log In
            </Link>
            <Link to="/register" className="nav-cta">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main className="wrap" style={{ flex: 1, padding: "60px 20px", maxWidth: "900px", width: "100%", overflowX: "hidden" }}>
        <div style={{ marginBottom: "40px" }}>
          <Link to="/" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "var(--navy)", marginTop: "16px", marginBottom: "8px", wordBreak: "break-word" }}>
            News & Announcements
          </h1>
          <p style={{ color: "var(--text-light)", fontSize: "1.1rem" }}>
            Current news, important updates, and general information for students.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-light)", textAlign: "center", padding: "40px" }}>Loading announcements...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {news.map((item) => (
              <article
                key={item.id}
                className="announcement-card"
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                {item.imageUrl && (
                  <div style={{ width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", background: "#f1f5f9" }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div>
                  <div className="announcement-meta" style={{ marginBottom: "12px" }}>
                    <span className="announcement-tag" style={{ textTransform: "uppercase" }}>{item.tag}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                      {new Date(item.date || item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.4rem", color: "var(--navy)", marginBottom: "12px" }}>
                    {item.title}
                  </h2>
                  
                  {selectedNews === item.id ? (
                    <div style={{ marginTop: "16px" }}>
                      <p style={{ color: "var(--text)", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                        {item.details}
                      </p>
                      <button
                        onClick={() => setSelectedNews(null)}
                        className="btn btn-secondary"
                        style={{ marginTop: "24px" }}
                      >
                        Hide Details
                      </button>
                    </div>
                  ) : (
                    <>
                      <p style={{ color: "var(--text-light)", lineHeight: "1.5", marginBottom: "20px" }}>
                        {item.summary}
                      </p>
                      <button
                        onClick={() => setSelectedNews(item.id)}
                        className="btn"
                        style={{ 
                          background: "transparent", 
                          border: "1px solid var(--border)", 
                          color: "var(--navy)", 
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        View in Details
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer
        style={{
          padding: "32px",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
          color: "var(--text-light)",
          fontSize: "0.85rem",
          marginTop: "40px",
        }}
      >
        © {new Date().getFullYear()} St. Lawrence Next Gen Academy. All rights reserved.
      </footer>
    </div>
  );
}
