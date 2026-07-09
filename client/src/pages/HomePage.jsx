import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import studentImg from "../assets/student.png";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

function AnimatedCounter({ value, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = React.useRef(null);

  useEffect(() => {
    const target = parseInt(value.replace(/,/g, ""), 10);
    if (isNaN(target)) {
      setCount(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          const duration = 2000; // 2 seconds

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Cubic ease-out
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOutCubic * target);

            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.disconnect();
      }
    };
  }, [value, hasAnimated]);

  const formattedCount = typeof count === "number"
    ? count.toLocaleString()
    : count;

  return (
    <strong ref={elementRef}>
      {formattedCount}
      {suffix}
    </strong>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }),
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const QUICK_ACCESS = [
  {
    title: "Past Questions",
    desc: "Search WAEC, JAMB, NECO, and GCE archives with guided practice.",
    badge: "Free",
    icon: "📝",
    to: "/past-questions",
    accent: "rgba(59,130,246,0.14)",
  },
  {
    title: "Video Courses",
    desc: "Structured digital skills and exam support lessons students can replay anytime.",
    badge: "Free & Premium",
    icon: "🎬",
    to: "/classrooms",
    accent: "rgba(34,197,94,0.14)",
  },
  {
    title: "Live Classrooms",
    desc: "Join focused sessions, revision labs, and premium cohort teaching rooms.",
    badge: "Premium",
    icon: "🏫",
    to: "/classrooms",
    accent: "rgba(212,168,83,0.16)",
  },
  {
    title: "Student Dashboard",
    desc: "Track lessons, certificates, and your learning progress from one place.",
    badge: "Members",
    icon: "👤",
    to: "/profile",
    accent: "rgba(168,85,247,0.14)",
  },
];

const ANNOUNCEMENTS = [
  {
    tag: "Urgent",
    date: "Jan 10, 2025",
    title: "2025 WAEC Registration Now Open",
    text: "Students preparing for the 2025 WAEC SSCE should begin registration early. Deadline closes March 15.",
  },
  {
    tag: "Scholarship",
    date: "Jan 8, 2025",
    title: "Federal Government Scholarship Applications",
    text: "Eligible Nigerian students can now apply before February 28 for this year’s scholarship opportunities.",
  },
  {
    tag: "News",
    date: "Jan 5, 2025",
    title: "New Virtual Assistant Training Added",
    text: "A new career track now covers tools, SOPs, client communication, and freelancing workflows.",
  },
  {
    tag: "Update",
    date: "Jan 3, 2025",
    title: "JAMB 2025 Syllabus Updated",
    text: "Our revision resources and practice flow have been aligned to the latest JAMB syllabus changes.",
  },
];

const UPCOMING_EXAMS = [
  {
    name: "WAEC SSCE",
    date: "May 5, 2025",
    countdown: "115 days left",
    color: "rgba(59,130,246,0.1)",
  },
  {
    name: "JAMB UTME",
    date: "Mar 15, 2025",
    countdown: "64 days left",
    color: "rgba(212,168,83,0.14)",
  },
  {
    name: "NECO SSCE",
    date: "Jun 2, 2025",
    countdown: "143 days left",
    color: "rgba(34,197,94,0.14)",
  },
];

const TRENDING_COURSES = [
  ["Medicine & Surgery", "3,420 aspirants"],
  ["Computer Science", "2,980 aspirants"],
  ["Law", "2,540 aspirants"],
  ["Nursing Science", "2,100 aspirants"],
  ["Business Administration", "1,850 aspirants"],
];

