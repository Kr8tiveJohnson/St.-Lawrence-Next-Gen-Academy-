import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import client from "../api/client";

const FALLBACK_HALL = [
  {
    title: "Adaeze Okonkwo",
    summary: "9 A1s",
    details: "University of Lagos — Medicine",
    imageUrl: null
  },
  {
    title: "Chukwuemeka Eze",
    summary: "340 / 400",
    details: "University of Ibadan — Engineering",
    imageUrl: null
  }
];

export default function HallOfFamePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch live entries
    client.get("/news/hall-of-fame/entries")
      .then(({ data }) => {
        setEntries(data.entries && data.entries.length > 0 ? data.entries : FALLBACK_HALL);
      })
      .catch((err) => {
        console.error("Failed to load Hall of Fame entries", err);
        setEntries(FALLBACK_HALL);
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
      <nav
        className="nav"
        style={{
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: 0,
          borderBottom: "1px solid var(--border)",
          zIndex: 100,
        }}
      >
        <Link to="/" className="nav-logo" style={{ textDecoration: "none" }}>
          <img
            src={logoImg}
            alt="St. Lawrence Next Gen Academy"
            className="nav-logo-img"
          />
          <div>
            <div className="nav-brand-name">ST. LAWRENCE</div>
            <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
          </div>
        </Link>
        <div
          className="internal-page-actions"
          style={{ display: "flex", gap: "16px", alignItems: "center" }}
        >
          <Link to="/login" className="btn btn-secondary" style={{ textDecoration: "none" }}>
            Log In
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ textDecoration: "none" }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main className="wrap" style={{ flex: 1, padding: "60px 0", maxWidth: "1000px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span className="eyebrow" style={{ marginInline: "auto" }}>Hall of Fame</span>
          <h1 style={{ fontSize: "2.8rem", color: "var(--navy)", marginTop: "16px", marginBottom: "16px" }}>
            Celebrating Student Wins
          </h1>
          <p style={{ color: "var(--text-light)", fontSize: "1.2rem", maxWidth: "600px", marginInline: "auto" }}>
            Outstanding performance defines the St. Lawrence standard. Meet the students who turned preparation into real-world success.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-light)", textAlign: "center", padding: "40px" }}>Loading students...</p>
        ) : (
          <div className="hall-preview-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", display: "grid" }}>
            {entries.map((student, index) => (
              <div
                key={index}
                className="hall-preview-card"
                style={{
                  background: "var(--white)",
                  padding: "32px",
                  borderRadius: "24px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <div className="hall-preview-top" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    background: "var(--off-white)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                  }}>
                    {student.imageUrl ? (
                      <img src={student.imageUrl} alt={student.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "2.5rem" }}>🏆</span>
                    )}
                  </div>
                  <span className="hall-preview-track" style={{ 
                    background: "rgba(212,168,83,0.15)", 
                    color: "#b45309", 
                    padding: "4px 12px", 
                    borderRadius: "12px", 
                    fontSize: "0.8rem", 
                    fontWeight: 700 
                  }}>{student.tag || "STUDENT WIN"}</span>
                </div>
                <h3 style={{ fontSize: "1.4rem", color: "var(--navy)", marginBottom: "8px" }}>{student.title}</h3>
                <div className="hall-score" style={{ 
                  fontSize: "1.6rem", 
                  fontWeight: 900, 
                  color: "var(--gold)", 
                  marginBottom: "12px" 
                }}>{student.summary}</div>
                <p style={{ color: "var(--text-2)", lineHeight: "1.5" }}>{student.details}</p>
              </div>
            ))}
          </div>
        )}

        <div className="hall-cta-card" style={{
          marginTop: "60px",
          background: "linear-gradient(135deg, var(--navy) 0%, #1e3a8a 100%)",
          borderRadius: "24px",
          padding: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "24px"
        }}>
          <div style={{ color: "var(--white)" }}>
            <span style={{ 
              display: "inline-block",
              background: "rgba(212,168,83,0.2)",
              color: "var(--gold)",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px"
            }}>Your Success Story Could Be Here</span>
            <h3 style={{ fontSize: "1.8rem", margin: 0 }}>Join thousands of students preparing for standout results</h3>
          </div>
          <Link to="/register" className="btn btn-primary" style={{ background: "var(--gold)", color: "var(--navy)", border: "none", textDecoration: "none" }}>
            Start Your Journey Today
          </Link>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer
        style={{
          padding: "32px",
          textAlign: "center",
          borderTop: "1px solid var(--border)",
          color: "var(--text-light)",
          fontSize: "0.85rem",
        }}
      >
        © {new Date().getFullYear()} St. Lawrence Next Gen Academy. All rights reserved.
      </footer>
    </div>
  );
}
