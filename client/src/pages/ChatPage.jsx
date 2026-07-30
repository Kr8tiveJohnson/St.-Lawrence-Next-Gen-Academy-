import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

function getInitials(name = "") {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : (parts[0]?.[0] || "?").toUpperCase();
}

export default function ChatPage() {
  const { user: authUser } = useAuth();
  const [friends, setFriends]     = useState([]);
  const [active, setActive]       = useState(null);   // selected friend object
  const [messages, setMessages]   = useState([]);
  const [draft, setDraft]         = useState("");
  const [sending, setSending]     = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);

  // Load friends list
  useEffect(() => {
    client.get("/friends")
      .then(({ data }) => setFriends(data.friends || []))
      .catch(() => {});
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 3s when a chat is open
  const loadMessages = useCallback(async (friend) => {
    if (!friend) return;
    try {
      const { data } = await client.get(`/chat/rooms/${friend.id}/messages`);
      setMessages(data.messages || []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (!active) return;
    setLoadingMsgs(true);
    loadMessages(active).finally(() => setLoadingMsgs(false));

    // Poll every 3 seconds for new messages
    pollRef.current = setInterval(() => loadMessages(active), 3000);
    return () => clearInterval(pollRef.current);
  }, [active, loadMessages]);

  function openChat(friend) {
    clearInterval(pollRef.current);
    setActive(friend);
    setMessages([]);
  }

  async function send() {
    if (!draft.trim() || !active || sending) return;
    setSending(true);
    try {
      const { data } = await client.post("/chat/messages", {
        receiverId: active.id,
        content: draft.trim(),
      });
      setMessages(prev => [...prev, data.message]);
      setDraft("");
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  function getFriendName(f) {
    return f.profile?.fullName || f.email?.split("@")[0] || "Unknown";
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--off-white)", display: "flex", flexDirection: "column" }}>

      {/* ── TOP NAV ── */}
      <nav className="nav" style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderRadius: 0, borderBottom: "1px solid var(--border)", zIndex: 100 }}>
        <Link to="/" className="nav-logo" style={{ textDecoration: "none" }}>
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
          <div>
            <div className="nav-brand-name" style={{ color: "var(--navy)" }}>ST. LAWRENCE</div>
            <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
          </div>
        </Link>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/groups" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>Study Groups</Link>
          <Link to="/profile" className="btn-ghost" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>Dashboard</Link>
        </div>
      </nav>

      {/* ── CHAT LAYOUT ── */}
      <main style={{ flex: 1, display: "flex", gap: 0, maxWidth: 1100, margin: "0 auto", width: "100%", padding: "32px 20px", gap: 20 }}>

        {/* SIDEBAR */}
        <div style={{ width: 270, display: "flex", flexDirection: "column", background: "var(--white)", borderRadius: 20, border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--navy)", fontFamily: "var(--font-h)" }}>
              💬 Messages
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--text-3)" }}>
              {friends.length} friend{friends.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {friends.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text-3)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🤝</div>
                <p style={{ fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>No friends yet.</p>
                <p style={{ fontSize: "0.78rem", marginTop: 6 }}>Add friends from your Dashboard → Friends tab.</p>
              </div>
            ) : (
              friends.map(f => {
                const isActive = active?.id === f.id;
                const name = getFriendName(f);
                return (
                  <div
                    key={f.id}
                    onClick={() => openChat(f)}
                    style={{
                      padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                      background: isActive ? "rgba(15,33,68,0.06)" : "transparent",
                      borderLeft: isActive ? "3px solid var(--navy)" : "3px solid transparent",
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0 }}>
                      {getInitials(name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: isActive ? 800 : 600, color: "var(--navy)", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                      <div style={{ fontSize: "0.73rem", color: "var(--text-3)" }}>Tap to chat</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MAIN CHAT WINDOW */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 560, background: "var(--white)", borderRadius: 20, border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          {active ? (
            <>
              {/* Chat Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", padding: "16px 24px", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--navy)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem" }}>
                    {getInitials(getFriendName(active))}
                  </div>
                  <div>
                    <strong style={{ fontSize: "1rem", color: "var(--navy)", display: "block" }}>{getFriendName(active)}</strong>
                    <span style={{ fontSize: "0.73rem", color: "#22c55e", fontWeight: 600 }}>● Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12, background: "#f8fafc" }}>
                {loadingMsgs && messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: "0.85rem", padding: 20 }}>Loading messages...</div>
                )}
                {!loadingMsgs && messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: "0.85rem", padding: 40 }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>👋</div>
                    <p style={{ fontWeight: 600, margin: 0 }}>Say hi to {getFriendName(active)}!</p>
                    <p style={{ fontSize: "0.78rem", marginTop: 4 }}>This is the beginning of your conversation.</p>
                  </div>
                )}
                {messages.map((m, i) => {
                  const isMine = m.senderId === authUser?.id;
                  return (
                    <div key={m.id || i} style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "72%", padding: "10px 16px", borderRadius: 18,
                        background: isMine ? "var(--navy)" : "#fff",
                        color: isMine ? "#fff" : "var(--navy)",
                        border: isMine ? "none" : "1px solid var(--border)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        fontSize: "0.92rem", lineHeight: 1.5,
                        borderBottomRightRadius: isMine ? 4 : 18,
                        borderBottomLeftRadius: !isMine ? 4 : 18,
                      }}>
                        {m.content}
                      </div>
                      <span style={{ color: "var(--text-3)", fontSize: "0.68rem", marginTop: 4, marginInline: 4 }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ display: "flex", gap: 10, padding: "16px 20px", borderTop: "1px solid var(--border)", background: "#fff", alignItems: "center" }}>
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Type a message…"
                  style={{ flex: 1, padding: "12px 18px", borderRadius: 100, border: "1px solid var(--border)", background: "#f8fafc", outline: "none", fontSize: "0.92rem", fontFamily: "inherit" }}
                />
                <button
                  onClick={send}
                  disabled={sending || !draft.trim()}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: sending || !draft.trim() ? "#e2e8f0" : "var(--navy)", color: sending || !draft.trim() ? "#94a3b8" : "var(--gold)", border: "none", cursor: sending || !draft.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-3)", gap: 12 }}>
              <div style={{ fontSize: "4rem", opacity: 0.4 }}>💬</div>
              <h3 style={{ color: "var(--navy)", fontSize: "1.15rem", margin: 0 }}>Select a conversation</h3>
              <p style={{ fontSize: "0.88rem", margin: 0 }}>Choose a friend from the sidebar to start chatting.</p>
              {friends.length === 0 && (
                <Link to="/profile" style={{ marginTop: 8, padding: "10px 20px", background: "var(--navy)", color: "#fff", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
                  Add Friends →
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
