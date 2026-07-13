import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/St. Lawrence Next Gen Academy logo.png';

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', flexDirection: 'column' }}>
      <nav className="nav internal-page-nav" style={{ padding: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "1100px", margin: "0 auto" }}>
          <Link to="/" className="nav-logo" style={{ textDecoration: "none" }}>
            <img src={logoImg} alt="St. Lawrence Next Gen Academy" className="nav-logo-img" />
            <div>
              <div className="nav-brand-name">ST. LAWRENCE</div>
              <div className="nav-brand-sub hide-on-mobile">NEXT GEN ACADEMY</div>
            </div>
          </Link>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '6rem', marginBottom: '10px' }}>🧭</div>
        <h1 style={{ color: 'var(--navy)', fontSize: '3rem', fontFamily: 'var(--font-h)', margin: '0 0 16px 0' }}>404</h1>
        <h2 style={{ color: 'var(--navy)', marginBottom: '16px', fontWeight: 800 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '32px', maxWidth: '400px', fontSize: '1.1rem', lineHeight: 1.6 }}>
          The page you are looking for doesn't exist, has been moved, or you don't have access to it.
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 28px' }}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
