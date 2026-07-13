import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Classrooms() {
  const { isTeacher, user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [requestForm, setRequestForm] = useState({ groupName: "", type: "CLASSROOM", reason: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    client.get("/groups").then(({ data }) => setGroups(data.groups));
  }, []);

  const canRequest = isTeacher || user?.role === "STUDENT";

  async function submitRequest(e) {
    e.preventDefault();
    setMessage("");
    try {
      await client.post("/groups/requests", requestForm);
      setMessage("Request sent to admins for review.");
      setRequestForm({ groupName: "", type: "CLASSROOM", reason: "" });
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not submit request");
    }
  }

  return (
    <div className="product-homepage" style={{ minHeight: "100vh", background: "var(--off-white)", display: "flex", flexDirection: "column" }}>
      {/* ── TOP NAV ───────────────────────────────────── */}
      <nav className="nav internal-page-nav" style={{ padding: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
          <a href="/" className="nav-logo" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "1.8rem" }}>🎓</div>
            <div>
              <div className="nav-brand-name">ST. LAWRENCE</div>
              <div className="nav-brand-sub hide-on-mobile">NEXT GEN ACADEMY</div>
            </div>
          </a>
          <div className="internal-page-actions" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a href="/profile" className="nav-cta" style={{ background: "transparent", color: "var(--navy)", border: "1px solid var(--border)", textDecoration: "none" }}>
              Back to Profile
            </a>
          </div>
        </div>
      </nav>

      <main className="wrap" style={{ flex: 1, padding: "60px 0", maxWidth: "1000px", width: "100%" }}>
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "2.4rem", color: "var(--navy)", margin: "0 0 12px 0" }}>Classrooms & Groups</h1>
            <p style={{ color: "var(--text-light)", fontSize: "1.1rem", margin: 0 }}>Join focused sessions, revision labs, and cohort teaching rooms.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {groups.map((g) => (
            <div key={g.id} className="card" style={{ display: "flex", flexDirection: "column", padding: "24px", background: "var(--white)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 12px 32px rgba(0,0,0,0.02)", transition: "transform 0.2s ease", cursor: "pointer" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ width: 48, height: 48, borderRadius: "12px", background: g.isPaid ? "rgba(212,168,83,0.15)" : "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                  {g.type === "CLASSROOM" ? "🏫" : g.type === "CHATROOM" ? "💬" : "👥"}
                </div>
                <div style={{ display: "flex", gap: "6px", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ 
                    background: g.isPaid ? "rgba(212,168,83,0.15)" : "rgba(34,197,94,0.15)", 
                    color: g.isPaid ? "#b45309" : "#16a34a", 
                    padding: "4px 10px", 
                    borderRadius: "8px", 
                    fontSize: "0.75rem", 
                    fontWeight: 800,
                    textTransform: "uppercase" 
                  }}>
                    {g.isPaid ? "Premium" : "Free"}
                  </span>
                  {g.isGeneralClass && (
                    <span style={{ background: "var(--navy)", color: "var(--white)", padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 800 }}>
                      General Class
                    </span>
                  )}
                </div>
              </div>
              <h3 style={{ fontSize: "1.25rem", color: "var(--navy)", marginBottom: "6px" }}>{g.name}</h3>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "capitalize" }}>{g.type.toLowerCase()}</div>
              
              <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: g.isPaid ? "var(--gold)" : "var(--navy)", color: g.isPaid ? "var(--navy)" : "var(--white)" }}>
                  Enter {g.type.toLowerCase()}
                </button>
              </div>
            </div>
          ))}
          {groups.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", background: "var(--white)", borderRadius: "20px", border: "1px dashed var(--border)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.5 }}>🏫</div>
              <h3 style={{ color: "var(--navy)", marginBottom: "8px" }}>No classrooms yet</h3>
              <p style={{ color: "var(--text-muted)" }}>You're not enrolled in any classrooms yet — enrollment is managed by an admin.</p>
            </div>
          )}
        </div>

        {canRequest && (
          <div className="card" style={{ maxWidth: 600, background: "var(--white)", borderRadius: "24px", padding: "40px", border: "1px solid var(--border)", boxShadow: "0 12px 32px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📝</div>
              <div>
                <h3 style={{ fontSize: "1.4rem", color: "var(--navy)", marginBottom: "6px" }}>Request a new classroom / group</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  An admin will review and grant this free or conditional on payment. Once granted, you manage it yourself.
                </p>
              </div>
            </div>
            
            <form onSubmit={submitRequest} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name</label>
                <input required value={requestForm.groupName} onChange={(e) => setRequestForm({ ...requestForm, groupName: e.target.value })} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "1rem", outline: "none", background: "var(--off-white)" }} placeholder="e.g. Intensive Math Revision" />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</label>
                <select value={requestForm.type} onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "1rem", outline: "none", background: "var(--off-white)", cursor: "pointer" }}>
                  <option value="CLASSROOM">Classroom</option>
                  <option value="GROUP">Group</option>
                  <option value="CHATROOM">Chat room</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Reason</label>
                <textarea required value={requestForm.reason} onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "1rem", outline: "none", background: "var(--off-white)", minHeight: "100px", resize: "vertical" }} placeholder="Why do you need this space?" />
              </div>
              
              {message && (
                <div style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", padding: "12px 16px", borderRadius: "12px", fontSize: "0.95rem", fontWeight: 600 }}>
                  ✓ {message}
                </div>
              )}
              
              <button className="btn-primary" style={{ marginTop: "8px", padding: "14px", justifyContent: "center", fontSize: "1.05rem" }}>
                Submit Request
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

