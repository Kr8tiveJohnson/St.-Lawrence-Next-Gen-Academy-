import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

const CLASS_FILTERS = ["All", "JSS 1-3", "SSS 1-3", "JAMB/WAEC"];
const TYPE_FILTERS = ["All", "PDF", "NOTE", "WORKSHEET", "REVISION", "GUIDE"];
const SUBJECT_FILTERS = ["All", "Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Economics"];

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [search, setSearch] = useState("");

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedClass !== "All") params.targetClass = selectedClass;
      if (selectedType !== "All") params.resourceType = selectedType;
      if (selectedSubject !== "All") params.subject = selectedSubject;
      if (search.trim()) params.search = search.trim();

      const res = await client.get("/resources", { params });
      setResources(res.data.resources || []);
    } catch (err) {
      console.error("fetchResources error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedClass, selectedType, selectedSubject]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleDownload = async (resItem) => {
    try {
      await client.get(`/resources/${resItem.id}`);
      // Update local download count
      setResources((prev) =>
        prev.map((r) =>
          r.id === resItem.id ? { ...r, downloadsCount: (r.downloadsCount || 0) + 1 } : r
        )
      );
      // Open resource link
      window.open(resItem.fileUrl, "_blank", "noopener,noreferrer");
    } catch {
      window.open(resItem.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div style={{ background: "var(--off-white)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── TOP NAVIGATION ────────────────────────────────────────── */}
      <header style={{ background: "#ffffff", borderBottom: "1px solid var(--border)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src={logoImg} alt="St. Lawrence Logo" style={{ height: 38, width: "auto" }} />
            <div>
              <div style={{ fontFamily: "var(--font-h)", fontWeight: 900, fontSize: "1.05rem", color: "var(--navy)", lineHeight: 1.1 }}>
                ST. LAWRENCE
              </div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold)", letterSpacing: "0.08em" }}>
                LEARNING RESOURCES CENTRE
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link to="/cbt" style={{ color: "var(--text-2)", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
              CBT Exams
            </Link>
            <Link to="/tips" style={{ color: "var(--text-2)", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
              TIPS Recall
            </Link>
            <Link to="/profile" style={{ padding: "8px 16px", background: "var(--navy)", color: "#ffffff", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.82rem" }}>
              My Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN BODY ─────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px 20px", maxWidth: 1240, width: "100%", margin: "0 auto" }}>
        {/* Banner */}
        <div style={{
          background: "linear-gradient(135deg, var(--navy), #152c59)",
          borderRadius: 24,
          padding: "40px 36px",
          color: "#ffffff",
          marginBottom: 32,
          boxShadow: "0 14px 36px rgba(16, 28, 68, 0.1)"
        }}>
          <div style={{ display: "inline-block", background: "rgba(223, 169, 33, 0.2)", color: "var(--gold-bright)", padding: "4px 14px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>
            Syllabus Material & Study Library
          </div>
          <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 900, margin: "0 0 12px" }}>
            Educational Resource Library
          </h1>
          <p style={{ maxWidth: 680, color: "rgba(255, 255, 255, 0.85)", fontSize: "0.98rem", lineHeight: 1.6, margin: 0 }}>
            Official teacher notes, comprehensive formula sheets, revision summaries, and structured past-question worksheets verified by St. Lawrence academic coordinators.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ background: "#ffffff", borderRadius: 20, padding: "22px 26px", border: "1px solid var(--border)", marginBottom: 30, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {/* Class Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 6 }}>
                Class / Level
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.88rem", fontWeight: 700, color: "var(--navy)", background: "#ffffff" }}
              >
                {CLASS_FILTERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 6 }}>
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.88rem", fontWeight: 700, color: "var(--navy)", background: "#ffffff" }}
              >
                {SUBJECT_FILTERS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 6 }}>
                Resource Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.88rem", fontWeight: 700, color: "var(--navy)", background: "#ffffff" }}
              >
                {TYPE_FILTERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Search */}
            <div>
              <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 6 }}>
                Search Title / Topic
              </label>
              <form onSubmit={handleSearch} style={{ display: "flex", gap: 6 }}>
                <input
                  type="text"
                  placeholder="e.g. Formula, Concord..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.88rem", outline: "none" }}
                />
                <button
                  type="submit"
                  style={{ padding: "9px 14px", background: "var(--navy)", color: "#ffffff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Resource Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-3)" }}>
            Loading study resources from academy repository...
          </div>
        ) : resources.length === 0 ? (
          <div style={{ background: "#ffffff", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📚</div>
            <h3 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 8px" }}>No Resources Found</h3>
            <p style={{ color: "var(--text-2)", fontSize: "0.9rem", margin: "0 0 16px" }}>
              No study materials matched your selected filter criteria.
            </p>
            <button
              onClick={() => { setSelectedClass("All"); setSelectedSubject("All"); setSelectedType("All"); setSearch(""); }}
              style={{ padding: "8px 18px", background: "var(--navy)", color: "#ffffff", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {resources.map((resItem) => {
              const typeColors = {
                PDF: { bg: "#fee2e2", text: "#b91c1c" },
                NOTE: { bg: "#dbeafe", text: "#1d4ed8" },
                WORKSHEET: { bg: "#fef3c7", text: "#b45309" },
                REVISION: { bg: "#dcfce7", text: "#15803d" },
                GUIDE: { bg: "#f3e8ff", text: "#7e22ce" },
              };
              const tagStyle = typeColors[resItem.resourceType] || { bg: "#f1f5f9", text: "var(--navy)" };

              return (
                <div
                  key={resItem.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: "24px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 16
                  }}
                >
                  <div>
                    {/* Tags */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ background: tagStyle.bg, color: tagStyle.text, padding: "3px 10px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                        {resItem.resourceType}
                      </span>
                      <span style={{ fontSize: "0.74rem", color: "var(--text-3)", fontWeight: 700 }}>
                        {resItem.subject}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", margin: "0 0 8px", lineHeight: 1.35 }}>
                      {resItem.title}
                    </h3>

                    {/* Target Class Pill */}
                    <div style={{ display: "inline-block", background: "rgba(16,28,68,0.05)", color: "var(--navy)", padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700, marginBottom: 12 }}>
                      Target: {resItem.targetClass || "All Levels"}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.55, margin: 0 }}>
                      {resItem.description || "No description provided for this study resource."}
                    </p>
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                    <span style={{ fontSize: "0.76rem", color: "var(--text-3)", fontWeight: 600 }}>
                      📥 {resItem.downloadsCount || 0} downloads
                    </span>

                    <button
                      onClick={() => handleDownload(resItem)}
                      style={{
                        padding: "8px 16px",
                        background: "var(--navy)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      Download / Open ↗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
