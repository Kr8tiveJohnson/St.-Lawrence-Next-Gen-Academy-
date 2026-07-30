import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
    avatarUrl: "",
  });

  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ── Password rules ────────────────────────────────────────────────
  const p = formData.password || "";
  const ruleChecks = [
    { label: "Starts with an uppercase letter", met: /^[A-Z]/.test(p) },
    { label: "At least 12 characters", met: p.length >= 12 },
    { label: "At least one lowercase letter", met: /[a-z]/.test(p) },
    { label: "At least one digit", met: /\d/.test(p) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(p) }
  ];
  const metCount = ruleChecks.filter(r => r.met).length;
  const progressPercent = (metCount / ruleChecks.length) * 100;

  // ── Email domains for autocomplete ───────────────────────────────
  const EMAIL_DOMAINS = [
    "@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com",
    "@icloud.com", "@protonmail.com", "@live.com", "@yahoo.co.uk",
    "@googlemail.com", "@me.com"
  ];

  // ── Email change handler ──────────────────────────────────────────
  const handleEmailChange = (val) => {
    setFormData({ ...formData, email: val });
    const atIdx = val.lastIndexOf("@");
    if (atIdx !== -1) {
      const typed = val.slice(atIdx);
      const filtered = EMAIL_DOMAINS.filter(d => d.startsWith(typed) && d !== typed);
      setEmailSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setEmailSuggestions([]);
      setShowSuggestions(false);
    }
    // validate
    if (val && !val.includes("@")) {
      setEmailError("Email must include '@'. Please enter a valid email address.");
    } else if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError("Please enter a complete, valid email (e.g. jane@gmail.com).");
    } else {
      setEmailError("");
    }
  };

  const applyEmailSuggestion = (domain) => {
    const base = formData.email.slice(0, formData.email.lastIndexOf("@"));
    setFormData({ ...formData, email: base + domain });
    setShowSuggestions(false);
    setEmailError("");
  };

  // ── Phone change handler ──────────────────────────────────────────
  const handlePhoneChange = (raw) => {
    // Strip everything except digits and leading +
    let digits = raw.replace(/[^\d]/g, "");

    // Remove leading 0 if present after country code stripping
    if (digits.startsWith("234")) {
      // already has 234
    } else if (digits.startsWith("0")) {
      // replace leading 0 with 234
      digits = "234" + digits.slice(1);
    } else {
      digits = "234" + digits.replace(/^234/, "");
    }

    const formatted = "+" + digits;
    setFormData({ ...formData, phone: formatted });

    if (digits.length < 13) {
      setPhoneError("Phone number is incomplete. Format: +234 followed by 10 digits.");
    } else if (digits.length > 13) {
      setPhoneError("Phone number is too long. Please enter exactly 10 digits after +234.");
    } else {
      setPhoneError("");
    }
  };

  // ── Guard step 2 advancement ──────────────────────────────────────
  const step2Valid = (
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    /^\+2347[\d]{9}$|^\+2348[\d]{9}$|^\+234[1-9][\d]{9}$/.test(formData.phone) &&
    formData.dateOfBirth.trim().length > 0 &&
    formData.gender.trim().length > 0 &&
    formData.state.trim().length > 0 &&
    metCount === 5
  );

  // ── Guard step 3 advancement ──────────────────────────────────────
  const step3Valid = agreedToTerms;

  const handleNext = async (e) => {
    e.preventDefault();
    setError("");
    if (step < 3) {
      if (step === 2 && !step2Valid) {
        if (metCount < 5) {
          setError("Please ensure your password meets all required security rules before proceeding.");
        } else if (phoneError || !/^\+234[1-9]\d{9}$/.test(formData.phone)) {
          setError("Please enter a valid Nigerian phone number starting with +234.");
        } else if (emailError || !formData.email.includes("@")) {
          setError("Please enter a valid email address.");
        }
        return;
      }
      setStep(step + 1);
    } else {
      try {
        const payload = {
          email: formData.email,
          password: formData.password,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          role: formData.role,
          avatarUrl: formData.avatarUrl || undefined,
        };
        await register(payload);
        navigate("/profile");
      } catch (err) {
        setError(err.response?.data?.error || "Registration failed. Please try again.");
      }
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

      <div
        className="register-form-panel"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          background: "var(--off-white)",
        }}
      >
        <div
          className="auth-shell register-shell register-card-shell"
          style={{
            width: "100%",
            maxWidth: step === 2 ? "620px" : "480px",
            background: "var(--white)",
            padding: "40px",
            borderRadius: "32px",
            border: "1px solid var(--border)",
            boxShadow: "0 20px 48px rgba(10,22,40,0.06)",
            transition: "max-width 0.3s var(--ease)",
          }}
        >
          <div
            className="register-progress"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: "36px",
                    height: "5px",
                    borderRadius: "3px",
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

          <div className="portal-eyebrow" style={{ marginBottom: "12px" }}>
            Create Account
          </div>
          <h2
            style={{
              fontSize: "2.1rem",
              fontWeight: 900,
              color: "var(--navy)",
              marginBottom: "8px",
              fontFamily: "var(--font-h)",
              letterSpacing: "-0.02em",
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
              marginBottom: "28px",
              fontSize: "0.95rem",
              lineHeight: "1.5",
            }}
          >
            {step === 1
              ? "Are you here to learn or to teach?"
              : step === 2
                ? "Enter your details to get started."
                : "What exams are you preparing for?"}
          </p>

          {error && (
            <div style={{ marginBottom: "20px", padding: "12px", background: "#fee2e2", color: "#dc2626", borderRadius: "8px", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

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
                {[
                  { id: "Student", label: "Student", desc: "Access study materials, practice past CBT questions, and track lessons.", icon: "🎓" },
                  { id: "Teacher", label: "Teacher", desc: "Publish assignments, schedule lectures, and manage classrooms.", icon: "👨‍🏫" }
                ].map((item) => (
                  <div
                    key={item.id}
                    className="register-role-card"
                    onClick={() => setFormData({ ...formData, role: item.id })}
                    style={{
                      padding: "20px",
                      borderRadius: "16px",
                      border:
                        formData.role === item.id
                          ? "2px solid var(--gold)"
                          : "1px solid var(--border)",
                      background:
                        formData.role === item.id
                          ? "rgba(212,168,83,0.04)"
                          : "var(--white)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      transition: "all 0.2s var(--ease)",
                    }}
                  >
                    <span style={{ fontSize: "2rem", lineHeight: 1 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          display: "block",
                          fontWeight: 700,
                          color: "var(--navy)",
                          fontSize: "1.05rem",
                          marginBottom: "4px",
                        }}
                      >
                        {item.label}
                      </span>
                      <span style={{ display: "block", fontSize: "0.85rem", color: "var(--text-2)", lineHeight: "1.4" }}>
                        {item.desc}
                      </span>
                    </div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor:
                          formData.role === item.id ? "var(--gold)" : "var(--border)",
                        padding: "2px",
                      }}
                    >
                      {formData.role === item.id && (
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
                {formData.role === "Teacher" && (
                  <div style={{ padding: "14px", background: "rgba(212,168,83,0.08)", borderRadius: "12px", fontSize: "0.85rem", color: "var(--navy)", borderLeft: "4px solid var(--gold)", lineHeight: "1.5" }}>
                    <strong>Note:</strong> Teacher accounts require manual admin verification before you can publish classrooms or resources.
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Row 1: Name Fields */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-b)" }}
                      placeholder="Jane"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Last Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-b)" }}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone Number */}
                <div style={{ display: "flex", gap: "16px" }}>

                  {/* ── Email ── */}
                  <div style={{ flex: 1, position: "relative" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Email Address
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      onFocus={() => { if (emailSuggestions.length > 0) setShowSuggestions(true); }}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: `1px solid ${emailError ? "#ef4444" : "var(--border)"}`,
                        outline: "none",
                        fontSize: "0.95rem",
                        fontFamily: "var(--font-b)"
                      }}
                      placeholder="jane@gmail.com"
                      autoComplete="off"
                    />
                    {/* Domain suggestions dropdown */}
                    {showSuggestions && emailSuggestions.length > 0 && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        zIndex: 50,
                        overflow: "hidden",
                        marginTop: "4px"
                      }}>
                        {emailSuggestions.map((d, i) => (
                          <div
                            key={i}
                            onMouseDown={() => applyEmailSuggestion(d)}
                            style={{
                              padding: "10px 14px",
                              fontSize: "0.88rem",
                              cursor: "pointer",
                              fontFamily: "var(--font-b)",
                              color: "var(--navy)",
                              borderBottom: i < emailSuggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                              transition: "background 0.15s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f8faff"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <span style={{ color: "#888" }}>{formData.email.slice(0, formData.email.lastIndexOf("@"))}</span>
                            <strong style={{ color: "var(--navy)" }}>{d}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                    {emailError && (
                      <p style={{ margin: "5px 0 0", fontSize: "0.78rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
                        ⚠️ {emailError}
                      </p>
                    )}
                    {formData.email && !emailError && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <p style={{ margin: "5px 0 0", fontSize: "0.78rem", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>✅ Valid email address</p>
                    )}
                  </div>

                  {/* ── Phone ── */}
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone || "+234"}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onKeyDown={(e) => {
                        // Disallow non-numeric keys except Backspace/Delete/Arrow
                        if (!/[\d]/.test(e.key) && !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: `1px solid ${phoneError ? "#ef4444" : "var(--border)"}`,
                        outline: "none",
                        fontSize: "0.95rem",
                        fontFamily: "var(--font-b)"
                      }}
                      placeholder="+234 801 234 5678"
                      maxLength={14}
                    />
                    {phoneError && (
                      <p style={{ margin: "5px 0 0", fontSize: "0.78rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "4px" }}>
                        ⚠️ {phoneError}
                      </p>
                    )}
                    {formData.phone && !phoneError && formData.phone.length >= 14 && (
                      <p style={{ margin: "5px 0 0", fontSize: "0.78rem", color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>✅ Valid phone number</p>
                    )}
                    <p style={{ margin: "4px 0 0", fontSize: "0.74rem", color: "var(--text-3)" }}>
                      🇳🇬 Nigerian numbers only. Starts with +234, no leading 0.
                    </p>
                  </div>

                </div>

                {/* Row 3: Password */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ width: "100%", padding: "12px 64px 12px 14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-b)" }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "var(--gold)",
                        padding: "4px 8px"
                      }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Password Rules Checklist and Progress Bar */}
                  {p && (
                    <div style={{ marginTop: "12px", background: "rgba(10,22,40,0.02)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      
                      {/* Loading/Strength Bar */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase" }}>Password Strength</span>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: metCount === 5 ? "#10b981" : metCount >= 3 ? "#f59e0b" : "#ef4444" }}>
                            {metCount === 5 ? "Strong ✅" : metCount >= 3 ? "Medium ⚡" : "Weak ⚠️"}
                          </span>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${progressPercent}%`, height: "100%", background: metCount === 5 ? "#10b981" : metCount >= 3 ? "#f59e0b" : "#ef4444", borderRadius: "3px", transition: "width 0.3s ease, background-color 0.3s ease" }} />
                        </div>
                      </div>

                      {/* Rule items */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px", marginTop: "4px" }}>
                        {ruleChecks.map((rule, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              background: rule.met ? "#e6f4ea" : "#f1f3f4",
                              color: rule.met ? "#137333" : "#5f6368",
                              fontSize: "0.65rem",
                              fontWeight: 900
                            }}>
                              {rule.met ? "✓" : "•"}
                            </span>
                            <span style={{ fontSize: "0.82rem", color: rule.met ? "var(--navy)" : "var(--text-3)", fontWeight: rule.met ? 600 : 400, transition: "color 0.2s" }}>
                              {rule.label}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>

                {/* Row 4: Date of Birth & Gender */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Date of Birth *
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-b)", background: "var(--white)", color: formData.dateOfBirth ? "var(--navy)" : "var(--text-3)" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Gender *
                    </label>
                    <select
                      required
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-b)", background: "var(--white)", color: formData.gender ? "var(--navy)" : "var(--text-3)" }}
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Country & State */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                      Country *
                    </label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value, state: "" })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-b)", background: "var(--white)" }}
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-3)", marginBottom: "6px", textTransform: "uppercase" }}>
                      State *
                    </label>
                    <select
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border)", outline: "none", fontSize: "0.95rem", fontFamily: "var(--font-b)", background: "var(--white)", color: formData.state ? "var(--navy)" : "var(--text-3)" }}
                    >
                      <option value="" disabled>Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>


              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* ── Profile Photo (Optional) ── */}
                <div style={{ textAlign: "center", padding: "4px 0 8px" }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: formData.avatarUrl ? "transparent" : "linear-gradient(135deg, var(--navy), #1c3272)",
                    border: "3px solid var(--border)", margin: "0 auto 12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", flexShrink: 0,
                  }}>
                    {formData.avatarUrl
                      ? <img src={formData.avatarUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ color: "var(--gold)", fontSize: "2rem" }}>📸</span>
                    }
                  </div>
                  <label style={{ display: "inline-block", padding: "8px 18px", background: "var(--off-white)", border: "1px solid var(--border)", borderRadius: 10, fontWeight: 700, fontSize: "0.83rem", cursor: "pointer", color: "var(--navy)" }}>
                    {formData.avatarUrl ? "✅ Photo Selected" : "Upload Profile Photo (Optional)"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) { setError("Profile photo must be under 2MB."); return; }
                      const reader = new FileReader();
                      reader.onload = (ev) => setFormData({ ...formData, avatarUrl: ev.target.result });
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 6, marginBottom: 0 }}>JPG, PNG or GIF · Max 2MB · You can skip and add later</p>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--text-3)",
                      marginBottom: "6px",
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
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontSize: "0.95rem",
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

                {/* Terms & Conditions Checkbox */}
                <div style={{
                  background: agreedToTerms ? "rgba(16,185,129,0.06)" : "rgba(15,32,64,0.04)",
                  border: `1px solid ${agreedToTerms ? "#10b981" : "var(--border)"}`,
                  borderRadius: "12px",
                  padding: "14px 16px",
                  transition: "all 0.2s"
                }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      style={{ marginTop: "3px", width: "16px", height: "16px", accentColor: "var(--navy)", cursor: "pointer", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: "0.84rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                      I have read and agree to the{" "}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "var(--navy)", fontWeight: 700, textDecoration: "underline" }}>Terms &amp; Conditions</a>
                      {" "}and{" "}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--navy)", fontWeight: 700, textDecoration: "underline" }}>Privacy Policy</a>
                      {" "}of St. Lawrence Next Gen Academy. I confirm that the information I have provided is accurate and complete.
                    </span>
                  </label>
                  {!agreedToTerms && (
                    <p style={{ margin: "8px 0 0 28px", fontSize: "0.76rem", color: "#ef4444" }}>
                      ⚠️ You must accept the Terms &amp; Conditions to complete registration.
                    </p>
                  )}
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
                disabled={(step === 2 && !step2Valid) || (step === 3 && !step3Valid)}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: ((step === 2 && !step2Valid) || (step === 3 && !step3Valid)) ? 0.55 : 1,
                  cursor: ((step === 2 && !step2Valid) || (step === 3 && !step3Valid)) ? "not-allowed" : "pointer"
                }}
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
