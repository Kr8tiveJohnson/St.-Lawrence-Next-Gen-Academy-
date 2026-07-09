import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/St. Lawrence Next Gen Academy logo.png";

const MOCK_COURSES = [
  {
    id: 1,
    title: "Virtual Assistant Professional",
    category: "Virtual Assistant",
    type: "Premium",
    rating: "4.9",
    duration: "6 Weeks",
    lessons: 42,
    author: "Sarah J.",
    bg: "linear-gradient(135deg, #fdf6e3, #fef0b4)",
    icon: "🎗️",
    desc: "Master the skills to become a highly paid Virtual Assistant. Learn email management, scheduling, and client communication.",
    highlights: [
      "Email Management",
      "Calendar Scheduling",
      "Client Communication",
      "Invoice Setup",
    ],
  },
  {
    id: 2,
    title: "Full-Stack Web Development",
    category: "Tech & Design",
    type: "Premium",
    rating: "4.8",
    duration: "12 Weeks",
    lessons: 120,
    author: "David M.",
    bg: "linear-gradient(135deg, #e0f2fe, #bfdbfe)",
    icon: "💻",
    desc: "From zero to deployed. Learn HTML, CSS, JavaScript, React, and Node.js by building real-world projects.",
    highlights: [
      "React.js",
      "Node & Express",
      "MongoDB Database",
      "Authentication",
    ],
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    category: "Tech & Design",
    type: "Premium",
    rating: "5.0",
    duration: "8 Weeks",
    lessons: 60,
    author: "Elena R.",
    bg: "linear-gradient(135deg, #fae8ff, #fbcfe8)",
    icon: "🎨",
    desc: "Design beautiful, functional interfaces. Learn Figma, wireframing, prototyping, and user testing.",
    highlights: [
      "Figma Basics",
      "Prototyping",
      "User Research",
      "Portfolio Build",
    ],
  },
  {
    id: 4,
    title: "WAEC Mathematics Prep",
    category: "Exams",
    type: "Free",
    rating: "4.7",
    duration: "4 Weeks",
    lessons: 25,
    author: "Dr. Kunle",
    bg: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    icon: "📐",
    desc: "Comprehensive breakdown of WAEC Mathematics past questions, theorems, and shortcut formulas.",
    highlights: ["Algebra", "Geometry", "Past Questions", "Timed Practice"],
  },
  {
    id: 5,
    title: "JAMB Use of English",
    category: "Exams",
    type: "Free",
    rating: "4.6",
    duration: "3 Weeks",
    lessons: 18,
    author: "Mr. Obi",
    bg: "linear-gradient(135deg, #fee2e2, #fecaca)",
    icon: "📚",
    desc: "Acing JAMB English made easy. Lexis, structure, oral English, and reading comprehension techniques.",
    highlights: [
      "Lexis & Structure",
      "Oral English",
      "Reading Comprehension",
      "Mock Tests",
    ],
  },
  {
    id: 6,
    title: "Data Analysis with Python",
    category: "Tech & Design",
    type: "Premium",
    rating: "4.9",
    duration: "10 Weeks",
    lessons: 85,
    author: "Tobi A.",
    bg: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
    icon: "📊",
    desc: "Learn Pandas, NumPy, and Data Visualization to extract actionable insights from raw data.",
    highlights: [
      "Python Basics",
      "Pandas & NumPy",
      "Matplotlib",
      "Capstone Project",
    ],
  },
];

const CATEGORIES = ["All", "Tech & Design", "Exams", "Virtual Assistant"];
const TYPES = ["All", "Free", "Premium"];

