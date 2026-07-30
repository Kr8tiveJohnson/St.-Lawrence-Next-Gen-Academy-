import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/St. Lawrence Next Gen Academy logo.png";

export default function HolidayPopup() {
  const [closed, setClosed] = useState(false);
  const navigate = useNavigate();

  if (closed) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setClosed(true)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(10, 22, 40, 0.6)",
          backdropFilter: "blur(8px)",
          zIndex: 9998,
          animation: "fadeIn 0.3s ease",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        width: "min(520px, calc(100vw - 32px))",
        background: "#fff",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(10,22,40,0.28)",
        animation: "popupSlideIn 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Gold Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, var(--navy) 0%, #1c3272 100%)",
          padding: "28px 28px 22px",
          position: "relative",
        }}>
          {/* Close button */}
          <button
            onClick={() => setClosed(true)}
            style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: "50%", width: 32, height: 32,
              color: "#fff", cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "inherit", fontWeight: 700,
            }}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Logo + Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <img
              src={logoImg}
              alt="St. Lawrence Next Gen Academy"
              style={{ width: 44, height: 44, objectFit: "contain", borderRadius: 10 }}
            />
            <div>
              <div style={{ color: "var(--gold)", fontFamily: "var(--font-h)", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.04em" }}>
                ST. LAWRENCE
              </div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Next Gen Academy
              </div>
            </div>
          </div>

          {/* Headline */}
          <div style={{
            display: "inline-block",
            background: "var(--gold)",
            color: "var(--navy)",
            fontSize: "0.72rem", fontWeight: 900,
            letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "4px 12px", borderRadius: 99, marginBottom: 10,
          }}>
            🎓 Now Open — Limited Spaces
          </div>
          <h2 style={{
            color: "#fff",
            fontFamily: "var(--font-h)",
            fontSize: "clamp(1.4rem, 4vw, 1.9rem)",
            fontWeight: 900, margin: 0, lineHeight: 1.25,
          }}>
            Holiday Intensive Lessons — 2026
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          <p style={{
            color: "var(--text-2)", fontSize: "0.95rem",
            lineHeight: 1.75, marginBottom: 22,
          }}>
            Our holiday revision programme is now open for enrolment. Get intensive,
            exam-focused lessons covering <strong>WAEC, JAMB, NECO</strong> and more —
            delivered by expert tutors.{" "}
            <strong style={{ color: "var(--navy)" }}>Spaces are limited</strong> — secure your slot today.
          </p>

          {/* Highlights */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[
              { icon: "📅", label: "Flexible Schedule" },
              { icon: "🎯", label: "Exam-Focused" },
              { icon: "👨‍🏫", label: "Expert Tutors" },
              { icon: "📜", label: "Certificate Issued" },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--off-white)", borderRadius: 10, padding: "10px 14px",
              }}>
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => { setClosed(true); navigate("/register"); }}
              style={{
                flex: 1, minWidth: 140,
                padding: "14px 20px",
                background: "var(--navy)", color: "#fff",
                border: "none", borderRadius: 12,
                fontWeight: 800, fontSize: "0.95rem",
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(16,28,68,0.25)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,28,68,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(16,28,68,0.25)"; }}
            >
              Apply Now →
            </button>
            <button
              onClick={() => setClosed(true)}
              style={{
                flex: 1, minWidth: 140,
                padding: "14px 20px",
                background: "transparent", color: "var(--text-2)",
                border: "1px solid var(--border)", borderRadius: 12,
                fontWeight: 700, fontSize: "0.95rem",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Maybe Later
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-3)", marginTop: 14 }}>
            Hurry — only a few slots remaining for this session.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes popupSlideIn {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}
