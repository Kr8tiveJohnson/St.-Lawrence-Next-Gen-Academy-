import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { goToDashboard } from '../utils/navigation';

export default function CbtCandidateLogin({ onCandidateVerified, onGoToBank }) {
  const { user, candidate, verifySurname, isTeacherOrAdmin } = useAuth();
  const [surname, setSurname] = useState(
    candidate?.profile?.surname || (user?.profile?.fullName ? user.profile.fullName.trim().split(/\s+/).slice(-1)[0] : '')
  );
  const [email, setEmail] = useState(candidate?.email || user?.email || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!surname.trim()) {
      setErrorMsg('Please enter your registered Surname to sign in.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifySurname(surname.trim(), email.trim());
      if (data && data.user) {
        onCandidateVerified(data.user);
      }
    } catch (err) {
      console.error('Candidate verification error:', err);
      const serverMsg = err.response?.data?.error;
      if (serverMsg) {
        setErrorMsg(serverMsg);
      } else {
        setErrorMsg(`No registered student account was found with surname "${surname}". You must have an active student account on St. Lawrence Next Gen Academy to take this examination.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const detectedName = candidate?.profile?.fullName || user?.profile?.fullName;
  const detectedSurname = candidate?.profile?.surname || (detectedName ? detectedName.trim().split(/\s+/).slice(-1)[0] : '');

  return (
    <div className="cbt-auth-page">
      {/* Background Decorative Glows */}
      <div className="cbt-auth-glow-1" />
      <div className="cbt-auth-glow-2" />

      <div className="cbt-auth-container">
        {/* Brand Banner */}
        <div className="cbt-auth-brand">
          <div className="cbt-auth-logo-box">
            <img
              src="/logo.png"
              alt="St. Lawrence Next Gen Academy Logo"
              className="cbt-auth-logo-img"
              onError={(e) => {
                // Fallback in case of image load delay
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="cbt-auth-badge">
            <span className="cbt-badge-dot">●</span>
            <span>ST. LAWRENCE CBT EXAMINATION PORTAL</span>
          </div>
          <h1 className="cbt-auth-title">Candidate Sign In</h1>
          <p className="cbt-auth-subtitle">
            Practice JAMB UTME, WAEC SSCE, NECO, and Academy Mocks with verified syllabus timing and auto-grading.
          </p>
        </div>

        {/* Top Back to Dashboard CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={goToDashboard}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <span>←</span> Go Back to Dashboard
          </button>
        </div>

        {/* Sign In Card */}
        <div className="cbt-auth-card">
          {/* Card Accent Top Bar */}
          <div className="cbt-auth-card-ribbon" />

          <div className="cbt-auth-card-body">
            {/* Quick Handover if already recognized from dashboard */}
            {detectedName && (
              <div className="cbt-handover-box">
                <div className="cbt-handover-content">
                  <span className="cbt-handover-tag">Recognized Account</span>
                  <strong className="cbt-handover-name">{detectedName}</strong>
                  <span className="cbt-handover-surname">Registered Surname: <strong>{detectedSurname}</strong></span>
                </div>
                <button
                  type="button"
                  className="cbt-handover-btn"
                  onClick={() => {
                    setSurname(detectedSurname);
                    verifySurname(detectedSurname, user?.email || '').then((res) => {
                      if (res && res.user) onCandidateVerified(res.user);
                    }).catch(() => {});
                  }}
                >
                  Continue as {detectedSurname} →
                </button>
              </div>
            )}

            {/* Error Notification Banner */}
            {errorMsg && (
              <div className="cbt-alert-banner">
                <div className="cbt-alert-icon">⚠️</div>
                <div className="cbt-alert-text">
                  <strong>Student Account Not Found</strong>
                  <p>{errorMsg}</p>
                  <a
                    href="http://localhost:5173/login"
                    target="_blank"
                    rel="noreferrer"
                    className="cbt-alert-link"
                  >
                    Go to Academy Website to Register ↗
                  </a>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="cbt-auth-form">
              <div className="cbt-field-group">
                <label className="cbt-field-label" htmlFor="surnameInput">
                  Candidate Surname <span className="cbt-req">*</span>
                </label>
                <div className="cbt-field-control">
                  <span className="cbt-field-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input
                    id="surnameInput"
                    type="text"
                    className="cbt-field-input"
                    placeholder="Enter your registered Surname (e.g. John)"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    autoFocus
                    required
                    autoComplete="family-name"
                  />
                </div>
                <div className="cbt-field-hint">
                  Input the surname you used when creating your St. Lawrence Academy account.
                </div>
              </div>

              <div className="cbt-field-group">
                <label className="cbt-field-label" htmlFor="emailInput">
                  Registered Email Address <span className="cbt-opt">(Optional)</span>
                </label>
                <div className="cbt-field-control">
                  <span className="cbt-field-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </span>
                  <input
                    id="emailInput"
                    type="email"
                    className="cbt-field-input"
                    placeholder="e.g. student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="cbt-field-hint">
                  Helps differentiate candidates if multiple students share your surname.
                </div>
              </div>

              <button
                type="submit"
                className="cbt-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="cbt-btn-spinner" />
                    <span>Verifying Student Record...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In & Load Subjects</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Teacher / Admin Access Link */}
            {isTeacherOrAdmin && onGoToBank && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={onGoToBank}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dfa921',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ⚙️ Switch to Question Bank Manager
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="cbt-auth-footer">
          <p>© {new Date().getFullYear()} St. Lawrence Next Gen Academy. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={goToDashboard}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold, #dfa921)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px'
              }}
            >
              <span>←</span> Go Back to Dashboard
            </button>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <a href="http://localhost:5173" target="_blank" rel="noreferrer">
              Visit Main Academy Website ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
