import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import logoImg from '../assets/St. Lawrence Next Gen Academy logo.png';

export default function AdminLoginPage() {
  const [schoolName, setSchoolName] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) navigate('/admin');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await client.post('/auth/admin-login', { schoolName, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: '#1e2a3a',
    border: '1px solid #3a4f6a',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  return (
    <>
      <style>{`
        .admin-input::placeholder { color: #6b8299; }
        .admin-input:focus { border-color: #d4a853 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-login-btn:hover:not(:disabled) { background: #e0b96a !important; transform: translateY(-1px); }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1628 0%, #0f2144 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}>
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px',
          background: 'rgba(212,168,83,0.06)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-150px', left: '-100px', width: '500px', height: '500px',
          background: 'rgba(255,255,255,0.02)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
        }} />

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '440px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)'
        }}>
          {/* Logo + Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <img src={logoImg} alt="Logo" style={{ width: '68px', height: '68px', objectFit: 'contain', marginBottom: '14px' }} />
            <span style={{ color: '#d4a853', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Admin Portal
            </span>
            <h1 style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.4rem', textAlign: 'center', margin: 0, lineHeight: 1.3 }}>
              St. Lawrence Next Gen<br />Academy
            </h1>
          </div>

          {/* Security notice */}
          <div style={{
            background: 'rgba(212,168,83,0.08)',
            border: '1px solid rgba(212,168,83,0.25)',
            borderRadius: '10px',
            padding: '11px 14px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1rem' }}>🔒</span>
            <span style={{ color: '#a0b4cc', fontSize: '0.82rem' }}>Restricted area — Authorized personnel only</span>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.15)',
              border: '1px solid rgba(220,38,38,0.3)',
              color: '#fca5a5',
              padding: '12px 14px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* School Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#7a9abc', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                School Name
              </label>
              <input
                className="admin-input"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="St. Lawrence Next Gen Academy"
                required
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', color: '#7a9abc', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="admin-input"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  style={{ ...inputStyle, paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6b8299', fontSize: '1.1rem', padding: 0, display: 'flex', alignItems: 'center'
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? 'rgba(212,168,83,0.5)' : '#d4a853',
                color: '#0a1628',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.03em',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid #0a1628',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block'
                  }} />
                  Verifying...
                </>
              ) : (
                <>🔐 Access Admin Panel</>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <a href="/" style={{ color: '#4a6478', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#7a9abc'}
              onMouseLeave={(e) => e.target.style.color = '#4a6478'}>
              ← Back to Website
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
