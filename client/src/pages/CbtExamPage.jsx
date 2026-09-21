import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

const EXAM_TYPES = [
  { id: "JAMB", label: "JAMB UTME", desc: "Unified Tertiary Matriculation Examination style practice" },
  { id: "WAEC", label: "WAEC SSCE", desc: "West African Senior School Certificate Examination questions" },
  { id: "NECO", label: "NECO SSCE", desc: "National Examinations Council syllabus testing" },
  { id: "INTERNAL", label: "Academy Mocks", desc: "Termly progress assessments by St. Lawrence teachers" },
];

const SUBJECTS = [
  "Mathematics",
  "English Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
];

export default function CbtExamPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // ── Auth Guard ─────────────────────────────────────────────────
  // Redirect unauthenticated visitors to the login page.
  // After login, they are sent back to /cbt via the redirect param.
  useEffect(() => {
    if (!authLoading && !user) {
      // Check for a raw token as fallback (for users who were previously logged in)
      const rawToken = localStorage.getItem("token");
      if (!rawToken) {
        navigate("/login?redirect=/cbt", { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  // Mode: "setup" | "active" | "results"
  const [mode, setMode] = useState("setup");

  // Setup Form
  const [examType, setExamType] = useState("JAMB");
  const [subject, setSubject] = useState("Mathematics");
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [loading, setLoading] = useState(false);
  const [setupError, setSetupError] = useState("");

  // Active Exam State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: chosenOption }
  const [flagged, setFlagged] = useState(new Set()); // Set of question IDs marked for review
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Results State
  const [resultData, setResultData] = useState(null);

  // Timer Ref
  const timerRef = useRef(null);

  // Show nothing while auth is resolving to prevent flash
  if (authLoading) return null;
  if (!user && !localStorage.getItem("token")) return null;


  // ── Start Exam Handler ──────────────────────────────────────────
  const handleStartExam = async (e) => {
    e.preventDefault();
    setSetupError("");
    setLoading(true);

    try {
      const res = await client.post("/cbt/exam/start", {
        examType,
        subject,
        questionCount: parseInt(questionCount),
        durationMinutes: parseInt(durationMinutes),
      });

      if (!res.data.questions || res.data.questions.length === 0) {
        setSetupError("No questions found for this selection. Please pick another subject or exam.");
        setLoading(false);
        return;
      }

      const totalSec = (res.data.durationMinutes || durationMinutes) * 60;
      setQuestions(res.data.questions);
      setCurrentIndex(0);
      setAnswers({});
      setFlagged(new Set());
      setSecondsRemaining(totalSec);
      setTotalSeconds(totalSec);
      setMode("active");
    } catch (err) {
      setSetupError(err.response?.data?.error || "Failed to start CBT session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Live Countdown Timer ────────────────────────────────────────
  useEffect(() => {
    if (mode === "active") {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Auto submit when time runs out
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode]);

  // ── Option Select & Navigation ──────────────────────────────────
  const currentQuestion = questions[currentIndex] || null;

  const handleSelectOption = (optionId) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleClearAnswer = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  };

  // ── Submit Exam ─────────────────────────────────────────────────
  const handleSubmitExam = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowSubmitModal(false);
    setSubmitting(true);

    const timeSpent = Math.max(0, totalSeconds - secondsRemaining);

    try {
      const res = await client.post("/cbt/exam/submit", {
        examType,
        subject,
        timeSpentSeconds: timeSpent,
        answers,
      });

      setResultData(res.data);
      setMode("results");
    } catch (err) {
      alert(err.response?.data?.error || "Error grading exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Format Seconds ──────────────────────────────────────────────
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, questions.length - answeredCount);

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
                CBT EXAMINATION PLATFORM
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {mode === "active" ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: secondsRemaining < 180 ? "#fee2e2" : "rgba(16, 28, 68, 0.06)",
                padding: "8px 16px",
                borderRadius: 12,
                border: secondsRemaining < 180 ? "1px solid #ef4444" : "1px solid var(--border)",
                color: secondsRemaining < 180 ? "#dc2626" : "var(--navy)",
                fontWeight: 800,
                fontSize: "1.05rem",
                fontFamily: "monospace"
              }}>
                <span>⏱️</span>
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            ) : (
              <>
                <Link to="/tips" style={{ color: "var(--text-2)", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
                  TIPS Recall
                </Link>
                <Link to="/resources" style={{ color: "var(--text-2)", textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
                  Resources
                </Link>
                <Link to="/profile" style={{ padding: "8px 16px", background: "var(--navy)", color: "#ffffff", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.82rem" }}>
                  My Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── PAGE CONTENT ──────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "36px 20px", maxWidth: 1240, width: "100%", margin: "0 auto" }}>

        {/* ══════════════════════════════════════════════════════════
            MODE 1: SETUP SCREEN
           ══════════════════════════════════════════════════════════ */}
        {mode === "setup" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 680px) 1fr", gap: 32, alignItems: "start" }}>
            {/* Left Card: Configuration Form */}
            <div style={{ background: "#ffffff", borderRadius: 24, padding: "36px", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--gold-dim)", color: "var(--navy)", padding: "4px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", marginBottom: 12 }}>
                Computer Based Test Engine
              </div>
              <h1 style={{ fontFamily: "var(--font-h)", fontSize: "2rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 10px" }}>
                Start CBT Practice Examination
              </h1>
              <p style={{ color: "var(--text-2)", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 28px" }}>
                Select your target examination, preferred subject, and question load. Questions are fetched live from our central question bank.
              </p>

              {setupError && (
                <div style={{ background: "#fee2e2", border: "1px solid #f87171", borderRadius: 12, padding: "12px 16px", color: "#b91c1c", fontSize: "0.88rem", fontWeight: 600, marginBottom: 20 }}>
                  ⚠️ {setupError}
                </div>
              )}

              <form onSubmit={handleStartExam} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {/* Exam Body Selection */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 8 }}>
                    1. Select Examination Body
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                    {EXAM_TYPES.map((type) => {
                      const selected = examType === type.id;
                      return (
                        <div
                          key={type.id}
                          onClick={() => setExamType(type.id)}
                          style={{
                            padding: "14px",
                            borderRadius: 14,
                            border: selected ? "2px solid var(--navy)" : "1px solid var(--border)",
                            background: selected ? "rgba(16, 28, 68, 0.04)" : "#ffffff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.92rem", marginBottom: 4 }}>
                            {type.label}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-3)", lineHeight: 1.3 }}>
                            {type.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subject Selection */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 8 }}>
                    2. Select Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1px solid var(--border)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--navy)",
                      background: "#ffffff",
                      outline: "none"
                    }}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Configuration: Questions & Duration */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 8 }}>
                      Questions
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "var(--navy)",
                        background: "#ffffff"
                      }}
                    >
                      <option value={5}>5 Questions (Quick)</option>
                      <option value={10}>10 Questions (Standard)</option>
                      <option value={15}>15 Questions (Intensive)</option>
                      <option value={20}>20 Questions (Full Drill)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 8 }}>
                      Time Allocated
                    </label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "var(--navy)",
                        background: "#ffffff"
                      }}
                    >
                      <option value={10}>10 Minutes</option>
                      <option value={15}>15 Minutes</option>
                      <option value={20}>20 Minutes</option>
                      <option value={30}>30 Minutes</option>
                    </select>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: 8,
                    padding: "16px 28px",
                    background: "var(--navy)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: 14,
                    fontWeight: 800,
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 8px 20px rgba(16, 28, 68, 0.2)",
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? "Generating Examination..." : "Begin Examination →"}
                </button>
              </form>
            </div>

            {/* Right Card: Exam Instructions & Rules */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#ffffff", borderRadius: 24, padding: "30px", border: "1px solid var(--border)" }}>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)", margin: "0 0 16px" }}>
                  📋 Examination Instructions
                </h3>
                <ul style={{ paddingLeft: 20, color: "var(--text-2)", fontSize: "0.88rem", lineHeight: 1.8, margin: 0 }}>
                  <li><strong>Countdown Timer:</strong> Your examination starts immediately when you click <em>Begin Examination</em>.</li>
                  <li><strong>Question Navigation:</strong> Use <strong>Next</strong> and <strong>Previous</strong> or click any question number on the right palette.</li>
                  <li><strong>Flag for Review:</strong> You can mark challenging questions with the flag button to revisit them before final submission.</li>
                  <li><strong>Instant Auto-Grading:</strong> After submission, you will receive an analytical score card, question breakdown, and detailed explanatory notes.</li>
                  <li><strong>History Tracking:</strong> If logged into your student account, this test is saved to your personal progress dashboard.</li>
                </ul>
              </div>

              <div style={{ background: "linear-gradient(135deg, var(--navy), #1e3a7a)", borderRadius: 24, padding: "26px", color: "#ffffff" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>💡</div>
                <h4 style={{ fontFamily: "var(--font-h)", fontSize: "1.1rem", fontWeight: 800, margin: "0 0 8px" }}>
                  Pro Exam Tip
                </h4>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
                  Answer the easy questions first. Flag questions requiring lengthy calculation and return to them in the last 5 minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            MODE 2: ACTIVE EXAMINATION
           ══════════════════════════════════════════════════════════ */}
        {mode === "active" && currentQuestion && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}>
            {/* Left: Active Question Card */}
            <div style={{ background: "#ffffff", borderRadius: 24, padding: "32px", border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
              {/* Question Meta Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: "var(--navy)", color: "#ffffff", padding: "4px 12px", borderRadius: 8, fontWeight: 800, fontSize: "0.85rem" }}>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-3)", fontWeight: 700 }}>
                    {currentQuestion.topic || subject}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={toggleFlag}
                    style={{
                      background: flagged.has(currentQuestion.id) ? "#fef3c7" : "#f1f5f9",
                      color: flagged.has(currentQuestion.id) ? "#b45309" : "var(--text-2)",
                      border: "none",
                      borderRadius: 10,
                      padding: "6px 14px",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    🚩 {flagged.has(currentQuestion.id) ? "Flagged for Review" : "Flag Question"}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--navy)", lineHeight: 1.6, marginBottom: 28 }}>
                {currentQuestion.questionText}
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {Array.isArray(currentQuestion.options) && currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "16px 20px",
                        borderRadius: 14,
                        border: isSelected ? "2px solid var(--navy)" : "1px solid var(--border)",
                        background: isSelected ? "rgba(16, 28, 68, 0.05)" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: isSelected ? "var(--navy)" : "#f1f5f9",
                          color: isSelected ? "var(--gold)" : "var(--navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          flexShrink: 0
                        }}
                      >
                        {opt.id}
                      </div>
                      <div style={{ fontSize: "0.98rem", color: "var(--navy)", fontWeight: isSelected ? 700 : 500, lineHeight: 1.4 }}>
                        {opt.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Toolbar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      background: "#ffffff",
                      color: "var(--navy)",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                      opacity: currentIndex === 0 ? 0.4 : 1
                    }}
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={handleClearAnswer}
                    disabled={!answers[currentQuestion.id]}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      background: "#ffffff",
                      color: "#dc2626",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: !answers[currentQuestion.id] ? "not-allowed" : "pointer",
                      opacity: !answers[currentQuestion.id] ? 0.4 : 1
                    }}
                  >
                    Clear Choice
                  </button>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 10,
                        border: "none",
                        background: "var(--navy)",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "0.88rem",
                        cursor: "pointer"
                      }}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      style={{
                        padding: "10px 22px",
                        borderRadius: 10,
                        border: "none",
                        background: "#16a34a",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "0.88rem",
                        cursor: "pointer"
                      }}
                    >
                      Finish Exam ✓
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Question Palette Grid */}
            <div style={{ background: "#ffffff", borderRadius: 24, padding: "24px", border: "1px solid var(--border)", position: "sticky", top: 88 }}>
              <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.95rem", marginBottom: 14 }}>
                Question Palette ({questions.length})
              </div>

              {/* Grid of question buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 20 }}>
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = !!answers[q.id];
                  const isFlagged = flagged.has(q.id);

                  let bg = "#f1f5f9";
                  let color = "var(--navy)";
                  let border = "1px solid transparent";

                  if (isFlagged) {
                    bg = "#fef3c7";
                    color = "#b45309";
                    border = "1px solid #f59e0b";
                  } else if (isAnswered) {
                    bg = "#dcfce7";
                    color = "#15803d";
                  }

                  if (isCurrent) {
                    border = "2px solid var(--navy)";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        height: 38,
                        borderRadius: 8,
                        background: bg,
                        color,
                        border,
                        fontWeight: isCurrent ? 900 : 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.1s"
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.78rem", color: "var(--text-2)", borderTop: "1px solid var(--border)", paddingTop: 14, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#dcfce7", display: "inline-block" }} />
                  <span>Answered: <strong>{answeredCount}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f1f5f9", display: "inline-block" }} />
                  <span>Unanswered: <strong>{unansweredCount}</strong></span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: "#fef3c7", border: "1px solid #f59e0b", display: "inline-block" }} />
                  <span>Flagged for Review: <strong>{flagged.size}</strong></span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#16a34a",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                Submit Examination
              </button>
            </div>
          </div>
        )}

        {/* ── SUBMIT CONFIRMATION MODAL ──────────────────────────────── */}
        {showSubmitModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "#ffffff", borderRadius: 20, padding: 32, maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🏁</div>
              <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.4rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 10px" }}>
                Ready to submit your examination?
              </h3>
              <p style={{ color: "var(--text-2)", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 20px" }}>
                You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
                {unansweredCount > 0 && (
                  <span style={{ display: "block", color: "#b45309", marginTop: 6, fontWeight: 700 }}>
                    ⚠️ {unansweredCount} question(s) are still unanswered!
                  </span>
                )}
              </p>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Return to Test
                </button>
                <button
                  onClick={handleSubmitExam}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    background: "#16a34a",
                    color: "#ffffff",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  {submitting ? "Grading..." : "Yes, Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            MODE 3: RESULTS & DETAILED REVIEW
           ══════════════════════════════════════════════════════════ */}
        {mode === "results" && resultData && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Score Summary Card */}
            <div style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: "36px",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              display: "grid",
              gridTemplateColumns: "minmax(240px, 320px) 1fr",
              gap: 32,
              alignItems: "center"
            }}>
              {/* Score Dial / Badge */}
              <div style={{ textAlign: "center", padding: "20px", background: "rgba(16,28,68,0.03)", borderRadius: 20 }}>
                <div style={{ fontSize: "3.5rem", fontWeight: 900, fontFamily: "var(--font-h)", color: resultData.percentage >= 60 ? "#16a34a" : "#dc2626", lineHeight: 1 }}>
                  {resultData.percentage}%
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", marginTop: 6 }}>
                  Score: {resultData.score} / {resultData.totalQuestions}
                </div>
                <div style={{
                  display: "inline-block",
                  marginTop: 12,
                  padding: "4px 14px",
                  borderRadius: 20,
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  background: resultData.percentage >= 75 ? "#dcfce7" : resultData.percentage >= 50 ? "#fef3c7" : "#fee2e2",
                  color: resultData.percentage >= 75 ? "#15803d" : resultData.percentage >= 50 ? "#b45309" : "#b91c1c"
                }}>
                  {resultData.percentage >= 75 ? "Distinction Performance 🌟" : resultData.percentage >= 50 ? "Credit Pass ✓" : "Needs Review & Practice"}
                </div>
              </div>

              {/* Breakdown metrics */}
              <div>
                <div style={{ display: "inline-block", background: "var(--gold-dim)", color: "var(--navy)", padding: "3px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 800, marginBottom: 8 }}>
                  {resultData.examType} · {resultData.subject}
                </div>
                <h2 style={{ fontFamily: "var(--font-h)", fontSize: "1.6rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 16px" }}>
                  Examination Performance Summary
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12, marginBottom: 24 }}>
                  <div style={{ background: "#f0fdf4", padding: "14px", borderRadius: 12, border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#16a34a" }}>{resultData.correctCount}</div>
                    <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 700 }}>Correct</div>
                  </div>
                  <div style={{ background: "#fef2f2", padding: "14px", borderRadius: 12, border: "1px solid #fecaca" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#dc2626" }}>{resultData.wrongCount}</div>
                    <div style={{ fontSize: "0.75rem", color: "#991b1b", fontWeight: 700 }}>Incorrect</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "14px", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#64748b" }}>{resultData.unansweredCount}</div>
                    <div style={{ fontSize: "0.75rem", color: "#475569", fontWeight: 700 }}>Unanswered</div>
                  </div>
                  <div style={{ background: "#eff6ff", padding: "14px", borderRadius: 12, border: "1px solid #bfdbfe" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#2563eb" }}>{formatTime(resultData.timeSpentSeconds)}</div>
                    <div style={{ fontSize: "0.75rem", color: "#1e40af", fontWeight: 700 }}>Time Used</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    onClick={() => { setMode("setup"); setResultData(null); }}
                    style={{
                      padding: "12px 22px",
                      background: "var(--navy)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 12,
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      cursor: "pointer"
                    }}
                  >
                    Take Another Test →
                  </button>

                  <Link
                    to="/profile"
                    style={{
                      padding: "12px 20px",
                      background: "#ffffff",
                      color: "var(--navy)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      display: "inline-flex",
                      alignItems: "center"
                    }}
                  >
                    View in My Dashboard
                  </Link>

                  <Link
                    to="/tips"
                    style={{
                      padding: "12px 20px",
                      background: "var(--gold-dim)",
                      color: "var(--navy)",
                      borderRadius: 12,
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      display: "inline-flex",
                      alignItems: "center"
                    }}
                  >
                    Study TIPS for this Subject 💡
                  </Link>
                </div>
              </div>
            </div>

            {/* Detailed Answer Review */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.35rem", fontWeight: 900, color: "var(--navy)", margin: 0 }}>
                  📖 Question-by-Question Solution Review
                </h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-3)", fontWeight: 700 }}>
                  {resultData.review?.length || 0} Questions
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {Array.isArray(resultData.review) && resultData.review.map((item, idx) => {
                  return (
                    <div
                      key={item.id || idx}
                      style={{
                        background: "#ffffff",
                        borderRadius: 18,
                        padding: "24px",
                        border: item.isCorrect ? "1px solid #bbf7d0" : "1px solid #fecaca"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "var(--navy)" }}>
                          Question {idx + 1} · {item.topic}
                        </span>

                        <span style={{
                          padding: "4px 12px",
                          borderRadius: 20,
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          background: item.isCorrect ? "#dcfce7" : "#fee2e2",
                          color: item.isCorrect ? "#15803d" : "#b91c1c"
                        }}>
                          {item.isCorrect ? "✓ Correct" : item.chosenOption ? "✗ Incorrect" : "○ Unanswered"}
                        </span>
                      </div>

                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>
                        {item.questionText}
                      </div>

                      {/* Options breakdown */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8, marginBottom: 16 }}>
                        {Array.isArray(item.options) && item.options.map((opt) => {
                          const isUserChoice = item.chosenOption === opt.id;
                          const isCorrectChoice = item.correctOption === opt.id;

                          let bg = "#f8fafc";
                          let border = "1px solid var(--border)";
                          let color = "var(--navy)";

                          if (isCorrectChoice) {
                            bg = "#f0fdf4";
                            border = "2px solid #22c55e";
                            color = "#15803d";
                          } else if (isUserChoice && !item.isCorrect) {
                            bg = "#fef2f2";
                            border = "2px solid #ef4444";
                            color = "#b91c1c";
                          }

                          return (
                            <div
                              key={opt.id}
                              style={{
                                padding: "10px 14px",
                                borderRadius: 10,
                                background: bg,
                                border,
                                color,
                                fontSize: "0.85rem",
                                fontWeight: (isCorrectChoice || isUserChoice) ? 800 : 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 8
                              }}
                            >
                              <span style={{ fontWeight: 900 }}>{opt.id}.</span>
                              <span>{opt.text}</span>
                              {isCorrectChoice && <span style={{ marginLeft: "auto", fontSize: "0.75rem" }}>✓ Correct</span>}
                              {isUserChoice && !isCorrectChoice && <span style={{ marginLeft: "auto", fontSize: "0.75rem" }}>✗ Your Pick</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation from Database */}
                      <div style={{ background: "#f8fafc", padding: "14px 18px", borderRadius: 12, borderLeft: "4px solid var(--navy)" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "var(--navy)", marginBottom: 4 }}>
                          Teacher / Examiner Explanation:
                        </div>
                        <div style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                          {item.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
