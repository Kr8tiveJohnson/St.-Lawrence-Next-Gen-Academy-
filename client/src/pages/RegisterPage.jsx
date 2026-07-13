import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "Student",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    country: "Nigeria",
    state: "",
    phone: "",
    examBody: "JAMB",
  });

  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else {
      // Simulate registration
      localStorage.setItem("sl_token", "demo_token_123");
      localStorage.setItem("sl_user", JSON.stringify(formData));
      navigate("/profile");
    }
  };

  return (
    <div
      className="auth-page register-page product-auth-page"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--white)",
      }}
    >
      {/* LEFT SIDE - BRANDING */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(145deg, #0f2040, #173463)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          color: "var(--white)",
        }}
        className="hide-on-mobile register-brand-panel"
      >
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "-200px",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <Link
          to="/"
          className="nav-logo"
          style={{ color: "var(--white)", zIndex: 10 }}
        >
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
          <div>
            <div className="nav-brand-name" style={{ color: "var(--white)" }}>
              ST. LAWRENCE
            </div>
            <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
          </div>
        </Link>

        <div style={{ margin: "auto 0", zIndex: 10, maxWidth: "480px" }}>
          <div
            className="portal-mini-label"
            style={{
              display: "inline-block",
              padding: "6px 12px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "var(--r-full)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "24px",
              color: "var(--white)",
            }}
          >
            Join 16.5k+ Students
          </div>
          <h1
            style={{
              fontSize: "3rem",
              fontFamily: "var(--font-h)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            Start your journey to{" "}
            <span style={{ color: "var(--gold)" }}>global excellence.</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
            }}
          >
            Get unlimited access to top-tier technical courses, globally
            recognized certifications, and comprehensive exam preparations.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div
        className="register-form-panel"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          className="auth-shell register-shell register-card-shell"
          style={{ width: "100%", maxWidth: "440px" }}
        >
          <div
            className="register-progress"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: "32px",
                    height: "4px",
                    borderRadius: "2px",
                    background: step >= s ? "var(--gold)" : "var(--border)",
                    transition: "var(--trans)",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--text-3)",
                fontWeight: 700,
              }}
            >
              Step {step} of 3
            </div>
          </div>

          <div className="portal-eyebrow" style={{ marginBottom: "16px" }}>
            Create Account
          </div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              color: "var(--navy)",
              marginBottom: "8px",
              fontFamily: "var(--font-h)",
            }}
          >
            {step === 1
              ? "Choose your role"
              : step === 2
                ? "Create your account"
                : "Personalize your learning"}
          </h2>
          <p
            style={{
              color: "var(--text-2)",
              marginBottom: "32px",
              fontSize: "0.95rem",
            }}
          >
            {step === 1
              ? "Are you here to learn or to teach?"
              : step === 2
                ? "Enter your details to get started."
                : "What exams are you preparing for?"}
          </p>

          <form onSubmit={handleNext}>
            {step === 1 && (
              <div
                className="register-role-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {["Student", "Teacher"].map((r) => (
                  <div
                    key={r}
                    className="register-role-card"
                    onClick={() => setFormData({ ...formData, role: r })}
                    style={{
                      padding: "20px",
                      borderRadius: "16px",
                      border:
                        formData.role === r
                          ? "2px solid var(--gold)"
                          : "1px solid var(--border)",
                      background:
                        formData.role === r
                          ? "rgba(212,168,83,0.05)"
                          : "var(--white)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "var(--trans)",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--navy)",
                        fontSize: "1.05rem",
                      }}
                    >
                      {r}
                    </span>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor:
                          formData.role === r ? "var(--gold)" : "var(--border)",
                        padding: "2px",
                      }}
                    >
                      {formData.role === r && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "var(--gold)",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  className="register-name-row"
                  style={{ display: "flex", gap: "16px" }}
                >
                  <div style={{ flex: 1 }}>
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
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        outline: "none",
                        fontSize: "1rem",
                        fontFamily: "var(--font-b)",
                      }}
                      placeholder="Jane"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
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
                      Last Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        outline: "none",
                        fontSize: "1rem",
                        fontFamily: "var(--font-b)",
                      }}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "1rem",
                      fontFamily: "var(--font-b)",
                    }}
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
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
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "1rem",
                      fontFamily: "var(--font-b)",
                    }}
                    placeholder="••••••••"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase" }}>
                    Date of Birth *
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "1rem", fontFamily: "var(--font-b)", background: "var(--white)", color: formData.dateOfBirth ? "var(--navy)" : "var(--text-3)" }}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase" }}>
                    Gender *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "1rem", fontFamily: "var(--font-b)", background: "var(--white)", color: formData.gender ? "var(--navy)" : "var(--text-3)" }}
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Country & State */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase" }}>
                      Country *
                    </label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value, state: "" })}
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "1rem", fontFamily: "var(--font-b)", background: "var(--white)" }}
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase" }}>
                      State *
                    </label>
                    <select
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "1rem", fontFamily: "var(--font-b)", background: "var(--white)", color: formData.state ? "var(--navy)" : "var(--text-3)" }}
                    >
                      <option value="" disabled>Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "8px", textTransform: "uppercase" }}>
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "1rem", fontFamily: "var(--font-b)" }}
                    placeholder="+234 800 000 0000"
                  />
                </div>

                {/* Privacy Notice */}
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", background: "rgba(15,32,64,0.05)", padding: "14px", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>🔒</span>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-2)", margin: 0, lineHeight: 1.6 }}>
                    Your personal details (full name, date of birth, phone) are <strong>private</strong> and only visible to administrators.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div>
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
                    Primary Goal
                  </label>
                  <select
                    value={formData.examBody}
                    onChange={(e) =>
                      setFormData({ ...formData, examBody: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "1rem",
                      fontFamily: "var(--font-b)",
                      background: "var(--white)",
                    }}
                  >
                    <option>Pass JAMB</option>
                    <option>Pass WAEC</option>
                    <option>Pass NECO</option>
                    <option>Learn a Tech Skill</option>
                    <option>Become a Virtual Assistant</option>
                  </select>
                </div>
                <div
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    padding: "16px",
                    borderRadius: "12px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>✅</span>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#16a34a",
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Your free account includes access to select introductory
                    lessons and past questions.
                  </p>
                </div>
              </div>
            )}

            <div
              className="register-actions"
              style={{ display: "flex", gap: "12px", marginTop: "40px" }}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-ghost"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {step === 3 ? "Complete Registration" : "Continue"}
              </button>
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
                fontSize: "0.9rem",
                color: "var(--text-2)",
                fontWeight: 500,
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--gold)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Log In
              </Link>
            </div>

            <div style={{ textAlign: "center", marginTop: "12px" }}>
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
          </form>
        </div>
      </div>
    </div>
  );
}
