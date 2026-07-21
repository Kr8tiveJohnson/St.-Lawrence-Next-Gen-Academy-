import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";
import TimeWeatherWidget from "../components/common/TimeWeatherWidget.jsx";
import client from "../api/client";

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
    cycle: "/forever",
    topBg: "var(--white)",
    topColor: "var(--navy)",
    bottomBg: "var(--white)",
    accent: "var(--navy)",
    featured: false,
    features: [
      "Browse homepage & news",
      "Free past questions",
      "Free course videos",
      "Free classrooms",
      "Hall of Fame access",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Basic",
    price: "₦2,500",
    cycle: "/per month",
    topBg: "var(--navy)",
    topColor: "var(--white)",
    bottomBg: "var(--white)",
    accent: "var(--navy)",
    featured: true,
    features: [
      "Everything in Free",
      "Personal profile visible",
      "Friend requests (same country)",
      "General Class access",
      "Extended past questions archive",
      "Chat with friends",
    ],
    cta: "Start Basic",
  },
  {
    name: "Premium",
    price: "₦5,000",
    cycle: "/per month",
    topBg: "var(--gold)",
    topColor: "var(--navy)",
    bottomBg: "var(--white)",
    accent: "var(--gold)",
    featured: false,
    features: [
      "Everything in Basic",
      "Worldwide friend & chat",
      "Full archive access",
      "All paid classrooms",
      "Ad-free experience",
      "Priority support",
      "Download course notes"
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
  const [announcements, setAnnouncements] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState(UPCOMING_EXAMS);
  const [trendingCourses, setTrendingCourses] = useState(TRENDING_COURSES);
  const [hallOfFame, setHallOfFame] = useState(HALL_OF_FAME);

  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Fetch live announcements
    client.get("/news")
      .then(({ data }) => {
        const filtered = (data.news || []).filter(n => n.tag !== "hall-of-fame");
        setAnnouncements(filtered.slice(0, 4));
      })
      .catch(() => {});
      
    // Fetch dynamic site content
    client.get("/site-content/upcoming_exams").then(({ data }) => {
      if (data?.value?.length > 0) setUpcomingExams(data.value);
    }).catch(() => {});
    
    client.get("/site-content/trending_courses").then(({ data }) => {
      if (data?.value?.length > 0) setTrendingCourses(data.value);
    }).catch(() => {});

    // Fetch Hall of Fame from DB
    client.get("/news/hall-of-fame/entries").then(({ data }) => {
      const entries = (data.entries || []).map(e => {
        let extra = {};
        try { extra = JSON.parse(e.details || "{}"); } catch {}
        return { ...e, ...extra };
      });
      if (entries.length > 0) setHallOfFame(entries);
    }).catch(() => {});

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

        <div className="nav-links hide-on-mobile">
          <a href="#home">Home</a>
          <Link to="/classrooms">Classrooms</Link>
          <Link to="/groups">Communities</Link>
          <a href="#news">News</a>
          <a href="#hall-of-fame">Hall of Fame</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="nav-actions hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/register" className="nav-cta">
            Start Learning Free
          </Link>
        </div>

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
          <a href="#home" onClick={() => setMenuOpen(false)} style={{ color: "var(--navy)", fontWeight: 700 }}>Home</a>
          <Link to="/classrooms" onClick={() => setMenuOpen(false)} style={{ color: "var(--navy)", fontWeight: 700 }}>Classrooms</Link>
          <Link to="/groups" onClick={() => setMenuOpen(false)} style={{ color: "var(--navy)", fontWeight: 700 }}>Communities</Link>
          <a href="#news" onClick={() => setMenuOpen(false)} style={{ color: "var(--navy)", fontWeight: 700 }}>News & Announcements</a>
          <a href="#hall-of-fame" onClick={() => setMenuOpen(false)} style={{ color: "var(--navy)", fontWeight: 700 }}>Hall of Fame</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ color: "var(--navy)", fontWeight: 700 }}>Pricing</a>
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

      <section id="home" className="portal-hero" style={{ 
        backgroundColor: 'var(--navy)', 
        color: 'var(--white)',
        backgroundImage: 'linear-gradient(rgba(10, 22, 40, 0.85), rgba(10, 22, 40, 0.95)), url("https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExc21sbXR6bm9sajJnNGlvdGF1dWhiZjkwOTI3MDY1emtkdDlpZzdjbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KVZWZQoS0yqfIiTAKq/giphy.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="portal-grid-accent" style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)' 
        }} />
        <div className="wrap portal-hero-inner">
          <div className="portal-hero-copy reveal">

            <h1 className="portal-title" style={{ color: 'var(--white)' }}>
              Education, Exam Prep, And Digital Skills In One Trusted Platform
            </h1>
            <p className="portal-subtitle" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Prepare for WAEC, JAMB, NECO, and GCE while building real-world
              digital skills through structured lessons, guided practice, and a
              strong student community.
            </p>
            <div className="portal-hero-actions">
              <Link to="/register" className="btn-primary">
                Start Learning Free
              </Link>
              <Link to="/past-questions" className="btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.5)', color: 'var(--white)' }}>
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

          <div className="portal-hero-side reveal reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', width: '100%' }}>
            
            <div className="portal-achievement-card" style={{ 
              width: '100%',
              maxWidth: '440px',
              background: 'rgba(255, 255, 255, 0.06)', 
              border: '1px solid rgba(255, 255, 255, 0.12)', 
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '24px',
              color: 'var(--white)',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ background: 'rgba(223, 169, 33, 0.15)', color: 'var(--gold)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', border: '1px solid rgba(223, 169, 33, 0.3)' }}>
                  🏆 Latest Achievement
                </span>
              </div>
              <h3 style={{ color: 'var(--white)', margin: '0 0 8px 0', fontSize: '1.25rem', lineHeight: '1.4', fontWeight: '800' }}>Adaeze Okonkwo scored 9 A1s in WAEC 2024 🎉</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
                Outstanding student performance continues to define the St. Lawrence standard.
              </p>
            </div>

            <TimeWeatherWidget />
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
              {(announcements.length > 0 ? announcements : ANNOUNCEMENTS).map((item, index) => (
                <article
                  key={item.title}
                  className="announcement-card reveal"
                  style={{ transitionDelay: `${index * 90}ms`, display: "flex", gap: "16px", alignItems: "flex-start" }}
                >
                  {item.imageUrl && (
                    <div style={{ width: "90px", height: "70px", borderRadius: "8px", overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
                      <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div className="announcement-meta">
                      <span className="announcement-tag" style={{ textTransform: "uppercase" }}>{item.tag}</span>
                      <span>{item.date ? item.date : new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text || item.summary}</p>
                  </div>
                </article>
              ))}
            </div>

            <div style={{ marginTop: "32px" }}>
              <Link to="/news" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>

          <aside className="news-preview-sidebar reveal reveal-delay-2">
            <div className="sidebar-panel">
              <div className="sidebar-title">Upcoming Exams</div>
              <div className="sidebar-stack">
                {upcomingExams.map((exam, idx) => (
                  <div
                    key={exam.name || idx}
                    className="mini-info-card"
                    style={{ background: exam.color || 'rgba(59,130,246,0.1)' }}
                  >
                    <div>
                      <strong>{exam.name}</strong>
                      <span>{exam.date}</span>
                    </div>
                    <b>{exam.countdown}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-panel">
              <div className="sidebar-title" style={{ marginTop: "24px" }}>
                Trending University Courses
              </div>
              <div className="sidebar-stack">
                {trendingCourses.map((course, index) => {
                  const rank = course.rank || (index + 1);
                  const title = course.title || course[0];
                  const aspirants = course.aspirants || course[1];
                  
                  return (
                    <div key={title} className="subject-row">
                      <div className="subject-info">
                        <span className="subject-rank">{rank}</span>
                        <strong>{title}</strong>
                      </div>
                      <span className="subject-count">{aspirants}</span>
                    </div>
                  );
                })}
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
            {hallOfFame.map((student, index) => (
              <div
                key={student.name || student.id || index}
                className="hall-preview-card reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="hall-preview-top">
                  {student.imageUrl ? (
                    <img src={student.imageUrl} alt={student.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--gold)" }} />
                  ) : (
                    <span className="hall-preview-avatar">🏆</span>
                  )}
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
                  transitionDelay: `${index * 100}ms`,
                  background: plan.bottomBg,
                  padding: 0,
                  overflow: 'hidden',
                  border: plan.name === "Free" ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  boxShadow: plan.name === "Free" ? '0 10px 30px rgba(0,0,0,0.03)' : '0 20px 40px rgba(10,22,40,0.1)'
                }}
              >
                <div className="pricing-card-top" style={{ background: plan.topBg, color: plan.topColor, padding: '20px 18px', position: 'relative' }}>
                  {plan.featured && (
                    <div className="pricing-ribbon" style={{ background: '#dfa921', color: '#fff', top: '24px', right: '24px' }}>Most Popular</div>
                  )}
                  <h3 style={{ color: plan.topColor, fontSize: '1.15rem', marginBottom: '6px' }}>{plan.name}</h3>
                  <div className="pricing-value" style={{ color: plan.topColor, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <strong style={{ color: plan.topColor, fontSize: '1.8rem', fontWeight: '900' }}>{plan.price}</strong>
                    <span style={{ color: plan.topColor, opacity: 0.7 }}>{plan.cycle}</span>
                  </div>
                </div>
                <div className="pricing-card-bottom" style={{ padding: '18px', background: plan.bottomBg, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px 0', flexGrow: 1 }}>
                    {plan.features.map((feature) => (
                      <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--text-2)', fontSize: '0.82rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#22c55e', flexShrink: 0 }}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M16 12l-4 4-2-2"></path>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className="btn"
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      width: '100%',
                      background: plan.name === 'Free' ? 'transparent' : plan.accent,
                      color: plan.name === 'Free' ? 'var(--navy)' : '#fff',
                      border: plan.name === 'Free' ? '2px solid var(--navy)' : 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      transition: 'all 0.3s'
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-platform-section">
        <div className="wrap">
          <div className="section-heading reveal">
            <h2 className="section-h2" style={{ fontWeight: 'bold' }}>
              Why Choose St. Lawrence?
            </h2>
            <p style={{ marginTop: '10px', fontSize: '1rem', color: 'var(--text-2)', maxWidth: '600px', margin: '10px auto 0' }}>
              Everything needed for exam success and modern skill building
            </p>
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
