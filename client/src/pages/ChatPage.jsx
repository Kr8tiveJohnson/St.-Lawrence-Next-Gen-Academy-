import { useEffect, useRef, useState } from "react";
import client from "../api/client";
import { getSocket } from "../api/socket";

export default function Chat() {
  const [friends, setFriends] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    client.get("/friends").then(({ data }) => setFriends(data.friends));

    const socket = getSocket();
    socket.connect();
    socketRef.current = socket;

    socket.on("chat:message", (msg) => {
      setMessages((prev) => (active && (msg.fromId === active.id || msg.toId === active.id) ? [...prev, msg] : prev));
    });

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openChat(friend) {
    setActive(friend);
    const { data } = await client.get(`/chat/with/${friend.username}`);
    setMessages(data.messages);
  }

  function send() {
    if (!draft.trim() || !active) return;
    socketRef.current.emit("chat:direct", { toUsername: active.username, content: draft }, (res) => {
      if (res?.error) return alert(res.error);
      setMessages((prev) => [...prev, res.message]);
      setDraft("");
    });
  }

  async function block() {
    if (!active) return;
    await client.post("/chat/block", { username: active.username });
    setActive(null);
  }

  async function report() {
    if (!active) return;
    const reason = prompt("Reason for report?");
    if (reason) await client.post("/chat/report", { username: active.username, reason });
  }

  return (
    <div className="product-homepage" style={{ minHeight: "100vh", background: "var(--off-white)", display: "flex", flexDirection: "column" }}>
      {/* ── TOP NAV ───────────────────────────────────── */}
      <nav className="nav" style={{ position: "sticky", top: 0, background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)", borderRadius: 0, borderBottom: "1px solid var(--border)", zIndex: 100 }}>
        <a href="/" className="nav-logo" style={{ textDecoration: "none" }}>
          <div style={{ fontSize: "1.8rem" }}>🎓</div>
          <div>
            <div className="nav-brand-name">ST. LAWRENCE</div>
            <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
          </div>
        </a>
        <div className="internal-page-actions" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/profile" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.8rem", textDecoration: "none" }}>Back to Profile</a>
        </div>
      </nav>

      <main className="wrap chat-page-main" style={{ flex: 1, padding: "40px 0", maxWidth: "1200px", width: "100%", display: "flex", gap: "24px" }}>
        {/* SIDEBAR: Friends List */}
        <div className="card chat-sidebar" style={{ width: 280, display: "flex", flexDirection: "column", padding: "20px", background: "var(--white)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 12px 32px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "1.2rem", color: "var(--navy)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>Messages</h3>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
            {friends.map((f) => {
              const isActive = active?.username === f.username;
              return (
                <div key={f.username} onClick={() => openChat(f)} style={{ padding: "12px", cursor: "pointer", borderRadius: "12px", background: isActive ? "rgba(10,22,40,0.04)" : "transparent", display: "flex", alignItems: "center", gap: "12px", transition: "var(--trans)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem" }}>
                    {f.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: isActive ? 800 : 600, color: "var(--navy)", fontSize: "0.95rem" }}>{f.username}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tap to chat</div>
                  </div>
                </div>
              );
            })}
            {friends.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "20px" }}>No friends added yet.</p>}
          </div>
        </div>

        {/* MAIN CHAT WINDOW */}
        <div className="card chat-window" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 600, background: "var(--white)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 12px 32px rgba(0,0,0,0.02)", overflow: "hidden", padding: 0 }}>
          {active ? (
            <>
              {/* Chat Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", padding: "20px 24px", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2rem" }}>
                    {active.username.charAt(0).toUpperCase()}
                  </div>
                  <strong style={{ fontSize: "1.2rem", color: "var(--navy)" }}>{active.username}</strong>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn-ghost" onClick={report} style={{ padding: "6px 12px", fontSize: "0.8rem", color: "var(--text-muted)" }}>Report</button>
                  <button className="btn-ghost" onClick={block} style={{ padding: "6px 12px", fontSize: "0.8rem", color: "#dc2626" }}>Block</button>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", background: "var(--off-white)" }}>
                {messages.map((m, i) => {
                  const isMine = m.fromId !== active.id; // basic check, assuming if it's not from active, it's mine
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "75%",
                        padding: "12px 16px",
                        borderRadius: "18px",
                        background: isMine ? "var(--navy)" : "var(--white)",
                        color: isMine ? "var(--white)" : "var(--navy)",
                        border: isMine ? "none" : "1px solid var(--border)",
                        boxShadow: isMine ? "0 4px 12px rgba(10,22,40,0.1)" : "0 2px 8px rgba(0,0,0,0.02)",
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        borderBottomRightRadius: isMine ? "4px" : "18px",
                        borderBottomLeftRadius: !isMine ? "4px" : "18px"
                      }}>
                        {m.content}
                      </div>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginTop: "6px", marginInline: "4px" }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div style={{ display: "flex", gap: 12, padding: "20px 24px", borderTop: "1px solid var(--border)", background: "var(--white)", alignItems: "center" }}>
                <input 
                  value={draft} 
                  onChange={(e) => setDraft(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && send()} 
                  placeholder="Type a message…" 
                  style={{ flex: 1, padding: "14px 20px", borderRadius: "100px", border: "1px solid var(--border)", background: "var(--off-white)", outline: "none", fontSize: "0.95rem" }}
                />
                <button onClick={send} style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "var(--trans)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "4rem", marginBottom: "16px", opacity: 0.5 }}>💬</div>
              <h3 style={{ color: "var(--navy)", fontSize: "1.2rem", marginBottom: "8px" }}>Select a conversation</h3>
              <p>Choose a friend from the sidebar to start chatting.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

