import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/St. Lawrence Next Gen Academy logo.png';

export default function TermsPage() {
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
          <div className="internal-page-actions" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link to="/" className="nav-cta" style={{ background: "transparent", color: "var(--navy)", border: "1px solid var(--border)", textDecoration: "none" }}>
              Back Home
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, padding: '60px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--white)', padding: '50px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontFamily: 'var(--font-h)', fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '20px' }}>Terms & Conditions</h1>
          <p style={{ color: 'var(--text-3)', marginBottom: '30px', fontSize: '0.9rem' }}>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>
            <h3 style={{ color: 'var(--navy)', marginTop: '30px' }}>1. Introduction</h3>
            <p>Welcome to St. Lawrence Next Gen Academy. By accessing or using our platform, you agree to be bound by these terms and conditions.</p>

            <h3 style={{ color: 'var(--navy)', marginTop: '30px' }}>2. User Accounts</h3>
            <p>You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials.</p>

            <h3 style={{ color: 'var(--navy)', marginTop: '30px' }}>3. Educational Content</h3>
            <p>All materials, past questions, and video courses are provided for educational purposes. Reproduction or redistribution without permission is prohibited.</p>

            <h3 style={{ color: 'var(--navy)', marginTop: '30px' }}>4. Payments & Subscriptions</h3>
            <p>Premium features require a subscription. Payments are non-refundable unless specified otherwise in our refund policy.</p>

            <h3 style={{ color: 'var(--navy)', marginTop: '30px' }}>5. Termination</h3>
            <p>We reserve the right to suspend or terminate accounts that violate our community guidelines or these terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
