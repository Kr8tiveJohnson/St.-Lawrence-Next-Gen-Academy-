import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/St. Lawrence Next Gen Academy logo.png';
import client from '../api/client';

export default function TermsPage() {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/site-content/terms_and_conditions')
      .then(res => {
        setTerms(res.data.value);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch terms:', err);
        setLoading(false);
      });
  }, []);

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
          <h1 style={{ fontFamily: 'var(--font-h)', fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '10px' }}>Terms &amp; Conditions</h1>
          
          {loading ? (
            <div style={{ color: 'var(--text-3)', padding: '40px 0', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔄</div>
              Loading terms and conditions...
            </div>
          ) : terms ? (
            <>
              <p style={{ color: 'var(--text-3)', marginBottom: '30px', fontSize: '0.9rem' }}>Last Updated: {terms.lastUpdated}</p>
              
              <div style={{ color: 'var(--text-2)', lineHeight: 1.8 }}>
                {terms.sections.map((section) => (
                  <div key={section.id} style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: 'var(--navy)', marginTop: '24px', fontSize: '1.15rem', fontFamily: 'var(--font-h)' }}>
                      {section.id}. {section.title}
                    </h3>
                    <p style={{ whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{section.body}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ color: '#ef4444', padding: '40px 0', textAlign: 'center' }}>
              ⚠️ Failed to load terms and conditions. Please try again later.
            </div>
          )}
        </div>
      </div>

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

          <div>
            <h4>Legal</h4>
            <div className="footer-link-stack">
              <Link to="/terms">Terms &amp; Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