const HALL_OF_FAME = [
  {
    name: "Adaeze Okonkwo",
    track: "WAEC SSCE · 2024",
    score: "9 A1s",
    achievement: "University of Lagos — Medicine",
  },
  {
    name: "Chukwuemeka Eze",
    track: "JAMB UTME · 2024",
    score: "340 / 400",
    achievement: "University of Ibadan — Engineering",
  },
  {
    name: "Fatima Al-Hassan",
    track: "NECO SSCE · 2024",
    score: "8 Distinctions",
    achievement: "Ahmadu Bello University — Law",
  },
  {
    name: "Ibrahim Musa",
    track: "Digital Skills · 2024",
    score: "Top Graduate",
    achievement: "Now earning $800/month remotely",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    cycle: "/ forever",
    accent: "var(--white)",
    featured: false,
    features: [
      "Browse homepage and announcements",
      "Free past questions access",
      "Selected free video lessons",
      "Public success stories",
      "Basic exam guidance",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Basic",
    price: "₦2,500",
    cycle: "/ month",
    accent:
      "linear-gradient(180deg, rgba(212,168,83,0.08), rgba(255,255,255,1))",
    featured: true,
    features: [
      "Everything in Free",
      "Personal student profile",
      "General classroom access",
      "Extended question archive",
      "Chat with approved peers",
    ],
    cta: "Start Basic",
  },
  {
    name: "Premium",
    price: "₦5,000",
    cycle: "/ month",
    accent: "linear-gradient(180deg, rgba(10,22,40,0.04), rgba(255,255,255,1))",
    featured: false,
    features: [
      "Everything in Basic",
      "All paid classrooms",
      "Full archive and explanations",
      "Downloadable course notes",
      "Priority support and mentor rooms",
    ],
    cta: "Go Premium",
  },
];

const VALUE_POINTS = [
  {
    title: "Comprehensive Past Questions",
    text: "Students revise with organized exam archives, guided answer reviews, and a cleaner practice flow.",
    icon: "📚",
  },
  {
    title: "Video Courses & Lessons",
    text: "Every lesson is designed for clarity, repeat learning, and measurable skill progress.",
    icon: "🎥",
  },
  {
    title: "Live Classrooms",
    text: "Premium cohorts join interactive sessions with tutors, accountability, and real-time support.",
    icon: "🧑‍🏫",
  },
  {
    title: "Digital Skills Training",
    text: "From Virtual Assistant to practical tech learning, students gain modern opportunities beyond exams.",
    icon: "💼",
  },
  {
    title: "Student Community",
    text: "Study circles, peer support, and structured collaboration keep students consistent and motivated.",
    icon: "🤝",
  },
  {
    title: "Admin-Curated Quality",
    text: "Resources are reviewed to stay useful, current, and aligned with the academy’s standards.",
    icon: "✅",
  },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="product-homepage"
      style={{ minHeight: "100vh", background: "var(--off-white)" }}
    >
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
          <div>
            <div className="nav-brand-name">ST. LAWRENCE</div>
            <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
          </div>
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#quick-access">Quick Access</a>
          <a href="#news">News</a>
          <a href="#hall-of-fame">Hall of Fame</a>
          <a href="#pricing">Pricing</a>
        </div>

        <Link to="/register" className="nav-cta">
          Start Learning Free
        </Link>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="product-mobile-menu"
          style={{
            position: "fixed",
            top: "80px",
            left: "14px",
            right: "14px",
            background: "rgba(255,255,255,0.98)",
            borderRadius: "22px",
            border: "1px solid var(--border)",
            padding: "22px",
            zIndex: 998,
            boxShadow: "0 24px 50px rgba(10,22,40,0.14)",
            display: "grid",
            gap: "16px",
          }}
        >
          {[
            ["#home", "Home"],
            ["#quick-access", "Quick Access"],
            ["#news", "News & Announcements"],
            ["#hall-of-fame", "Hall of Fame"],
            ["#pricing", "Pricing"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{ color: "var(--navy)", fontWeight: 700 }}
            >
              {label}
            </a>
          ))}
          <Link
            to="/register"
            className="btn-primary"
            onClick={() => setMenuOpen(false)}
            style={{ justifyContent: "center" }}
          >
            Create Free Account
          </Link>
        </div>
      )}

      <section id="home" className="portal-hero">
        <div className="portal-grid-accent" />
        <div className="wrap portal-hero-inner">
          <div className="portal-hero-copy reveal">
            <div className="portal-eyebrow">

            </div>
            <h1 className="portal-title">
              Education, exam prep, and digital skills in one trusted platform
            </h1>
            <p className="portal-subtitle">
              Prepare for WAEC, JAMB, NECO, and GCE while building real-world
              digital skills through structured lessons, guided practice, and a
              strong student community.
            </p>
            <div className="portal-hero-actions">
              <Link to="/register" className="btn-primary">
                Start Learning Free
              </Link>
              <Link to="/past-questions" className="btn-ghost">
                Browse Past Questions
              </Link>
            </div>
            <div className="portal-stats-grid">
              <div className="portal-stat-card">
                <AnimatedCounter value="12,500" suffix="+" />
                <span>Registered Students</span>
              </div>
              <div className="portal-stat-card">
                <AnimatedCounter value="50,000" suffix="+" />
                <span>Past Questions</span>
              </div>
              <div className="portal-stat-card">
                <AnimatedCounter value="800" suffix="+" />
                <span>Video Lessons</span>
              </div>
              <div className="portal-stat-card">
                <AnimatedCounter value="3,200" suffix="+" />
                <span>Success Stories</span>
              </div>
            </div>
          </div>

          <div className="portal-hero-side reveal reveal-delay-1">
            <div className="portal-hero-visual">
              <div className="portal-achievement-card">
                <span className="portal-mini-label">Latest Achievement</span>
                <h3>Adaeze Okonkwo scored 9 A1s in WAEC 2024 🎉</h3>
                <p>
                  Outstanding student performance continues to define the St.
                  Lawrence standard.
                </p>
              </div>

              <div className="portal-student-card">
                <img
                  src={studentImg}
                  alt="Student learning with St. Lawrence Academy"
                />
              </div>

              <div className="portal-fact-card">
                <span className="portal-mini-label">Did You Know?</span>
                <p>
                  WAEC has been certifying West African students for over 70
                  years, making consistency and strategy essential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="exam-overview-section">
        <div className="wrap">
          <div className="section-heading reveal">
            <span className="eyebrow">Exam Coverage</span>
            <h2 className="section-h2" style={{ marginTop: 10 }}>
              A platform built around the exams students actually take
            </h2>
          </div>

          <div className="exam-overview-grid">
            {[
              ["WAEC SSCE", "45+ Subjects", "30+ Years Archive"],
              ["JAMB UTME", "20+ Subjects", "25+ Years Archive"],
              ["NECO SSCE", "40+ Subjects", "20+ Years Archive"],
              ["GCE", "35+ Subjects", "15+ Years Archive"],
            ].map(([name, subjects, archive], index) => (
              <div
                key={name}
                className="exam-overview-card reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="exam-overview-icon">🎯</span>
                <h3>{name}</h3>
                <p>{subjects}</p>
                <small>{archive}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quick-access" className="quick-access-section">
        <div className="wrap">
          <div className="section-heading reveal">
            <span className="eyebrow">Quick Access</span>
            <h2 className="section-h2" style={{ marginTop: 10 }}>
              Jump directly to what matters most
            </h2>
            <p className="section-subcopy">
              Students and parents should be able to find core actions
              immediately without hunting through the interface.
            </p>
          </div>

          <div className="quick-access-grid">
            {QUICK_ACCESS.map((item, index) => (
              <Link
                key={item.title}
                to={item.to}
                className="quick-access-card reveal"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="quick-access-top">
                  <div
                    className="quick-access-icon"
                    style={{ background: item.accent }}
                  >
                    {item.icon}
                  </div>
                  <span className="quick-access-badge">{item.badge}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="quick-access-link">Open section →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="news-preview-section">
        <div className="wrap news-preview-layout">
          <div className="news-preview-main">
            <div className="section-heading reveal">
              <span className="eyebrow">News & Announcements</span>
              <h2 className="section-h2" style={{ marginTop: 10 }}>
                Important updates students should never miss
              </h2>
            </div>

            <div className="announcement-list">
              {ANNOUNCEMENTS.map((item, index) => (
                <article
                  key={item.title}
                  className="announcement-card reveal"
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="announcement-meta">
                    <span className="announcement-tag">{item.tag}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="news-preview-sidebar reveal reveal-delay-2">
            <div className="sidebar-panel">
              <div className="sidebar-title">Upcoming Exams</div>
              <div className="sidebar-stack">
                {UPCOMING_EXAMS.map((exam) => (
                  <div
                    key={exam.name}
                    className="mini-info-card"
                    style={{ background: exam.color }}
                  >
                    <div>
                      <strong>{exam.name}</strong>
                      <span>{exam.date}</span>
                    </div>
                    <b>{exam.countdown}</b>Nigeria’s Premier Learning Platform
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-panel">
              <div className="sidebar-title">Trending University Courses</div>
              <div className="sidebar-stack">
                {TRENDING_COURSES.map(([course, aspirants], index) => (
                  <div key={course} className="subject-row">
                    <div className="subject-info">
                      <span className="subject-rank">{index + 1}</span>
                      <strong>{course}</strong>
                    </div>
                    <span className="subject-count">{aspirants}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="hall-of-fame" className="hall-preview-section">
        <div className="wrap">
          <div
            className="section-heading reveal"
            style={{ textAlign: "center" }}
          >
            <span className="eyebrow">Hall of Fame</span>
            <h2
              className="section-h2"
              style={{ marginTop: 10, marginInline: "auto" }}
            >
              Celebrating student wins and proof of outcomes
            </h2>
            <p className="section-subcopy" style={{ marginInline: "auto" }}>
              A trusted academy should visibly showcase the quality of results
              students are achieving.
            </p>
          </div>

          <div className="hall-preview-grid">
            {HALL_OF_FAME.map((student, index) => (
              <div
                key={student.name}
                className="hall-preview-card reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="hall-preview-top">
                  <span className="hall-preview-avatar">🏆</span>
                  <span className="hall-preview-track">{student.track}</span>
                </div>
                <h3>{student.name}</h3>
                <div className="hall-score">{student.score}</div>
                <p>{student.achievement}</p>
              </div>
            ))}
          </div>

          <div className="hall-cta-card reveal reveal-delay-2">
            <div>
              <span className="portal-mini-label">
                Your Success Story Could Be Here
              </span>
              <h3>Join thousands of students preparing for standout results</h3>
            </div>
            <Link to="/register" className="btn-primary">
              Start Your Journey Today
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="pricing-preview-section">
        <div className="wrap">
          <div
            className="section-heading reveal"
            style={{ textAlign: "center" }}
          >
            <span className="eyebrow">Choose Your Plan</span>
            <h2
              className="section-h2"
              style={{ marginTop: 10, marginInline: "auto" }}
            >
              Start free and upgrade when your learning needs grow
            </h2>
            <p className="section-subcopy" style={{ marginInline: "auto" }}>
              No confusing pricing table. Just clear tiers that make sense for
              real students.
            </p>
          </div>

          <div className="pricing-grid">
            {PLANS.map((plan, index) => (
              <div
                key={plan.name}
                className={`pricing-card reveal${plan.featured ? " featured" : ""}`}
                style={{
                  background: plan.accent,
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {plan.featured && (
                  <div className="pricing-ribbon">Most Popular</div>
                )}
                <h3>{plan.name}</h3>
                <div className="pricing-value">
                  <strong>{plan.price}</strong>
                  <span>{plan.cycle}</span>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={plan.featured ? "btn-primary" : "btn-ghost"}
                  style={{ justifyContent: "center" }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-platform-section">
        <div className="wrap">
          <div className="section-heading reveal">
            <span className="eyebrow">Why Choose St. Lawrence?</span>
            <h2 className="section-h2" style={{ marginTop: 10 }}>
              Everything needed for exam success and modern skill building
            </h2>
          </div>
          <div className="value-grid">
            {VALUE_POINTS.map((item, index) => (
              <div
                key={item.title}
                className="value-card reveal"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <div className="value-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="wrap">
          <div className="final-cta-card reveal">
            <div>
              <span className="portal-mini-label">
                Ready to Achieve Excellence?
              </span>
              <h2>
                Join students already preparing for success with St. Lawrence
                Next Gen Academy
              </h2>
              <p>
                Create your account, explore our learning tools, and move from
                intention to real progress.
              </p>
            </div>
            <div className="final-cta-actions">
              <Link to="/register" className="btn-primary">
                Create Free Account
              </Link>
              <Link to="/past-questions" className="btn-ghost">
                Explore Past Questions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer portal-footer">
        <div className="wrap footer-portal-grid">
          <div className="footer-brand-block">
            <div className="nav-logo" style={{ marginBottom: 14 }}>
              <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
              <div>
                <div className="nav-brand-name" style={{ color: "white" }}>
                  ST. LAWRENCE
                </div>
                <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
              </div>
            </div>

          </div>

          <div>
            <h4>Quick Links</h4>
            <div className="footer-link-stack">
              <Link to="/past-questions">Past Questions</Link>
              <Link to="/classrooms">Courses</Link>
            </div>
          </div>

          <div>
            <h4>Account</h4>
            <div className="footer-link-stack">
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>

          <div>
            <h4>Support</h4>
            <div className="footer-link-stack">
              <a href="mailto:info@stlawrencenextgen.edu">
                info@stlawrencenextgen.edu
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
