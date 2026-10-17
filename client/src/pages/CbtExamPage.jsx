import { useEffect } from "react";

export default function CbtExamPage() {
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const cbtPortalUrl = `http://localhost:5174${token ? `#token=${encodeURIComponent(token)}` : ''}`;
    
    // Instant direct redirect to the new CBT System
    window.location.replace(cbtPortalUrl);
  }, []);

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const cbtPortalUrl = `http://localhost:5174${token ? `#token=${encodeURIComponent(token)}` : ''}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#091026",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>
          Redirecting to St. Lawrence CBT Examination Hall...
        </p>
        <a
          href={cbtPortalUrl}
          style={{ color: "#f4c243", textDecoration: "underline", fontSize: "0.95rem" }}
        >
          Click here if not redirected automatically
        </a>
      </div>
    </div>
  );
}
