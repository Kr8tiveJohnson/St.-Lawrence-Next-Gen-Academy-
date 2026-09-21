import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import SchoolDashboardView from "../components/dashboard/SchoolDashboardView";
import StudentDashboardView from "../components/dashboard/StudentDashboardView";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : (parts[0]?.[0] || "S").toUpperCase();
}

function Avatar({ name = "", size = 40, style = {} }) {
  const initials = getInitials(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "var(--navy)", color: "var(--gold)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.35, flexShrink: 0, ...style
    }}>
      {initials || "?"}
    </div>
  );
}

function Toast({ msg, type = "success" }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: type === "success" ? "#10b981" : "#ef4444",
      color: "#fff", padding: "12px 22px", borderRadius: "12px",
      fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      animation: "fadeIn 0.3s ease"
    }}>
      {type === "success" ? "✅" : "❌"} {msg}
    </div>
  );
}

// ─── STUDENT: LEARNING PROGRESS TAB ──────────────────────────────────────────
function ProgressTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/progress/me")
      .then((res) => setData(res.data))
      .catch((err) => console.error("progress error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>Calculating student progress...</div>;
  }

  if (!data) {
    return <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>Could not load progress data.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.3rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 6px" }}>
          📊 Academic Progress & Mastery
        </h3>
        <p style={{ color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }}>
          Real-time tracking based on completed lessons, quiz scores, and CBT mock exam attempts.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        <div className="dash-card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>⏱️</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--navy)" }}>{data.totalTestsTaken}</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-3)", fontWeight: 700 }}>CBT Exams Completed</div>
        </div>

        <div className="dash-card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>📖</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--gold)" }}>{data.totalCompletedLessons}</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-3)", fontWeight: 700 }}>Lessons Completed</div>
        </div>

        <div className="dash-card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>🎯</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#16a34a" }}>
            {data.strongSubjects?.length || 0}
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-3)", fontWeight: 700 }}>Strong Subjects</div>
        </div>
      </div>

      {/* Subject-by-Subject Mastery Bars */}
      <div className="dash-card" style={{ padding: "28px" }}>
        <h4 style={{ fontFamily: "var(--font-h)", fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", margin: "0 0 18px" }}>
          Subject Mastery Breakdown
        </h4>

        {(!data.subjectProgress || data.subjectProgress.length === 0) ? (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--text-3)" }}>
            No subject activity recorded yet. Take your first <Link to="/cbt" style={{ color: "var(--navy)", fontWeight: 700 }}>CBT Exam</Link> to start tracking!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {data.subjectProgress.map((item) => (
              <div key={item.subject}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.92rem" }}>
                    {item.subject}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
                      Avg CBT: <strong>{typeof item.avgCbtScore === "number" ? `${item.avgCbtScore}%` : item.avgCbtScore}</strong>
                    </span>
                    <span style={{
                      fontWeight: 900,
                      fontSize: "0.9rem",
                      color: item.masteryPercent >= 70 ? "#16a34a" : item.masteryPercent >= 50 ? "#d97706" : "#dc2626"
                    }}>
                      {item.masteryPercent}%
                    </span>
                  </div>
                </div>

                <div style={{ height: 10, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min(100, Math.max(0, item.masteryPercent))}%`,
                    borderRadius: 99,
                    background: item.masteryPercent >= 70
                      ? "linear-gradient(90deg, #16a34a, #22c55e)"
                      : item.masteryPercent >= 50
                        ? "linear-gradient(90deg, #d97706, #f59e0b)"
                        : "linear-gradient(90deg, #dc2626, #ef4444)",
                    transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strong & Weak Areas Highlight */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16, padding: "20px" }}>
          <div style={{ fontWeight: 800, color: "#166534", fontSize: "0.92rem", marginBottom: 6 }}>
            💪 Strong Performance Areas:
          </div>
          <div style={{ color: "#15803d", fontSize: "0.85rem", lineHeight: 1.5 }}>
            {data.strongSubjects?.length > 0
              ? data.strongSubjects.join(", ")
              : "Keep practicing tests to identify your highest-scoring subjects."}
          </div>
        </div>

        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: "20px" }}>
          <div style={{ fontWeight: 800, color: "#991b1b", fontSize: "0.92rem", marginBottom: 6 }}>
            🎯 Areas Needing Targeted Practice:
          </div>
          <div style={{ color: "#b91c1c", fontSize: "0.85rem", lineHeight: 1.5 }}>
            {data.weakSubjects?.length > 0
              ? data.weakSubjects.join(", ")
              : "Great job! All active subjects are above the 60% mastery threshold."}
          </div>
        </div>
      </div>

      {/* Targeted Recommendations From Database */}
      {data.recommendedTips?.length > 0 && (
        <div className="dash-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h4 style={{ fontFamily: "var(--font-h)", fontSize: "1.05rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
              💡 Recommended TIPS for Your Focus Areas
            </h4>
            <Link to="/tips" style={{ fontSize: "0.8rem", color: "var(--navy)", fontWeight: 700 }}>
              View All TIPS →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {data.recommendedTips.map((tip) => (
              <div key={tip.id} style={{ background: "#f8fafc", padding: "16px", borderRadius: 14, border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.72rem", background: "var(--gold-dim)", color: "var(--navy)", padding: "2px 8px", borderRadius: 6, fontWeight: 800 }}>
                  {tip.subject}
                </span>
                <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.92rem", margin: "8px 0 4px" }}>
                  {tip.title}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-2)", lineHeight: 1.4, marginBottom: 10 }}>
                  {tip.keyIdea}
                </div>
                <Link to="/tips" style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--navy)" }}>
                  Review Memory Trick →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STUDENT: CBT TEST HISTORY TAB ────────────────────────────────────────────
function CbtHistoryTab() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/cbt/attempts/me")
      .then((res) => setAttempts(res.data.attempts || []))
      .catch((err) => console.error("cbt attempts error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.3rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 4px" }}>
            ⏱️ CBT Examination History
          </h3>
          <p style={{ color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }}>
            Review past scores, time used, and performance metrics across examinations.
          </p>
        </div>
        <Link to="/cbt" style={{ padding: "10px 18px", background: "var(--navy)", color: "#ffffff", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: "0.85rem" }}>
          + Take New CBT Test
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>Loading test attempts...</div>
      ) : attempts.length === 0 ? (
        <div className="dash-card" style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-3)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📝</div>
          <h4 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 8px" }}>No CBT Tests Taken Yet</h4>
          <p style={{ fontSize: "0.9rem", color: "var(--text-2)", margin: "0 0 20px" }}>
            Put your knowledge to the test with our timed JAMB and WAEC exam practice engine.
          </p>
          <Link to="/cbt" style={{ display: "inline-block", padding: "10px 22px", background: "var(--navy)", color: "#ffffff", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: "0.88rem" }}>
            Start First CBT Drill →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {attempts.map((att) => {
            const formattedDate = new Date(att.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });
            const mins = Math.floor(att.timeSpentSeconds / 60);
            const secs = att.timeSpentSeconds % 60;

            return (
              <div key={att.id} className="dash-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ background: "rgba(16,28,68,0.06)", color: "var(--navy)", padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                      {att.examType}
                    </span>
                    <span style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1rem" }}>
                      {att.subject}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
                    {formattedDate} · Time used: {mins}m {secs}s
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 900, color: att.percentage >= 60 ? "#16a34a" : "#dc2626" }}>
                      {att.score} / {att.totalQuestions}
                    </div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--text-3)" }}>
                      {att.percentage}%
                    </div>
                  </div>

                  <span style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    background: att.percentage >= 75 ? "#dcfce7" : att.percentage >= 50 ? "#fef3c7" : "#fee2e2",
                    color: att.percentage >= 75 ? "#15803d" : att.percentage >= 50 ? "#b45309" : "#b91c1c"
                  }}>
                    {att.percentage >= 75 ? "Distinction" : att.percentage >= 50 ? "Credit" : "Review"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── STUDENT: ASSIGNMENTS TAB ─────────────────────────────────────────────────
function StudentAssignmentsTab() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModal, setSubmitModal] = useState(null); // assignment object
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAssignments = useCallback(async () => {
    try {
      const res = await client.get("/assignments");
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error("loadAssignments error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitModal) return;
    setSubmitting(true);

    try {
      await client.post(`/assignments/${submitModal.id}/submit`, {
        submissionText,
      });
      notify("Assignment submitted successfully! 🎉");
      setSubmitModal(null);
      setSubmissionText("");
      loadAssignments();
    } catch (err) {
      notify(err.response?.data?.error || "Failed to submit assignment.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.3rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 4px" }}>
          📝 Homework & Assignments
        </h3>
        <p style={{ color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }}>
          View tasks assigned by academy teachers, submit your answers, and check instructor marks.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="dash-card" style={{ textAlign: "center", padding: "40px", color: "var(--text-3)" }}>
          <div style={{ fontSize: "2.8rem", marginBottom: 10 }}>📄</div>
          <p style={{ fontWeight: 600, margin: 0 }}>No assignments currently active.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {assignments.map((item) => {
            const mySub = item.submissions?.[0] || null;
            const isGraded = mySub?.status === "GRADED";
            const isSubmitted = mySub?.status === "SUBMITTED" || isGraded;

            return (
              <div key={item.id} className="dash-card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ background: "rgba(16,28,68,0.06)", color: "var(--navy)", padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                        {item.subject}
                      </span>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-3)", fontWeight: 700 }}>
                        Target: {item.targetClass}
                      </span>
                    </div>
                    <h4 style={{ fontFamily: "var(--font-h)", fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
                      {item.title}
                    </h4>
                  </div>

                  <span style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: "0.76rem",
                    fontWeight: 800,
                    background: isGraded ? "#dcfce7" : isSubmitted ? "#fef3c7" : "#fee2e2",
                    color: isGraded ? "#15803d" : isSubmitted ? "#b45309" : "#b91c1c"
                  }}>
                    {isGraded ? `Graded: ${mySub.score}/100` : isSubmitted ? "Submitted (Pending Grading)" : "Pending Submission"}
                  </span>
                </div>

                <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.6, margin: "0 0 16px" }}>
                  {item.description}
                </p>

                {/* Due Date & Action */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-3)", fontWeight: 600 }}>
                    {item.dueDate ? `Due Date: ${new Date(item.dueDate).toLocaleDateString("en-NG")}` : "No specific deadline"}
                  </span>

                  <button
                    onClick={() => { setSubmitModal(item); setSubmissionText(mySub?.submissionText || ""); }}
                    style={{
                      padding: "8px 16px",
                      background: "var(--navy)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer"
                    }}
                  >
                    {isSubmitted ? "Edit / View Submission" : "Submit Answer →"}
                  </button>
                </div>

                {/* Teacher Feedback if Graded */}
                {isGraded && mySub.feedback && (
                  <div style={{ marginTop: 14, background: "#f0fdf4", borderLeft: "4px solid #16a34a", padding: "10px 14px", borderRadius: 8 }}>
                    <div style={{ fontSize: "0.74rem", fontWeight: 800, textTransform: "uppercase", color: "#166534", marginBottom: 2 }}>
                      Teacher Feedback:
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#15803d" }}>
                      {mySub.feedback}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {submitModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 20, padding: 30, maxWidth: 540, width: "100%", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)", margin: "0 0 10px" }}>
              Submit: {submitModal.title}
            </h3>
            <p style={{ color: "var(--text-2)", fontSize: "0.85rem", margin: "0 0 16px" }}>
              Enter your written solution, essay, or link to your work:
            </p>

            <form onSubmit={handleSubmit}>
              <textarea
                required
                rows={6}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Type your answer, working, or shared document link..."
                style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.9rem", resize: "vertical", boxSizing: "border-box", marginBottom: 18 }}
              />

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setSubmitModal(null)}
                  style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid var(--border)", background: "#ffffff", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "var(--navy)", color: "#ffffff", fontWeight: 800, cursor: "pointer" }}
                >
                  {submitting ? "Submitting..." : "Submit to Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TEACHER: ASSIGNMENTS MANAGER TAB ─────────────────────────────────────────
function TeacherAssignmentsTab() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [viewSubmissions, setViewSubmissions] = useState(null); // assignment object
  const [submissionsList, setSubmissionsList] = useState([]);
  const [gradeModal, setGradeModal] = useState(null); // submission object
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");
  const [toast, setToast] = useState(null);

  const [newForm, setNewForm] = useState({
    title: "",
    subject: "Mathematics",
    targetClass: "SSS 3",
    description: "",
    dueDate: ""
  });

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadAssignments = useCallback(async () => {
    try {
      const res = await client.get("/assignments");
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await client.post("/assignments", newForm);
      notify("Assignment created successfully! 🎉");
      setShowCreate(false);
      setNewForm({ title: "", subject: "Mathematics", targetClass: "SSS 3", description: "", dueDate: "" });
      loadAssignments();
    } catch (err) {
      notify(err.response?.data?.error || "Failed to create assignment", "error");
    }
  };

  const handleOpenSubmissions = async (assignment) => {
    setViewSubmissions(assignment);
    try {
      const res = await client.get(`/assignments/${assignment.id}/submissions`);
      setSubmissionsList(res.data.submissions || []);
    } catch {
      setSubmissionsList([]);
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradeModal) return;

    try {
      await client.put(`/assignments/submissions/${gradeModal.id}/grade`, {
        score: gradeScore,
        feedback: gradeFeedback
      });
      notify("Grade and feedback saved! ✓");
      setGradeModal(null);
      setGradeScore("");
      setGradeFeedback("");
      if (viewSubmissions) handleOpenSubmissions(viewSubmissions);
    } catch {
      notify("Failed to save grade", "error");
    }
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.3rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 4px" }}>
            📋 Teacher Assignments Manager
          </h3>
          <p style={{ color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }}>
            Create tasks, review student submissions, and assign scores with personal remarks.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          style={{ padding: "10px 18px", background: "var(--navy)", color: "#ffffff", borderRadius: 10, border: "none", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}
        >
          {showCreate ? "Cancel" : "+ Create New Assignment"}
        </button>
      </div>

      {/* Create Assignment Form */}
      {showCreate && (
        <div className="dash-card" style={{ padding: "28px", marginBottom: 24 }}>
          <h4 style={{ fontFamily: "var(--font-h)", fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)", margin: "0 0 16px" }}>
            Publish New Assignment
          </h4>
          <form onSubmit={handleCreateAssignment} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>Assignment Title</label>
              <input required value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })}
                placeholder="e.g. Weekly Calculus Problem Set"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.9rem", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>Subject</label>
                <select value={newForm.subject} onChange={e => setNewForm({ ...newForm, subject: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.9rem" }}>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English Language">English Language</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Economics">Economics</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>Target Class</label>
                <select value={newForm.targetClass} onChange={e => setNewForm({ ...newForm, targetClass: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.9rem" }}>
                  <option value="SSS 3">SSS 3</option>
                  <option value="SSS 2">SSS 2</option>
                  <option value="SSS 1">SSS 1</option>
                  <option value="JSS 3">JSS 3</option>
                  <option value="JAMB / WAEC Candidates">JAMB / WAEC Candidates</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>Description & Instructions</label>
              <textarea required rows={3} value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })}
                placeholder="Detail what questions or essay students should complete..."
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.9rem", resize: "vertical", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>Due Date</label>
              <input type="date" value={newForm.dueDate} onChange={e => setNewForm({ ...newForm, dueDate: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", fontSize: "0.9rem", boxSizing: "border-box" }} />
            </div>

            <button type="submit" style={{ padding: "12px", background: "var(--navy)", color: "#ffffff", border: "none", borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>
              Publish Assignment
            </button>
          </form>
        </div>
      )}

      {/* Assignments List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-3)" }}>Loading assignments...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {assignments.map((item) => (
            <div key={item.id} className="dash-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ background: "rgba(16,28,68,0.06)", color: "var(--navy)", padding: "2px 8px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 800 }}>
                    {item.subject}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-3)", fontWeight: 700 }}>
                    Class: {item.targetClass}
                  </span>
                </div>
                <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1rem" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 4 }}>
                  {item._count?.submissions || 0} student submissions
                </div>
              </div>

              <button
                onClick={() => handleOpenSubmissions(item)}
                style={{ padding: "8px 16px", background: "rgba(16,28,68,0.08)", color: "var(--navy)", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}
              >
                View Submissions ({item._count?.submissions || 0}) →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submissions Modal */}
      {viewSubmissions && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 20, padding: 30, maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
                Submissions: {viewSubmissions.title}
              </h3>
              <button onClick={() => setViewSubmissions(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                ✕ Close
              </button>
            </div>

            {submissionsList.length === 0 ? (
              <div style={{ textAlign: "center", padding: 30, color: "var(--text-3)" }}>
                No students have submitted this assignment yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {submissionsList.map((sub) => (
                  <div key={sub.id} style={{ background: "#f8fafc", borderRadius: 12, padding: "16px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.92rem" }}>
                        {sub.student?.profile?.fullName || sub.student?.email}
                      </div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, color: sub.status === "GRADED" ? "#16a34a" : "#d97706" }}>
                        {sub.status === "GRADED" ? `Score: ${sub.score}/100` : "Pending Grade"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.5, background: "#ffffff", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", marginBottom: 10 }}>
                      {sub.submissionText}
                    </div>

                    <button
                      onClick={() => { setGradeModal(sub); setGradeScore(sub.score || ""); setGradeFeedback(sub.feedback || ""); }}
                      style={{ padding: "6px 14px", background: "var(--navy)", color: "#ffffff", border: "none", borderRadius: 6, fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                    >
                      {sub.status === "GRADED" ? "Update Score & Remark" : "Grade Submission"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {gradeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#ffffff", borderRadius: 18, padding: 26, maxWidth: 440, width: "100%" }}>
            <h4 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 14px" }}>
              Grade Student Work
            </h4>
            <form onSubmit={handleSaveGrade} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Score (Out of 100)</label>
                <input required type="number" min={0} max={100} value={gradeScore} onChange={e => setGradeScore(e.target.value)}
                  placeholder="e.g. 85" style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.9rem", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Teacher Feedback & Remarks</label>
                <textarea rows={3} value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)}
                  placeholder="Constructive feedback to guide the student..."
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.85rem", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                <button type="button" onClick={() => setGradeModal(null)} style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "#ffffff", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#16a34a", color: "#ffffff", fontWeight: 800, cursor: "pointer" }}>Save Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TEACHER: QUESTION BANK CONTRIBUTION TAB ──────────────────────────────────
function TeacherQuestionBankTab() {
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    examType: "JAMB",
    subject: "Mathematics",
    targetClass: "SSS 3",
    topic: "",
    year: "2024",
    difficulty: "MEDIUM",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    explanation: ""
  });

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      examType: form.examType,
      subject: form.subject,
      targetClass: form.targetClass,
      topic: form.topic,
      year: parseInt(form.year) || 2024,
      difficulty: form.difficulty,
      questionText: form.questionText,
      options: [
        { id: "A", text: form.optionA },
        { id: "B", text: form.optionB },
        { id: "C", text: form.optionC },
        { id: "D", text: form.optionD },
      ],
      correctOption: form.correctOption,
      explanation: form.explanation
    };

    try {
      await client.post("/cbt/questions", payload);
      notify("Question contributed to academy question bank! ✓");
      setForm({
        ...form,
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        explanation: ""
      });
    } catch (err) {
      notify(err.response?.data?.error || "Failed to add question", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.3rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 4px" }}>
          💡 Contribute to Central Question Bank
        </h3>
        <p style={{ color: "var(--text-2)", fontSize: "0.88rem", margin: 0 }}>
          Add verified curriculum exam questions to power the academy's CBT Examination Engine.
        </p>
      </div>

      <div className="dash-card" style={{ padding: "28px" }}>
        <form onSubmit={handleAddQuestion} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Examination</label>
              <select value={form.examType} onChange={e => setForm({ ...form, examType: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.88rem" }}>
                <option value="JAMB">JAMB UTME</option>
                <option value="WAEC">WAEC SSCE</option>
                <option value="NECO">NECO SSCE</option>
                <option value="INTERNAL">Academy Mock</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Subject</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.88rem" }}>
                <option value="Mathematics">Mathematics</option>
                <option value="English Language">English Language</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Economics">Economics</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Topic</label>
              <input required value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g. Surds & Indices"
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.88rem", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.88rem" }}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Challenging</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Question Prompt</label>
            <textarea required rows={3} value={form.questionText} onChange={e => setForm({ ...form, questionText: e.target.value })}
              placeholder="State the question clearly..."
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.88rem", resize: "vertical", boxSizing: "border-box" }} />
          </div>

          {/* Options A to D */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--navy)", marginBottom: 3 }}>Option A</label>
              <input required value={form.optionA} onChange={e => setForm({ ...form, optionA: e.target.value })}
                placeholder="Text for option A" style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--navy)", marginBottom: 3 }}>Option B</label>
              <input required value={form.optionB} onChange={e => setForm({ ...form, optionB: e.target.value })}
                placeholder="Text for option B" style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--navy)", marginBottom: 3 }}>Option C</label>
              <input required value={form.optionC} onChange={e => setForm({ ...form, optionC: e.target.value })}
                placeholder="Text for option C" style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--navy)", marginBottom: 3 }}>Option D</label>
              <input required value={form.optionD} onChange={e => setForm({ ...form, optionD: e.target.value })}
                placeholder="Text for option D" style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#15803d", marginBottom: 4 }}>Correct Option</label>
              <select value={form.correctOption} onChange={e => setForm({ ...form, correctOption: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "2px solid #22c55e", fontSize: "0.9rem", fontWeight: 800 }}>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>Detailed Worked Solution / Explanation</label>
              <input value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })}
                placeholder="Explain why this option is correct for the student review screen..."
                style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.88rem", boxSizing: "border-box" }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: 10,
              padding: "12px",
              background: "var(--navy)",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: "0.92rem",
              cursor: "pointer",
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? "Saving to Database..." : "Save Question to Central Bank ✓"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── SETTINGS TAB (Class & Subject Personalization) ───────────────────────────
function SettingsTab({ authUser, onProfileUpdate }) {
  const [form, setForm] = useState({
    fullName: authUser?.profile?.fullName || "",
    phone: authUser?.profile?.phone || "",
    dateOfBirth: authUser?.profile?.dateOfBirth ? authUser.profile.dateOfBirth.slice(0, 10) : "",
    targetClass: authUser?.profile?.targetClass || "SSS 3",
    selectedSubjects: Array.isArray(authUser?.profile?.selectedSubjects) ? authUser.profile.selectedSubjects : ["Mathematics", "English Language"],
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [avatar, setAvatar] = useState(authUser?.profile?.avatarUrl || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const ALL_SUBJECTS = [
    "Mathematics",
    "English Language",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Government",
    "Literature in English",
    "Computer Studies / Coding"
  ];

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { notify("Image must be under 2MB.", "error"); return; }
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      try {
        await client.post("/users/me/photo", { avatarUrl: dataUrl });
        notify("Profile photo updated! ✅");
      } catch {
        notify("Failed to upload photo.", "error");
      }
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
  };

  const toggleSubject = (subj) => {
    setForm((prev) => {
      const exists = prev.selectedSubjects.includes(subj);
      return {
        ...prev,
        selectedSubjects: exists
          ? prev.selectedSubjects.filter((s) => s !== subj)
          : [...prev.selectedSubjects, subj]
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await client.put("/users/me", {
        fullName: form.fullName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || undefined,
        targetClass: form.targetClass,
        selectedSubjects: form.selectedSubjects,
      });
      if (onProfileUpdate) onProfileUpdate(res.data.user);
      notify("Profile and class preferences saved! ✓");
    } catch (err) {
      notify(err?.response?.data?.error || "Failed to save settings.", "error");
    }
    setSaving(false);
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: 22 }}>
        ⚙️ Account & Academic Personalization
      </h3>

      {/* Avatar Card */}
      <div className="dash-card" style={{ maxWidth: 640, padding: 24, marginBottom: 18 }}>
        <h4 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 16px" }}>Profile Photo</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "3px solid var(--border)", flexShrink: 0, background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {avatar
              ? <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ color: "var(--gold)", fontWeight: 900, fontSize: "1.8rem" }}>{getInitials(form.fullName || authUser?.email)}</span>
            }
          </div>
          <div>
            <label style={{ display: "inline-block", padding: "9px 18px", background: "var(--navy)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              {uploadingAvatar ? "Uploading..." : "📸 Upload Photo"}
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} disabled={uploadingAvatar} />
            </label>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 6 }}>JPG or PNG · Max 2MB</p>
          </div>
        </div>
      </div>

      <div className="dash-card" style={{ maxWidth: 640, padding: 28 }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Full Name */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase" }}>
              Full Name
            </label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>

          {/* Academic Class / Level */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase" }}>
              Academic Class / Target Program
            </label>
            <select
              value={form.targetClass}
              onChange={e => setForm({ ...form, targetClass: e.target.value })}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", fontWeight: 700, color: "var(--navy)", background: "#ffffff" }}
            >
              <option value="JSS 1">Junior Secondary School 1 (JSS 1)</option>
              <option value="JSS 2">Junior Secondary School 2 (JSS 2)</option>
              <option value="JSS 3">Junior Secondary School 3 (JSS 3)</option>
              <option value="SSS 1">Senior Secondary School 1 (SSS 1)</option>
              <option value="SSS 2">Senior Secondary School 2 (SSS 2)</option>
              <option value="SSS 3">Senior Secondary School 3 (SSS 3)</option>
              <option value="JAMB UTME Candidate">JAMB UTME Candidate</option>
              <option value="WAEC Candidate">WAEC SSCE Candidate</option>
              <option value="Digital Skills Student">Digital Skills Student</option>
            </select>
          </div>

          {/* Subject Selection */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 8, textTransform: "uppercase" }}>
              Enrolled / Primary Subjects
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
              {ALL_SUBJECTS.map((subj) => {
                const checked = form.selectedSubjects.includes(subj);
                return (
                  <div
                    key={subj}
                    onClick={() => toggleSubject(subj)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: checked ? "1px solid var(--navy)" : "1px solid var(--border)",
                      background: checked ? "rgba(16,28,68,0.05)" : "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    <input type="checkbox" checked={checked} readOnly style={{ accentColor: "var(--navy)" }} />
                    <span style={{ fontSize: "0.82rem", fontWeight: checked ? 700 : 500, color: "var(--navy)" }}>{subj}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase" }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+234..."
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase" }}>
              Date of Birth
            </label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving Changes..." : "💾 Save Profile & Subjects"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── EXISTING COMMUNITY TABS (Friends, Messages, Groups, Notifications) ──────
function FriendsTab({ currentUserId }) {
  const [subTab, setSubTab] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadFriends = useCallback(async () => {
    try {
      const [fr, req] = await Promise.all([
        client.get("/friends"),
        client.get("/friends/requests/pending"),
      ]);
      setFriends(fr.data.friends || []);
      setRequests(req.data.requests || []);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadFriends(); }, [loadFriends]);

  const searchUsers = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await client.get(`/users/search?q=${encodeURIComponent(search)}`);
      setSearchResults(res.data.users || []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  };

  const sendRequest = async (receiverId) => {
    try {
      await client.post("/friends/request", { receiverId });
      notify("Friend request sent!");
      setSearchResults(prev => prev.filter(u => u.id !== receiverId));
    } catch (e) {
      notify(e?.response?.data?.error || "Could not send request", "error");
    }
  };

  const acceptRequest = async (id) => {
    try {
      await client.put(`/friends/${id}/accept`);
      notify("Friend request accepted! 🎉");
      loadFriends();
    } catch {
      notify("Failed to accept request", "error");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await client.put(`/friends/${id}/reject`);
      notify("Request declined.");
      loadFriends();
    } catch {
      notify("Failed to decline request", "error");
    }
  };

  const subTabStyle = (active) => ({
    padding: "7px 18px", border: "none", borderRadius: "8px",
    fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit",
    background: active ? "var(--navy)" : "transparent",
    color: active ? "#fff" : "var(--text-3)", transition: "all 0.15s"
  });

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
          🤝 Friends & Classmates
        </h3>
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", padding: 4, borderRadius: 10 }}>
          <button style={subTabStyle(subTab === "friends")} onClick={() => setSubTab("friends")}>My Friends ({friends.length})</button>
          <button style={subTabStyle(subTab === "requests")} onClick={() => setSubTab("requests")}>Requests {requests.length > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: "50%", padding: "1px 6px", marginLeft: 4, fontSize: "0.75rem" }}>{requests.length}</span>}</button>
          <button style={subTabStyle(subTab === "find")} onClick={() => setSubTab("find")}>Find Classmates</button>
        </div>
      </div>

      {subTab === "friends" && (
        loading ? <div style={{ textAlign: "center", color: "var(--text-3)", padding: 40 }}>Loading friends...</div>
        : friends.length === 0 ? (
          <div className="dash-card" style={{ textAlign: "center", padding: "40px 30px", color: "var(--text-3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: 10 }}>👥</div>
            <p style={{ fontWeight: 600, margin: 0 }}>You haven't connected with anyone yet.</p>
            <button onClick={() => setSubTab("find")} style={{ marginTop: 16, padding: "10px 20px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>
              Find Classmates
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {friends.map(f => (
              <div key={f.id} className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                <Avatar name={f.profile?.fullName || f.username || "?"} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.95rem" }}>
                    {f.profile?.fullName || f.username}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>{f.role}</div>
                </div>
                <Link to="/chat" style={{ padding: "6px 12px", background: "rgba(15,33,68,0.07)", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", textDecoration: "none" }}>
                  💬 Chat
                </Link>
              </div>
            ))}
          </div>
        )
      )}

      {subTab === "requests" && (
        requests.length === 0 ? (
          <div className="dash-card" style={{ textAlign: "center", padding: "40px 30px", color: "var(--text-3)" }}>
            <p style={{ fontWeight: 600, margin: 0 }}>No pending friend requests.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {requests.map(req => (
              <div key={req.id} className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                <Avatar name={req.requester?.profile?.fullName || req.requester?.username || "?"} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "var(--navy)" }}>
                    {req.requester?.profile?.fullName || req.requester?.username}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>Sent you a friend request</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => acceptRequest(req.id)} style={{ padding: "7px 14px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>Accept</button>
                  <button onClick={() => rejectRequest(req.id)} style={{ padding: "7px 14px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {subTab === "find" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchUsers()}
              placeholder="Search classmates by name..."
              style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", fontSize: "0.95rem", outline: "none" }}
            />
            <button onClick={searchUsers} disabled={searching} style={{ padding: "12px 20px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
              {searching ? "..." : "Search"}
            </button>
          </div>
          {searchResults.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {searchResults.map(u => (
                <div key={u.id} className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}>
                  <Avatar name={u.profile?.fullName || u.username || "?"} size={42} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: "var(--navy)" }}>{u.profile?.fullName || u.username}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>{u.role}</div>
                  </div>
                  <button onClick={() => sendRequest(u.id)} style={{ padding: "7px 16px", background: "var(--navy)", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, cursor: "pointer", fontSize: "0.83rem" }}>
                    + Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MessagesTab() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/friends")
      .then(r => setFriends(r.data.friends || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
          💬 Direct Messages
        </h3>
        <Link to="/chat" style={{ padding: "9px 18px", background: "var(--navy)", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
          Open Full Chat →
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "var(--text-3)", padding: 40 }}>Loading conversations...</div>
      ) : friends.length === 0 ? (
        <div className="dash-card" style={{ textAlign: "center", padding: "40px 30px", color: "var(--text-3)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 10 }}>💬</div>
          <p style={{ fontWeight: 600, margin: 0 }}>No conversations yet.</p>
          <p style={{ fontSize: "0.88rem", marginTop: 6 }}>Add classmates to start discussing coursework.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {friends.map(f => (
            <Link to="/chat" key={f.id} style={{ textDecoration: "none" }}>
              <div className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer" }}>
                <Avatar name={f.profile?.fullName || f.username || "?"} size={46} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.95rem" }}>
                    {f.profile?.fullName || f.username}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>Tap to send message →</div>
                </div>
                <span>💬</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupsTab({ authUser }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/groups")
      .then(res => setGroups(res.data.groups || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", margin: 0 }}>
          👥 Study Circles & Groups
        </h3>
        <Link to="/groups" style={{ padding: "9px 18px", background: "var(--navy)", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
          Browse All Circles →
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-3)", textAlign: "center", padding: 24 }}>Loading study circles...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {groups.map((g) => (
            <div key={g.id} className="dash-card" style={{ padding: "20px" }}>
              <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1rem", marginBottom: 6 }}>{g.name}</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-2)", margin: "0 0 14px", lineHeight: 1.5 }}>
                {g.description || "Active academy circle for peer accountability."}
              </p>
              <Link to="/groups" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)" }}>
                View Circle Discussion →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)", marginBottom: 18 }}>
        🔔 Academy Notifications
      </h3>
      <div className="dash-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 14 }}>
          <span style={{ fontSize: "1.5rem" }}>📢</span>
          <div>
            <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.95rem" }}>CBT Examination Center Live</div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-2)", margin: "4px 0 0" }}>
              Practice questions are now accessible for JAMB UTME and WAEC SSCE in the new CBT Exam platform.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: "1.5rem" }}>💡</span>
          <div>
            <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.95rem" }}>New TIPS Learning System Available</div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-2)", margin: "4px 0 0" }}>
              Quick recall mnemonics and common exam mistake guides are available in the TIPS section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD EXPORT ───────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!loading && !authUser) navigate("/login");
  }, [authUser, loading, navigate]);

  useEffect(() => {
    if (authUser) {
      client.get("/friends/requests/pending")
        .then(r => setPendingCount((r.data.requests || []).length))
        .catch(() => {});
    }
  }, [authUser]);

  const handleLogout = () => { logout(); navigate("/"); };

  if (loading || !authUser)
    return <div style={{ minHeight: "100vh", background: "#f3f6fb" }} />;

  const isTeacher = authUser.role === "TEACHER";

  const user = {
    firstName: authUser.profile?.fullName?.split(" ")[0] || authUser.email?.split("@")[0] || "Student",
    lastName: authUser.profile?.fullName?.split(" ").slice(1).join(" ") || "",
    fullName: authUser.profile?.fullName || authUser.email?.split("@")[0] || "Student",
    role: authUser.role || "STUDENT",
    tier: authUser.tier || "UNPAID",
    targetClass: authUser.profile?.targetClass || "SSS 3 / Exam Candidate",
    email: authUser.email,
  };

  const initials = getInitials(user.fullName || user.firstName);

  // Student Navigation vs Teacher Navigation
  const NAV = isTeacher
    ? [
        { label: "Overview", icon: "🏠" },
        { label: "Assignments Manager", icon: "📝" },
        { label: "Question Bank", icon: "💡" },
        { label: "My Classes", icon: "📚" },
        { label: "Friends", icon: "🤝" },
        { label: "Messages", icon: "💬" },
        { label: "Groups", icon: "👥" },
        { label: "Notifications", icon: "🔔" },
        { label: "Settings", icon: "⚙️" },
      ]
    : [
        { label: "Overview", icon: "🏠" },
        { label: "Learning Progress", icon: "📊" },
        { label: "CBT History", icon: "⏱️" },
        { label: "Assignments", icon: "📝" },
        { label: "My Courses", icon: "📚" },
        { label: "Friends", icon: "🤝", badge: pendingCount > 0 ? pendingCount : null },
        { label: "Messages", icon: "💬" },
        { label: "Groups", icon: "👥" },
        { label: "Notifications", icon: "🔔" },
        { label: "Settings", icon: "⚙️" },
      ];

  // For all students, render the unified modern StudentDashboardView across all tabs
  if (!isTeacher) {
    return (
      <StudentDashboardView
        user={{
          ...user,
          avatarUrl: authUser?.profile?.avatarUrl,
          phone: authUser?.profile?.phone,
          dateOfBirth: authUser?.profile?.dateOfBirth,
          selectedSubjects: authUser?.profile?.selectedSubjects
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingCount}
        onLogout={handleLogout}
      />
    );
  }


  return (
    <div className="profile-shell product-dashboard-page" style={{ background: "var(--off-white)", minHeight: "100vh" }}>
      {/* ── TOP NAV ─────────────────────────────────── */}
      <nav className="nav profile-page-nav" style={{ background: "#ffffff", borderBottom: "1px solid var(--border)", padding: "14px 24px" }}>
        <Link to="/" className="nav-logo" style={{ textDecoration: "none" }}>
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" style={{ height: 38 }} />
          <div>
            <div className="nav-brand-name" style={{ fontFamily: "var(--font-h)", fontWeight: 900, color: "var(--navy)", fontSize: "1.05rem" }}>
              ST. LAWRENCE
            </div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--gold)" }}>
              {isTeacher ? "TEACHER PORTAL" : "STUDENT LEARNING PLATFORM"}
            </div>
          </div>
        </Link>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {!isTeacher && (
            <button
              onClick={() => setActiveTab("Overview")}
              style={{
                background: "rgba(16,28,68,0.06)",
                border: "none",
                padding: "8px 14px",
                borderRadius: "10px",
                color: "var(--navy)",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer"
              }}
            >
              ← Overview
            </button>
          )}
          <Link to="/cbt" style={{ color: "var(--navy)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
            CBT Exams
          </Link>
          <Link to="/tips" style={{ color: "var(--navy)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
            TIPS Recall
          </Link>
          <Link to="/resources" style={{ color: "var(--navy)", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>
            Resources
          </Link>
          <button onClick={handleLogout} className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
            Log Out
          </button>
        </div>
      </nav>

      {/* ── DASHBOARD BODY ─────────────────────────── */}
      <div style={{ maxWidth: 1240, margin: "32px auto", padding: "0 20px" }}>
        {!isTeacher && (
          <div style={{ marginBottom: "16px" }}>
            <button
              onClick={() => setActiveTab("Overview")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                border: "1px solid var(--border)",
                padding: "8px 16px",
                borderRadius: "12px",
                color: "var(--navy)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(16,28,68,0.03)"
              }}
            >
              ← Back to Main Dashboard
            </button>
          </div>
        )}
        {/* User Header Profile Card */}
        <div style={{ background: "#ffffff", borderRadius: 24, padding: "28px 32px", border: "1px solid var(--border)", marginBottom: 28, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.8rem", flexShrink: 0 }}>
            {authUser?.profile?.avatarUrl ? (
              <img src={authUser.profile.avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            ) : initials}
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "1.6rem", fontWeight: 900, color: "var(--navy)", margin: 0 }}>
                Welcome, {user.firstName}!
              </h2>
              <span style={{
                background: isTeacher ? "#fef3c7" : "rgba(16,28,68,0.06)",
                color: isTeacher ? "#b45309" : "var(--navy)",
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: "0.74rem",
                fontWeight: 800
              }}>
                {isTeacher ? "👨‍🏫 Teacher / Instructor" : `🎓 ${user.targetClass}`}
              </span>
            </div>
            <p style={{ color: "var(--text-3)", fontSize: "0.85rem", margin: "0 0 10px" }}>
              {user.email} · St. Lawrence Next Gen Academy
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/cbt" style={{ padding: "10px 18px", background: "var(--navy)", color: "#ffffff", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: "0.85rem" }}>
              Open CBT Platform →
            </Link>
          </div>
        </div>

        {/* Dashboard Layout: Sidebar + Tab Content */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28, alignItems: "start" }}>
          {/* Sidebar */}
          <div style={{ background: "#ffffff", borderRadius: 20, padding: 12, border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(({ label, icon, badge }) => {
              const active = activeTab === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "none",
                    background: active ? "var(--navy)" : "transparent",
                    color: active ? "#ffffff" : "var(--navy)",
                    fontWeight: active ? 800 : 600,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                  <span style={{ flex: 1 }}>{label}</span>
                  {badge && (
                    <span style={{ background: "#ef4444", color: "#ffffff", padding: "1px 6px", borderRadius: 10, fontSize: "0.72rem", fontWeight: 800 }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Area */}
          <div style={{ minWidth: 0 }}>
            {/* ── OVERVIEW TAB ── */}
            {activeTab === "Overview" && (
              isTeacher ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  <SchoolDashboardView
                    role="TEACHER"
                    stats={{
                      totalUsers: 240,
                      activeTeachers: 4,
                      premiumUsers: 48,
                      totalRevenue: 98,
                      coursesPublished: 6
                    }}
                    onNavigateTab={(tab) => {
                      if (tab === "Teachers" || tab === "Courses") navigate("/classrooms");
                      else if (tab === "Groups") setActiveTab("Groups");
                      else if (tab === "Users") setActiveTab("Friends");
                      else setActiveTab("Assignments Manager");
                    }}
                    onViewAllActivity={() => setActiveTab("Assignments Manager")}
                  />
                  
                  {/* Quick Teacher Portals */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                    <div
                      onClick={() => setActiveTab("Assignments Manager")}
                      className="dash-card"
                      style={{ padding: "20px", cursor: "pointer", background: "#ffffff" }}
                    >
                      <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>📝</div>
                      <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.95rem" }}>Assignments Manager</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 2 }}>Create and grade student work</div>
                    </div>

                    <div
                      onClick={() => setActiveTab("Question Bank")}
                      className="dash-card"
                      style={{ padding: "20px", cursor: "pointer", background: "#ffffff" }}
                    >
                      <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>💡</div>
                      <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.95rem" }}>Question Bank</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 2 }}>Contribute exam & mock questions</div>
                    </div>

                    <div
                      onClick={() => navigate("/classrooms")}
                      className="dash-card"
                      style={{ padding: "20px", cursor: "pointer", background: "#ffffff" }}
                    >
                      <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>🎥</div>
                      <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.95rem" }}>Video Classrooms</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 2 }}>Teach and schedule video lessons</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* Stats cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
                    <div className="dash-card" style={{ padding: "20px" }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>📚</div>
                      <div style={{ fontWeight: 700, color: "var(--text-3)", fontSize: "0.8rem" }}>Enrolled Subjects</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--navy)", marginTop: 2 }}>
                        {Array.isArray(authUser?.profile?.selectedSubjects) ? authUser.profile.selectedSubjects.length : 4}
                      </div>
                    </div>

                    <div className="dash-card" style={{ padding: "20px" }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>⏱️</div>
                      <div style={{ fontWeight: 700, color: "var(--text-3)", fontSize: "0.8rem" }}>CBT Practice</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--navy)", marginTop: 2 }}>
                        Available Now
                      </div>
                    </div>

                    <div className="dash-card" style={{ padding: "20px" }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: 4 }}>💡</div>
                      <div style={{ fontWeight: 700, color: "var(--text-3)", fontSize: "0.8rem" }}>TIPS Learning</div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--gold)", marginTop: 2 }}>
                        Active
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="dash-card" style={{ padding: "24px" }}>
                    <h3 style={{ fontFamily: "var(--font-h)", fontSize: "1.15rem", fontWeight: 900, color: "var(--navy)", margin: "0 0 16px" }}>
                      🚀 Quick Learning Portals
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                      <Link to="/cbt" style={{ textDecoration: "none" }}>
                        <div style={{ background: "rgba(16,28,68,0.03)", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1px solid var(--border)" }}>
                          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>⏱️</div>
                          <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.88rem" }}>CBT Exam Practice</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 2 }}>Timed tests & auto-grading</div>
                        </div>
                      </Link>

                      <Link to="/tips" style={{ textDecoration: "none" }}>
                        <div style={{ background: "rgba(16,28,68,0.03)", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1px solid var(--border)" }}>
                          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>💡</div>
                          <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.88rem" }}>TIPS Recall Library</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 2 }}>Mnemonics & formulas</div>
                        </div>
                      </Link>

                      <Link to="/resources" style={{ textDecoration: "none" }}>
                        <div style={{ background: "rgba(16,28,68,0.03)", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1px solid var(--border)" }}>
                          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>📚</div>
                          <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.88rem" }}>Resource Centre</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 2 }}>Notes, PDFs & revision</div>
                        </div>
                      </Link>

                      <Link to="/classrooms" style={{ textDecoration: "none" }}>
                        <div style={{ background: "rgba(16,28,68,0.03)", borderRadius: 14, padding: "18px 14px", textAlign: "center", border: "1px solid var(--border)" }}>
                          <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>📹</div>
                          <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "0.88rem" }}>Video Lessons</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 2 }}>Structured courses</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* ── LEARNING PROGRESS (STUDENT) ── */}
            {activeTab === "Learning Progress" && <ProgressTab />}

            {/* ── CBT HISTORY (STUDENT) ── */}
            {activeTab === "CBT History" && <CbtHistoryTab />}

            {/* ── ASSIGNMENTS (STUDENT) ── */}
            {activeTab === "Assignments" && <StudentAssignmentsTab />}

            {/* ── TEACHER ASSIGNMENTS MANAGER ── */}
            {activeTab === "Assignments Manager" && <TeacherAssignmentsTab />}

            {/* ── TEACHER QUESTION BANK ── */}
            {activeTab === "Question Bank" && <TeacherQuestionBankTab />}

            {/* ── MY COURSES / MY CLASSES ── */}
            {(activeTab === "My Courses" || activeTab === "My Classes") && (
              <div className="dash-card" style={{ padding: "36px", textAlign: "center" }}>
                <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>📚</div>
                <h4 style={{ fontFamily: "var(--font-h)", color: "var(--navy)", margin: "0 0 8px" }}>Video Classrooms</h4>
                <p style={{ color: "var(--text-2)", fontSize: "0.9rem", margin: "0 0 18px" }}>
                  Browse structured syllabus courses and track lesson progress.
                </p>
                <Link to="/classrooms" style={{ display: "inline-block", padding: "10px 22px", background: "var(--navy)", color: "#ffffff", borderRadius: 10, textDecoration: "none", fontWeight: 800 }}>
                  Browse Video Classrooms →
                </Link>
              </div>
            )}

            {/* ── FRIENDS ── */}
            {activeTab === "Friends" && <FriendsTab currentUserId={authUser?.id} />}

            {/* ── MESSAGES ── */}
            {activeTab === "Messages" && <MessagesTab />}

            {/* ── GROUPS ── */}
            {activeTab === "Groups" && <GroupsTab authUser={authUser} />}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "Notifications" && <NotificationsTab />}

            {/* ── SETTINGS ── */}
            {activeTab === "Settings" && <SettingsTab authUser={authUser} />}
          </div>
        </div>
      </div>
    </div>
  );
}
