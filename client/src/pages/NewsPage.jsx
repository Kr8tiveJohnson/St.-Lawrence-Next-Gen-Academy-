import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import client from "../api/client";

/* ─────────────────────────────────────────────────────────────
   FALLBACK NEWS  (shown when the API is unreachable)
───────────────────────────────────────────────────────────── */
const FALLBACK_NEWS = [
  {
    id: 3,
    tag: "Holiday Lessons",
    date: "Jul 27, 2026",
    title: "2026 Holiday Lessons Now Open — WAEC • NECO • JAMB",
    summary:
      "St. Lawrence Next Gen Academy is excited to announce our 2026 Holiday Lessons for Primary & Secondary students! Classes run Monday–Thursday, 9:00 AM–1:00 PM from 27th July to 27th August 2026. Lesson fee: ₦10,000 per child.",
    details:
      "ST. LAWRENCE NEXT GEN ACADEMY\nRaising Future Leaders. Building Tomorrow, Today.\n\n📚 WAEC • NECO • JAMB FULL CLASSES COMMENCES\n• Active teaching with online classes\n• CBT training and practice\n• Exam focus with detailed learning\n• FREE WiFi for all students\n\n──────────────────────────────\n🗓 2026 HOLIDAY LESSONS\n──────────────────────────────\n📅 Duration:  27th July 2026 – 27th August 2026\n⏰ Time:       9:00 AM – 1:00 PM\n📆 Days:       Monday to Thursday\n👥 For:        Primary & Secondary Students\n\nNote: For primary and secondary sections. Adult education and SSCE classes (WAEC, JAMB and NECO) continue as normal.\n\n──────────────────────────────\n🎓 SECONDARY SECTION\n──────────────────────────────\nSubjects Offered:\n✅ English Language (with emphasis)\n✅ Mathematics\n✅ Physics\n✅ Chemistry\n✅ Biology\n✅ Literature in English\n✅ Government …e.t.c\n✅ Introduction to Coding (HTML)\n✅ Introduction to Artificial Intelligence (AI)\n\nLESSON FEE: ₦10,000 per child\n\n──────────────────────────────\n📖 PRIMARY SECTION\n──────────────────────────────\nSubjects Offered:\n✅ English Language (with emphasis)\n✅ Interactive Mathematics (Daily)\n✅ Computer Science – Introduction to Coding\n✅ Introduction to AI Basics\n\nLESSON FEE: ₦10,000 per child\n\n──────────────────────────────\n💻 DIGITAL SKILLS\n──────────────────────────────\n✅ Front-End Development\n✅ Back-End Development\n✅ Full Web Development\n✅ Web Development\n✅ And more…\n📩 DM us for pricing and more info.\n\n──────────────────────────────\n📘 ADULT EDUCATION\n──────────────────────────────\nClasses hold TWICE every week.\nContact us for schedule and registration details.",
    hasRegistration: true,
  },
  {
    id: 1,
    tag: "Exam Update",
    date: "Aug 15, 2026",
    title: "WAEC 2026 Timetable Released",
    summary:
      "The official timetable for the upcoming 2026 WAEC examinations has been published. Make sure to download and print your copy.",
    details:
      "The West African Examinations Council (WAEC) has officially released the timetable for the 2026 Senior School Certificate Examination (SSCE) for school candidates. The exams will commence on Monday, August 17, 2026, and conclude on Friday, September 25, 2026. Students are advised to start their revisions early and utilize the Past Questions portal on our platform to familiarize themselves with the exam format.",
  },
  {
    id: 2,
    tag: "Platform Feature",
    date: "Aug 10, 2026",
    title: "New Interactive Digital Skills Modules",
    summary:
      "We've added three new interactive courses covering Basic Web Design, Data Analysis Basics, and Graphic Design Fundamentals.",
    details:
      "As part of our commitment to equipping students with 21st-century skills, St. Lawrence Next Gen Academy is thrilled to announce the addition of three new interactive modules to our Digital Skills curriculum. These include: \n\n1. Basic Web Design (HTML/CSS)\n2. Data Analysis Basics using Excel\n3. Graphic Design Fundamentals with Canva\n\nThese courses are now available for all registered students at no extra cost. Head over to the Classrooms section to enroll today!",
  },
];

