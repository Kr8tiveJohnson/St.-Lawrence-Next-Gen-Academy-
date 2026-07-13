import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem("sl_token", "demo_token_123");
      const user = JSON.parse(localStorage.getItem("sl_user")) || {
        firstName: "Student",
        role: "Student",
      };
      localStorage.setItem("sl_user", JSON.stringify(user));
      navigate("/profile");
    }, 1200);
  };

  return (
    <div
      className="auth-page login-page product-auth-page"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--off-white)",
      }}
    >
      <div
        className="wrap login-layout"
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "0.95fr 1.05fr",
          gap: "28px",
          alignItems: "center",
          paddingTop: "120px",
          paddingBottom: "60px",
        }}
      >
        <div
          className="login-side-panel"
          style={{
            background: "linear-gradient(145deg, #0f2040, #173463)",
            color: "var(--white)",
            borderRadius: "32px",
            padding: "36px",
            position: "relative",
            overflow: "hidden",
            minHeight: "520px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-120px",
              right: "-80px",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(212,168,83,0.18), transparent 70%)",
            }}
          />

          <Link
            to="/"
            className="nav-logo"
            style={{ color: "var(--white)", position: "relative", zIndex: 1 }}
          >
            <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
            <div>
              <div className="nav-brand-name" style={{ color: "var(--white)" }}>
                ST. LAWRENCE
              </div>
              <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
            </div>
          </Link>

          <div style={{ margin: "auto 0", position: "relative", zIndex: 1 }}>
            <div
              className="portal-mini-label"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "var(--white)",
                marginBottom: "18px",
              }}
            >
              Student Access Portal
            </div>
            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontFamily: "var(--font-h)",
                fontWeight: 900,
                lineHeight: 1.05,
                marginBottom: "16px",
              }}
            >
              Welcome back to your learning dashboard
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
                maxWidth: "480px",
              }}
            >
              Sign in to continue lessons, review exam practice, join
              classrooms, and manage your student progress in one place.
            </p>

            <div
              className="login-feature-stack"
              style={{ display: "grid", gap: "14px", marginTop: "28px" }}
            >
              {[
                "Continue courses and exam prep",
                "View certificates and progress history",
                "Access community rooms and groups",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "var(--gold)" }}>•</span>
                  <span style={{ color: "rgba(255,255,255,0.82)" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="auth-shell login-shell"
          style={{ width: "100%", maxWidth: "520px", marginInline: "auto" }}
        >
          <div className="auth-header" style={{ marginBottom: "28px" }}>
            <div className="portal-eyebrow" style={{ marginBottom: "16px" }}>
              Sign In
            </div>
            <h2
              style={{
                fontSize: "2.2rem",
                fontFamily: "var(--font-h)",
                fontWeight: 900,
                color: "var(--navy)",
                marginBottom: "8px",
              }}
            >
              Access your account
            </h2>
            <p
              style={{
                color: "var(--text-2)",
                fontSize: "0.98rem",
                lineHeight: 1.7,
              }}
            >
              Enter your details to return to your student dashboard and
              continue your learning journey.
            </p>
          </div>

          <div
            className="auth-card login-card"
            style={{
              background: "var(--white)",
              padding: "36px",
              borderRadius: "32px",
              border: "1px solid var(--border)",
              boxShadow: "0 18px 42px rgba(10,22,40,0.06)",
            }}
          >
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--text-3)",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "14px",
                    border: "1px solid var(--border)",
                    outline: "none",
                    fontSize: "1rem",
                    fontFamily: "var(--font-b)",
                    background: "#fbfcff",
                  }}
                  placeholder="jane@example.com"
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div
                  className="login-password-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--text-3)",
                      textTransform: "uppercase",
                    }}
                  >
                    Password
                  </label>
                  <Link
                    to="#"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      textDecoration: "none",
                    }}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "14px",
                    border: "1px solid var(--border)",
                    outline: "none",
                    fontSize: "1rem",
                    fontFamily: "var(--font-b)",
                    background: "#fbfcff",
                  }}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "16px",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "28px" }}>
              <span style={{ color: "var(--text-2)", fontSize: "0.92rem" }}>
                Don&apos;t have an account?{" "}
              </span>
              <Link
                to="/register"
                style={{
                  color: "var(--navy)",
                  fontWeight: 800,
                  textDecoration: "none",
                  fontSize: "0.92rem",
                }}
              >
                Create one
              </Link>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Link
                to="/"
                style={{
                  color: "var(--text-3)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  opacity: 0.7,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
