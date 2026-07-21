import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CourseList from "../features/classrooms/CourseList";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import client from "../api/client";

export default function ClassroomsPage() {
  const { isTeacher, user } = useAuth();
  const [showRequest, setShowRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({ groupName: "", type: "CLASSROOM", reason: "" });
  const [message, setMessage] = useState("");

  async function submitRequest(e) {
    e.preventDefault();
    setMessage("");
    try {
      await client.post("/groups/requests", requestForm);
      setMessage("Request sent to admins for review.");
      setRequestForm({ groupName: "", type: "CLASSROOM", reason: "" });
      setShowRequest(false);
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not submit request");
    }
  }

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
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {(isTeacher || user?.role === "STUDENT") && (
              <button
                onClick={() => setShowRequest(v => !v)}
                className="btn-ghost"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                + Request Classroom
              </button>
            )}
            <Link to="/profile" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>My Profile</Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: "40px 24px", maxWidth: "1200px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", color: "var(--navy)", margin: "0 0 8px 0" }}>Video Classrooms</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Watch lessons, track progress and learn at your own pace.</p>
        </div>

        {/* Request Form */}
        {showRequest && (
          <div style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.04)", maxWidth: "560px", marginBottom: "32px" }}>
            <h3 style={{ color: "var(--navy)", marginBottom: "20px" }}>Request a New Classroom / Group</h3>
            {message && (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", padding: "12px 16px", color: "#16a34a", fontSize: "0.9rem", marginBottom: "16px" }}>
                ✓ {message}
              </div>
            )}
            <form onSubmit={submitRequest} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}>Name</label>
                <input required value={requestForm.groupName} onChange={e => setRequestForm({ ...requestForm, groupName: e.target.value })}
                  placeholder="e.g. Intensive Math Revision"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "0.9rem", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}>Type</label>
                <select value={requestForm.type} onChange={e => setRequestForm({ ...requestForm, type: e.target.value })}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "0.9rem" }}>
                  <option value="CLASSROOM">Classroom</option>
                  <option value="GROUP">Study Group</option>
                  <option value="CHATROOM">Chat Room</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}>Reason</label>
                <textarea required value={requestForm.reason} onChange={e => setRequestForm({ ...requestForm, reason: e.target.value })}
                  placeholder="Why do you need this space?" rows={3}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border)", fontSize: "0.9rem", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="btn-primary">Submit Request</button>
                <button type="button" onClick={() => setShowRequest(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Course Grid */}
        <CourseList />
      </main>
    </div>
  );
}