/* ─────────────────────────────────────────────────────────────
   TAG COLOUR MAP
───────────────────────────────────────────────────────────── */
const TAG_COLOURS = {
  "Holiday Lessons":  { bg: "#fff7e6", color: "#b45309", border: "#fde68a" },
  "Exam Update":      { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "Platform Feature": { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
};

/* ─────────────────────────────────────────────────────────────
   REGISTRATION MODAL
───────────────────────────────────────────────────────────── */
const SECTIONS = ["Secondary", "Primary", "Adult Education", "Digital Skills"];

function RegistrationModal({ onClose }) {
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [section, setSection] = useState("Secondary");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ parentName: "", childName: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function validate() {
    const e = {};
    if (!form.parentName.trim()) e.parentName = "Required";
    if (section !== "Adult Education" && !form.childName.trim()) e.childName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1400);
  }

  const field = (name) => ({
    value: form[name],
    onChange: (e) => { setForm({ ...form, [name]: e.target.value }); setErrors({ ...errors, [name]: "" }); },
    style: {
      width: "100%", padding: "11px 14px", borderRadius: "10px",
      border: `1.5px solid ${errors[name] ? "#ef4444" : "var(--border)"}`,
      fontSize: "0.95rem", outline: "none", background: "#fafafa",
      color: "var(--navy)", boxSizing: "border-box", transition: "border-color 0.2s",
    },
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10,22,40,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: "20px",
          width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(10,22,40,0.25)",
          animation: "slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── MODAL HEADER ── */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--navy) 0%, #1a3a5c 100%)",
            padding: "28px 28px 20px", borderRadius: "20px 20px 0 0", position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: "50%", width: "32px", height: "32px",
              color: "white", fontSize: "1.1rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <img src={logoImg} alt="Logo" style={{ width: "36px", height: "36px", objectFit: "contain", background: "white", borderRadius: "50%", padding: "2px" }} />
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", margin: 0, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                St. Lawrence Next Gen Academy
              </p>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                2026 Holiday Lessons
              </h2>
            </div>
          </div>
          {/* Quick-info pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
            {[
              { icon: "📅", text: "27 Jul – 27 Aug 2026" },
              { icon: "⏰", text: "9:00 AM – 1:00 PM" },
              { icon: "📆", text: "Mon – Thu" },
              { icon: "💰", text: "₦10,000 / child" },
            ].map((pill) => (
              <span key={pill.text} style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "5px 12px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}>
                {pill.icon} {pill.text}
              </span>
            ))}
          </div>
        </div>

        {step === 2 ? (
          /* ── SUCCESS STATE ── */
          <div style={{ padding: "40px 28px", textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🎉</div>
            <h3 style={{ color: "var(--navy)", fontSize: "1.4rem", fontWeight: 800, marginBottom: "12px" }}>
              Registration Received!
            </h3>
            <p style={{ color: "var(--text-light)", lineHeight: "1.6", marginBottom: "24px" }}>
              Thank you! We've received your interest for the <strong>2026 Holiday Lessons</strong>.
              A member of our team will contact you within 24 hours to confirm your spot.
            </p>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", marginBottom: "24px", textAlign: "left" }}>
              <p style={{ margin: 0, color: "#15803d", fontWeight: 600, fontSize: "0.9rem" }}>
                📞 For immediate enquiries:
              </p>
              <p style={{ margin: "6px 0 0", color: "#166534", fontSize: "0.9rem" }}>
                Send us a DM on our social media pages or visit us at the academy.
              </p>
            </div>
            <button onClick={onClose} className="btn" style={{ width: "100%", padding: "14px", borderRadius: "12px", fontSize: "1rem", fontWeight: 700 }}>
              Done
            </button>
          </div>
        ) : (
          /* ── REGISTRATION FORM ── */
          <form onSubmit={handleSubmit} style={{ padding: "24px 28px 28px" }}>
            {/* Section Tabs */}
            <div style={{ marginBottom: "22px" }}>
              <label style={{ display: "block", fontWeight: 700, color: "var(--navy)", fontSize: "0.85rem", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Select Section
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {SECTIONS.map((s) => (
                  <button
                    key={s} type="button" onClick={() => setSection(s)}
                    style={{
                      padding: "10px 8px", borderRadius: "10px",
                      border: `2px solid ${section === s ? "var(--navy)" : "var(--border)"}`,
                      background: section === s ? "var(--navy)" : "white",
                      color: section === s ? "white" : "var(--navy)",
                      fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {s === "Secondary" && "🎓 "}
                    {s === "Primary" && "📖 "}
                    {s === "Adult Education" && "📘 "}
                    {s === "Digital Skills" && "💻 "}
                    {s}
                  </button>
                ))}
              </div>
              <p style={{ margin: "10px 0 0", fontSize: "0.82rem", color: "var(--text-light)" }}>
                {section === "Digital Skills"
                  ? "💻 Please contact us directly for Digital Skills pricing."
                  : section === "Adult Education"
                  ? "📘 Adult Education classes hold twice per week. Contact us for the schedule."
                  : `💰 Lesson fee: ₦10,000 per child for the ${section} Section.`}
              </p>
            </div>

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, color: "var(--navy)", fontSize: "0.85rem", marginBottom: "6px" }}>
                  Parent / Guardian Name *
                </label>
                <input type="text" placeholder="e.g. Mrs. Adaobi Okafor" {...field("parentName")} />
                {errors.parentName && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "4px" }}>{errors.parentName}</p>}
              </div>

              {section !== "Adult Education" && (
                <div>
                  <label style={{ display: "block", fontWeight: 600, color: "var(--navy)", fontSize: "0.85rem", marginBottom: "6px" }}>
                    Child's Full Name *
                  </label>
                  <input type="text" placeholder="e.g. Chukwuemeka Okafor" {...field("childName")} />
                  {errors.childName && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "4px" }}>{errors.childName}</p>}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontWeight: 600, color: "var(--navy)", fontSize: "0.85rem", marginBottom: "6px" }}>
                  Phone Number *
                </label>
                <input type="tel" placeholder="e.g. 08012345678" {...field("phone")} />
                {errors.phone && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "4px" }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, color: "var(--navy)", fontSize: "0.85rem", marginBottom: "6px" }}>
                  Email Address *
                </label>
                <input type="email" placeholder="e.g. parent@email.com" {...field("email")} />
                {errors.email && <p style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: "4px" }}>{errors.email}</p>}
              </div>
            </div>

            <button
              type="submit" disabled={loading} className="btn"
              style={{
                width: "100%", marginTop: "24px", padding: "14px", borderRadius: "12px",
                fontSize: "1rem", fontWeight: 700,
                opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.4)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Submitting…
                </>
              ) : (
                "📋 Register Now"
              )}
            </button>
            <p style={{ textAlign: "center", color: "var(--text-light)", fontSize: "0.78rem", marginTop: "12px" }}>
              We'll contact you within 24 hours to confirm your registration.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showRegModal, setShowRegModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    client
      .get("/news")
      .then(({ data }) => {
        const filtered = (data.news || []).filter((n) => n.tag !== "hall-of-fame");
        setNews(filtered.length > 0 ? filtered : FALLBACK_NEWS);
      })
      .catch(() => setNews(FALLBACK_NEWS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="product-homepage"
      style={{ minHeight: "100vh", background: "var(--off-white)", display: "flex", flexDirection: "column" }}
    >
      {/* ── TOP NAV ── */}
      <nav className="nav internal-page-nav" style={{ padding: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
          <Link to="/" className="nav-logo">
            <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
            <div>
              <div className="nav-brand-name">ST. LAWRENCE</div>
              <div className="nav-brand-sub hide-on-mobile">NEXT GEN ACADEMY</div>
            </div>
          </Link>
          <div className="internal-page-actions" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link to="/login" style={{ color: "var(--navy)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Log In</Link>
            <Link to="/register" className="nav-cta">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="wrap" style={{ flex: 1, padding: "60px 20px", maxWidth: "900px", width: "100%", overflowX: "hidden" }}>
        <div style={{ marginBottom: "40px" }}>
          <Link to="/" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "var(--navy)", marginTop: "16px", marginBottom: "8px", wordBreak: "break-word" }}>
            News &amp; Announcements
          </h1>
          <p style={{ color: "var(--text-light)", fontSize: "1.1rem" }}>
            Current news, important updates, and general information for students.
          </p>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-light)", textAlign: "center", padding: "40px" }}>Loading announcements…</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {news.map((item) => {
              const tagStyle = TAG_COLOURS[item.tag] || { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
              const isExpanded = selectedNews === item.id;
              const isHoliday = item.tag === "Holiday Lessons" || (item.title && item.title.toLowerCase().includes("holiday lessons"));

              return (
                <article
                  key={item.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: isHoliday ? "2px solid #fbbf24" : "1px solid var(--border)",
                    boxShadow: isHoliday ? "0 4px 24px rgba(251,191,36,0.15)" : "var(--shadow-sm)",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* Featured banner – only for Holiday Lessons */}
                  {isHoliday && (
                    <div
                      style={{
                        background: "linear-gradient(90deg, var(--navy) 0%, #1a3a5c 100%)",
                        padding: "8px 20px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        flexWrap: "wrap", gap: "6px",
                      }}
                    >
                      <span style={{ color: "#fbbf24", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        🔥 Featured Announcement
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>
                        📅 27 Jul – 27 Aug 2026 &nbsp;|&nbsp; ⏰ 9:00 AM – 1:00 PM &nbsp;|&nbsp; 📆 Mon–Thu
                      </span>
                    </div>
                  )}

                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Meta row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: tagStyle.bg, color: tagStyle.color,
                          border: `1px solid ${tagStyle.border}`,
                          padding: "4px 12px", borderRadius: "20px",
                          fontSize: "0.75rem", fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: "0.06em",
                        }}
                      >
                        {item.tag}
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                        {new Date(item.date || item.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 style={{ fontSize: "1.35rem", color: "var(--navy)", margin: 0, lineHeight: "1.3" }}>
                      {item.title}
                    </h2>

                    {/* Expanded details */}
                    {isExpanded ? (
                      <div>
                        <p style={{ color: "var(--text)", lineHeight: "1.75", whiteSpace: "pre-line", margin: 0 }}>
                          {item.details}
                        </p>
                        <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
                          {isHoliday && (
                            <button
                              onClick={() => setShowRegModal(true)}
                              style={{
                                padding: "12px 28px", borderRadius: "10px",
                                fontWeight: 800, fontSize: "0.95rem",
                                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                border: "none", color: "white", cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(217,119,6,0.35)",
                                display: "flex", alignItems: "center", gap: "8px",
                              }}
                            >
                              📋 Register Now
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedNews(null)}
                            style={{
                              background: "transparent", border: "1.5px solid var(--border)",
                              color: "var(--navy)", padding: "12px 20px", borderRadius: "10px",
                              fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
                            }}
                          >
                            Hide Details
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p style={{ color: "var(--text-light)", lineHeight: "1.6", margin: 0 }}>
                          {item.summary}
                        </p>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                          <button
                            onClick={() => setSelectedNews(item.id)}
                            style={{
                              background: "transparent", border: "1.5px solid var(--border)",
                              color: "var(--navy)", padding: "10px 18px", borderRadius: "10px",
                              fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            Read More →
                          </button>
                          {isHoliday && (
                            <button
                              onClick={() => setShowRegModal(true)}
                              style={{
                                padding: "10px 22px", borderRadius: "10px",
                                fontWeight: 800, fontSize: "0.9rem",
                                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                border: "none", color: "white", cursor: "pointer",
                                boxShadow: "0 3px 10px rgba(217,119,6,0.3)",
                              }}
                            >
                              📋 Register Now
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "32px", textAlign: "center", borderTop: "1px solid var(--border)", color: "var(--text-light)", fontSize: "0.85rem", marginTop: "40px" }}>
        © {new Date().getFullYear()} St. Lawrence Next Gen Academy. All rights reserved.
      </footer>

      {/* ── REGISTRATION MODAL ── */}
      {showRegModal && <RegistrationModal onClose={() => setShowRegModal(false)} />}

      {/* ── ANIMATIONS ── */}
      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spin    { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
