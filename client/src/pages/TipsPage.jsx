import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

const SUBJECT_TABS = [
  "All",
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
];

export default function TipsPage() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRecallAnswers, setActiveRecallAnswers] = useState({}); // { [tipId]: chosenAnswer }

  const fetchTips = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeSubject !== "All") params.subject = activeSubject;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await client.get("/tips", { params });
      setTips(res.data.tips || []);
    } catch (err) {
      console.error("fetchTips error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, [activeSubject]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTips();
  };

  const handleRecallPick = (tipId, option) => {
    setActiveRecallAnswers((prev) => ({
      ...prev,
      [tipId]: option,
    }));
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
                TIPS LEARNING & RECALL
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link to="/cbt" style={{ color: "var(--text-2)", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
              CBT Exams
            </Link>
            <Link to="/resources" style={{ color: "var(--text-2)", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
              Resources
            </Link>
            <Link to="/profile" style={{ padding: "8px 16px", background: "var(--navy)", color: "#ffffff", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.82rem" }}>
              My Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "40px 20px", maxWidth: 1240, width: "100%", margin: "0 auto" }}>
        {/* Banner */}
        <div style={{
          background: "linear-gradient(135deg, var(--navy), #173266)",
          borderRadius: 24,
          padding: "44px 36px",
          color: "#ffffff",
          marginBottom: 36,
          boxShadow: "0 14px 36px rgba(16, 28, 68, 0.12)"
        }}>
          <div style={{ display: "inline-block", background: "rgba(223, 169, 33, 0.2)", color: "var(--gold-bright)", padding: "4px 14px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", marginBottom: 14 }}>
            Academy Quick-Learning Initiative
          </div>
          <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 900, lineHeight: 1.2, margin: "0 0 14px" }}>
            TIPS: High-Yield Memory & Quick Recall
          </h1>
          <p style={{ maxWidth: 720, color: "rgba(255, 255, 255, 0.85)", fontSize: "1rem", lineHeight: 1.65, margin: 0 }}>
            Master difficult WAEC & JAMB topics in minutes. Each TIP delivers the core idea, a proven memory trick or mnemonic, the essential mathematical formula or rule, common mistakes to avoid, and a quick self-check.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          {/* Subject Tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SUBJECT_TABS.map((subj) => {
              const active = activeSubject === subj;
              return (
                <button
                  key={subj}
                  onClick={() => setActiveSubject(subj)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 12,
                    border: active ? "1px solid var(--navy)" : "1px solid var(--border)",
                    background: active ? "var(--navy)" : "#ffffff",
                    color: active ? "#ffffff" : "var(--text-2)",
                    fontWeight: active ? 800 : 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                >
                  {subj}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, minWidth: 260 }}>
            <input
              type="text"
              placeholder="Search trick, formula, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                fontSize: "0.88rem",
                outline: "none",
                background: "#ffffff"
              }}
            />
            <button
              type="submit"
              style={{
                padding: "9px 16px",
                background: "var(--navy)",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer"
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-3)" }}>
            Loading TIPS lessons from academy database...
          </div>
        ) : tips.length === 0 ? (
          <div style={{ background: "#ffffff", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>💡</div>
            <h3 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 8px" }}>No TIPS Found</h3>
            <p style={{ color: "var(--text-2)", fontSize: "0.9rem", margin: "0 0 16px" }}>
              No TIPS matched your selected subject or search query.
            </p>
            <button
              onClick={() => { setActiveSubject("All"); setSearchQuery(""); }}
              style={{ padding: "8px 18px", background: "var(--navy)", color: "#ffffff", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* TIPS Grid */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
            {tips.map((tip) => {
              const recall = tip.quickRecall;
              const chosen = activeRecallAnswers[tip.id];
              const isCorrect = chosen && recall?.answer && chosen.trim().toLowerCase() === recall.answer.trim().toLowerCase();

              return (
                <div
                  key={tip.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: "26px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16
                  }}
                >
                  {/* Category & Subject Tag */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ background: "rgba(16, 28, 68, 0.06)", color: "var(--navy)", padding: "3px 10px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                      {tip.subject}
                    </span>
                    <span style={{ fontSize: "0.74rem", color: "var(--text-3)", fontWeight: 700 }}>
                      {tip.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 900, color: "var(--navy)", margin: 0, lineHeight: 1.3 }}>
                    {tip.title}
                  </h3>

                  {/* Key Idea & Explanation */}
                  <div style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--navy)" }}>Key Idea: </strong>
                    {tip.keyIdea}
                    <div style={{ marginTop: 8, color: "var(--text-2)", fontSize: "0.86rem" }}>
                      {tip.explanation}
                    </div>
                  </div>

                  {/* Memory Trick / Mnemonic (Gold Highlight) */}
                  {tip.memoryTrick && (
                    <div style={{ background: "#fef9c3", borderLeft: "4px solid #ca8a04", padding: "12px 14px", borderRadius: 10 }}>
                      <div style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", color: "#854d0e", marginBottom: 3 }}>
                        🧠 Memory Trick / Mnemonic:
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#713f12", fontWeight: 700, lineHeight: 1.4 }}>
                        {tip.memoryTrick}
                      </div>
                    </div>
                  )}

                  {/* Formula or Rule (Clean Slate Box) */}
                  {tip.formulaOrRule && (
                    <div style={{ background: "#f8fafc", border: "1px solid var(--border)", padding: "12px 14px", borderRadius: 10 }}>
                      <div style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 3 }}>
                        📐 Essential Rule / Formula:
                      </div>
                      <div style={{ fontSize: "0.85rem", fontFamily: "monospace", color: "var(--navy)", fontWeight: 700 }}>
                        {tip.formulaOrRule}
                      </div>
                    </div>
                  )}

                  {/* Common Mistake (Soft Red Box) */}
                  {tip.commonMistake && (
                    <div style={{ background: "#fef2f2", borderLeft: "4px solid #ef4444", padding: "12px 14px", borderRadius: 10 }}>
                      <div style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", color: "#991b1b", marginBottom: 3 }}>
                        ⚠️ Common Pitfall & Mistake:
                      </div>
                      <div style={{ fontSize: "0.83rem", color: "#7f1d1d", lineHeight: 1.4 }}>
                        {tip.commonMistake}
                      </div>
                    </div>
                  )}

                  {/* Interactive Quick Recall Test */}
                  {recall && recall.question && (
                    <div style={{ background: "#f1f5f9", padding: "14px 16px", borderRadius: 12, marginTop: "auto" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 6 }}>
                        🎯 Quick Self-Check:
                      </div>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--navy)", marginBottom: 10, lineHeight: 1.4 }}>
                        {recall.question}
                      </div>

                      {/* Options */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {Array.isArray(recall.options) && recall.options.map((opt) => {
                          const isPicked = chosen === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => handleRecallPick(tip.id, opt)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 8,
                                border: isPicked ? "2px solid var(--navy)" : "1px solid #cbd5e1",
                                background: isPicked ? "var(--navy)" : "#ffffff",
                                color: isPicked ? "#ffffff" : "var(--navy)",
                                fontWeight: 700,
                                fontSize: "0.78rem",
                                cursor: "pointer",
                                textAlign: "left"
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback */}
                      {chosen && (
                        <div style={{
                          marginTop: 8,
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          color: isCorrect ? "#16a34a" : "#dc2626"
                        }}>
                          {isCorrect ? "✓ Correct! Great recall." : `✗ Correct answer is: ${recall.answer}`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
