import { useState } from "react";
import { Link } from "react-router-dom";
import Browser from "../features/past-questions/Browser";
import QuestionViewer from "../features/past-questions/QuestionViewer";
import Bookmarks from "../features/past-questions/Bookmarks";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

const TABS = ["Practice", "Bookmarks"];

export default function PastQuestionsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("Practice");
  const [questions, setQuestions] = useState([]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleSelect = (q) => {
    setSelectedQuestion(q);
  };

  return (
    <div style={{ background: "var(--off-white)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* NAV */}
      <nav className="nav internal-page-nav" style={{ padding: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
          <Link to="/" className="nav-logo" style={{ textDecoration: "none" }}>
            <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
            <div>
              <div className="nav-brand-name">ST. LAWRENCE</div>
              <div className="nav-brand-sub hide-on-mobile">NEXT GEN ACADEMY</div>
            </div>
          </Link>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link to="/profile" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>My Profile</Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "40px 24px", maxWidth: "1200px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--navy)", margin: "0 0 8px 0" }}>Past Questions</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Browse WAEC, JAMB, NECO & GCE questions by subject and year.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", borderBottom: "2px solid var(--border)" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "10px 20px", border: "none", background: "none", cursor: "pointer",
              fontWeight: tab === t ? 800 : 500, fontSize: "0.95rem",
              color: tab === t ? "var(--navy)" : "var(--text-muted)",
              borderBottom: tab === t ? "2px solid var(--navy)" : "2px solid transparent",
              marginBottom: "-2px"
            }}>{t}</button>
          ))}
        </div>

        {tab === "Practice" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
            <div>
              <h3 style={{ color: "var(--navy)", fontSize: "1rem", marginBottom: "16px" }}>📚 Browse Questions</h3>
              <Browser onSelect={handleSelect} />
            </div>
            <div>
              <h3 style={{ color: "var(--navy)", fontSize: "1rem", marginBottom: "16px" }}>📖 Answer Question</h3>
              <QuestionViewer question={selectedQuestion} />
            </div>
          </div>
        )}

        {tab === "Bookmarks" && <Bookmarks />}
      </main>
    </div>
  );
}