export default function ClassroomsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || course.category === activeCategory;
    const matchesType = activeType === "All" || course.type === activeType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div
      className="page-wrapper product-internal-page classrooms-page"
      style={{ background: "var(--off-white)", minHeight: "100vh" }}
    >
      {/* ─── NAV BAR (Simplified for internal pages) ─── */}
      <nav
        className="nav internal-page-nav classroom-nav"
        style={{
          position: "sticky",
          top: 0,
          borderRadius: 0,
          borderBottom: "1px solid var(--border)",
          zIndex: 100,
        }}
      >
        <Link to="/" className="nav-logo">
          <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
          <div>
            <div className="nav-brand-name">ST. LAWRENCE</div>
            <div className="nav-brand-sub">NEXT GEN ACADEMY</div>
          </div>
        </Link>
        <div
          className="internal-page-actions"
          style={{ display: "flex", gap: "16px" }}
        >
          <Link
            to="/profile"
            className="btn-ghost"
            style={{ padding: "8px 16px", fontSize: "0.8rem" }}
          >
            My Dashboard
          </Link>
        </div>
      </nav>

      <div
        className="wrap classrooms-wrap"
        style={{ paddingTop: "60px", paddingBottom: "100px" }}
      >
        {/* HEADER */}
        <div
          className="internal-page-header"
          style={{ marginBottom: "40px", textAlign: "center" }}
        >
          <div
            className="portal-eyebrow"
            style={{ marginInline: "auto", marginBottom: "18px" }}
          >
            Course Library
          </div>
          <h1
            className="hero-h1"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              marginBottom: "16px",
              marginInline: "auto",
            }}
          >
            Interactive Classrooms
          </h1>
          <p className="hero-desc" style={{ marginInline: "auto" }}>
            Browse our catalog of premium courses and free exam preps.
            Everything you need to succeed is right here.
          </p>
        </div>

        {/* FILTERS & SEARCH */}
        <div
          className="filters-bar classrooms-filters"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "40px",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--white)",
            padding: "16px 24px",
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
          }}
        >
          <div
            className="classrooms-filters-main"
            style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: 1 }}
          >
            <div
              className="classrooms-search"
              style={{ position: "relative", maxWidth: "300px", width: "100%" }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.1rem",
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: "var(--r-full)",
                  border: "1px solid var(--border)",
                  outline: "none",
                  fontFamily: "var(--font-b)",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <select
              value={activeType}
              onChange={(e) => setActiveType(e.target.value)}
              style={{
                padding: "0 16px",
                borderRadius: "var(--r-full)",
                border: "1px solid var(--border)",
                outline: "none",
                fontFamily: "var(--font-b)",
                fontSize: "0.95rem",
                background: "var(--white)",
                cursor: "pointer",
              }}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t} Pricing
                </option>
              ))}
            </select>
          </div>

          <div
            className="classrooms-tabs"
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--r-full)",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "var(--trans)",
                  background:
                    activeCategory === cat ? "var(--navy)" : "var(--off-white)",
                  color:
                    activeCategory === cat ? "var(--white)" : "var(--text-2)",
                  boxShadow:
                    activeCategory === cat
                      ? "0 4px 12px rgba(10,22,40,0.15)"
                      : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* COURSES GRID */}
        {filteredCourses.length > 0 ? (
          <div
            className="courses-grid classrooms-list"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="course-card classroom-course-card"
                onClick={() => setSelectedCourse(course)}
                style={{
                  background: "var(--white)",
                  borderRadius: "var(--r-xl)",
                  border: "1px solid var(--border)",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "var(--trans)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background:
                      course.type === "Premium"
                        ? "var(--gold-dim)"
                        : "var(--green-dim)",
                    color: course.type === "Premium" ? "#b45309" : "#16a34a",
                    padding: "4px 10px",
                    borderRadius: "var(--r-full)",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {course.type}
                </div>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
                    background: course.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                  }}
                >
                  {course.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-3)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "4px",
                    }}
                  >
                    {course.category}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: "var(--navy)",
                      lineHeight: 1.3,
                    }}
                  >
                    {course.title}
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "0.85rem",
                    color: "var(--text-2)",
                    fontWeight: 600,
                  }}
                >
                  <span>⏱ {course.duration}</span>
                  <span>📚 {course.lessons} Lessons</span>
                  <span>⭐ {course.rating}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--text-3)",
            }}
          >
            <span
              style={{
                fontSize: "3rem",
                display: "block",
                marginBottom: "16px",
              }}
            >
              📭
            </span>
            <h3
              style={{
                fontSize: "1.5rem",
                color: "var(--navy)",
                marginBottom: "8px",
              }}
            >
              No courses found
            </h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedCourse && (
        <div
          className="classroom-modal-shell"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setSelectedCourse(null)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10, 22, 40, 0.4)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
            }}
          />
          {/* Modal Content */}
          <div
            className="classroom-modal-card"
            style={{
              position: "relative",
              background: "var(--white)",
              width: "100%",
              maxWidth: "600px",
              borderRadius: "32px",
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
              animation: "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              style={{
                height: "140px",
                background: selectedCourse.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
              }}
            >
              {selectedCourse.icon}
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--white)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              ✕
            </button>
            <div className="classroom-modal-body" style={{ padding: "32px" }}>
              <div
                className="classroom-modal-head"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-3)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "4px",
                    }}
                  >
                    {selectedCourse.category}
                  </div>
                  <h2
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 900,
                      color: "var(--navy)",
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedCourse.title}
                  </h2>
                </div>
                <div
                  style={{
                    background:
                      selectedCourse.type === "Premium"
                        ? "var(--gold-dim)"
                        : "var(--green-dim)",
                    color:
                      selectedCourse.type === "Premium" ? "#b45309" : "#16a34a",
                    padding: "6px 14px",
                    borderRadius: "var(--r-full)",
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {selectedCourse.type}
                </div>
              </div>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-2)",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {selectedCourse.desc}
              </p>

              <div
                className="classroom-modal-stats"
                style={{
                  display: "flex",
                  gap: "24px",
                  padding: "16px 0",
                  borderTop: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Duration
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--navy)" }}>
                    {selectedCourse.duration}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Lessons
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--navy)" }}>
                    {selectedCourse.lessons} Video Lessons
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-3)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Instructor
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--navy)" }}>
                    {selectedCourse.author}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <h4
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    color: "var(--navy)",
                    marginBottom: "12px",
                  }}
                >
                  Curriculum Highlights
                </h4>
                <ul
                  className="classroom-modal-highlights"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  {selectedCourse.highlights.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.95rem",
                        color: "var(--text-2)",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: "var(--green)" }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {selectedCourse.type === "Premium"
                  ? "Enroll in Course — ₦15,000"
                  : "Start Learning for Free"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
