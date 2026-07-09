import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

const MOCK_EXAM_DATA = {
  question: "Evaluate log base 2 of 8 plus log base 3 of 9.",
  options: ["A. 4", "B. 5", "C. 6", "D. 3"],
  correctIndex: 1,
  explanation:
    "log₂(8) = 3 (since 2³ = 8) and log₃(9) = 2 (since 3² = 9). 3 + 2 = 5.",
  subject: "Mathematics",
  exam: "JAMB",
  year: "2023",
};

export default function PastQuestionsPage() {
  const [isExamMode, setIsExamMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 45); // 45 minutes

  const [examType, setExamType] = useState("JAMB");
  const [subject, setSubject] = useState("Mathematics");

  useEffect(() => {
    let timer;
    if (isExamMode && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isExamMode, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelectOption = (index) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowExplanation(true);
      if (!isExamMode) {
        // In practice mode, we just show the explanation
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div
      className="page-wrapper product-internal-page exam-page"
      style={{ background: "var(--off-white)", minHeight: "100vh" }}
    >
      {/* NAV BAR */}
      <nav
        className="nav internal-page-nav exam-nav"
        style={{
          position: "sticky",
          top: 0,
          borderRadius: 0,
          borderBottom: "1px solid var(--border)",
          zIndex: 100,
        }}
      >
        <Link to="/" className="nav-logo">
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
          <div>
            <div className="nav-brand-name">ST. LAWRENCE</div>
            <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
          </div>
        </Link>
        <div
          className="internal-page-actions exam-nav-actions"
          style={{ display: "flex", gap: "16px", alignItems: "center" }}
        >
          {isExamMode && (
            <div
              className="exam-timer"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#dc2626",
                padding: "6px 16px",
                borderRadius: "var(--r-full)",
                fontWeight: 800,
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#dc2626",
                  animation: "blink 1.5s infinite",
                }}
              />
              {formatTime(timeLeft)}
            </div>
          )}
          <Link
            to="/classrooms"
            className="btn-ghost"
            style={{ padding: "8px 16px", fontSize: "0.8rem" }}
          >
            Exit Exam Center
          </Link>
        </div>
      </nav>

      <div
        className="wrap exam-wrap"
        style={{
          paddingTop: "60px",
          paddingBottom: "100px",
          maxWidth: "900px",
        }}
      >
        {!isExamMode && !showExplanation && selectedAnswer === null ? (
          // SETUP SCREEN
          <div
            className="exam-setup-card"
            style={{
              background: "var(--white)",
              borderRadius: "var(--r-xl)",
              padding: "40px",
              border: "1px solid var(--border)",
              boxShadow: "0 12px 32px rgba(0,0,0,0.03)",
              textAlign: "center",
            }}
          >
            <div
              className="portal-eyebrow"
              style={{ marginInline: "auto", marginBottom: "16px" }}
            >
              Practice & Timed CBT
            </div>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⏱️</div>
            <h1
              className="hero-h1"
              style={{
                fontSize: "2.5rem",
                marginBottom: "12px",
                marginInline: "auto",
              }}
            >
              Mock Exam Center
            </h1>
            <p
              className="hero-desc"
              style={{ marginInline: "auto", marginBottom: "40px" }}
            >
              Configure your practice session. Choose your exam body, subject,
              and mode.
            </p>

            <div
              className="exam-setup-grid"
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                marginBottom: "40px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ textAlign: "left", width: "100%", maxWidth: "240px" }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text-3)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Exam Body
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    outline: "none",
                    fontSize: "1rem",
                    fontFamily: "var(--font-b)",
                    cursor: "pointer",
                    background: "var(--off-white)",
                  }}
                >
                  <option>JAMB</option>
                  <option>WAEC</option>
                  <option>NECO</option>
                </select>
              </div>
              <div
                style={{ textAlign: "left", width: "100%", maxWidth: "240px" }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text-3)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    outline: "none",
                    fontSize: "1rem",
                    fontFamily: "var(--font-b)",
                    cursor: "pointer",
                    background: "var(--off-white)",
                  }}
                >
                  <option>Mathematics</option>
                  <option>Use of English</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                </select>
              </div>
            </div>

            <div
              className="exam-setup-actions"
              style={{ display: "flex", gap: "16px", justifyContent: "center" }}
            >
              <button
                className="btn-ghost"
                onClick={() => setIsExamMode(false)}
              >
                Practice Mode
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setIsExamMode(true);
                  setTimeLeft(60 * 45);
                }}
              >
                Start Timed Exam
              </button>
            </div>
          </div>
        ) : (
          // EXAM / PRACTICE SCREEN
          <div>
            <div
              className="exam-meta-bar"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div
                className="exam-meta-badges"
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <div
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    color: "#2563eb",
                    padding: "6px 14px",
                    borderRadius: "var(--r-full)",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                  }}
                >
                  {MOCK_EXAM_DATA.exam}
                </div>
                <div
                  style={{
                    background: "rgba(212,168,83,0.15)",
                    color: "#b45309",
                    padding: "6px 14px",
                    borderRadius: "var(--r-full)",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                  }}
                >
                  {MOCK_EXAM_DATA.subject}
                </div>
                <div
                  style={{
                    color: "var(--text-3)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Year {MOCK_EXAM_DATA.year}
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "var(--text-2)",
                }}
              >
                Question 1 of 40
              </div>
            </div>

            <div
              className="exam-question-card"
              style={{
                background: "var(--white)",
                borderRadius: "var(--r-xl)",
                padding: "40px",
                border: "1px solid var(--border)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.03)",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "var(--navy)",
                  lineHeight: 1.6,
                  marginBottom: "32px",
                }}
              >
                {MOCK_EXAM_DATA.question}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {MOCK_EXAM_DATA.options.map((opt, i) => {
                  let isSelected = selectedAnswer === i;
                  let isCorrect =
                    showExplanation && i === MOCK_EXAM_DATA.correctIndex;
                  let isWrongSelection =
                    showExplanation && isSelected && !isCorrect;

                  let bg = "var(--off-white)";
                  let border = "1px solid var(--border)";
                  let color = "var(--text)";

                  if (isSelected) {
                    bg = "rgba(59,130,246,0.05)";
                    border = "1px solid #3b82f6";
                  }
                  if (isCorrect) {
                    bg = "rgba(34,197,94,0.1)";
                    border = "1px solid #22c55e";
                    color = "#16a34a";
                  }
                  if (isWrongSelection) {
                    bg = "rgba(239,68,68,0.08)";
                    border = "1px solid #ef4444";
                    color = "#dc2626";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      style={{
                        padding: "16px 24px",
                        borderRadius: "16px",
                        border,
                        background: bg,
                        color,
                        fontSize: "1.05rem",
                        fontWeight: isSelected || showExplanation ? 700 : 500,
                        textAlign: "left",
                        cursor: showExplanation ? "default" : "pointer",
                        transition: "var(--trans)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{opt}</span>
                      {isCorrect && <span>✅</span>}
                      {isWrongSelection && <span>❌</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EXPLANATION POPUP */}
            {showExplanation && (
              <div
                className="exam-explanation-card"
                style={{
                  background: "rgba(34,197,94,0.05)",
                  borderRadius: "var(--r-xl)",
                  padding: "24px",
                  border: "1px solid rgba(34,197,94,0.2)",
                  marginBottom: "24px",
                  animation: "slide-up 0.4s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#16a34a",
                    fontWeight: 800,
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  <span>💡</span> Explanation
                </div>
                <p
                  style={{
                    color: "var(--text)",
                    lineHeight: 1.6,
                    fontSize: "1rem",
                  }}
                >
                  {MOCK_EXAM_DATA.explanation}
                </p>
              </div>
            )}

            <div
              className="exam-footer-actions"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                className="btn-ghost"
                onClick={() => {
                  setIsExamMode(false);
                  setShowExplanation(false);
                  setSelectedAnswer(null);
                }}
              >
                End Session
              </button>

              {!showExplanation ? (
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  style={{ opacity: selectedAnswer === null ? 0.5 : 1 }}
                >
                  Submit Answer
                </button>
              ) : (
                <button className="btn-primary" onClick={handleNext}>
                  Next Question →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
