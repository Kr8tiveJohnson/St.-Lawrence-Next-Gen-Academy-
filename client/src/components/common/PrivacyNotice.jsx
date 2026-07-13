import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function PrivacyNotice() {
  const { user } = useAuth();
  const [showNotice, setShowNotice] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const consent = localStorage.getItem('siteConsent');
    if (!consent) {
      if (user && user.cookieConsent) {
        localStorage.setItem('siteConsent', 'true');
      } else {
        setShowNotice(true);
      }
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAccept = async () => {
    localStorage.setItem('siteConsent', 'true');
    setShowNotice(false);
    if (user) {
      try {
        await client.put('/users/me/cookies', { consent: true });
      } catch (err) {
        console.error('Failed to sync consent', err);
      }
    }
  };

  const handleDecline = () => {
    localStorage.setItem('siteConsent', 'false');
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '0' : '20px',
      left: isMobile ? '0' : '20px',
      right: isMobile ? '0' : '20px',
      maxWidth: isMobile ? '100%' : '820px',
      margin: '0 auto',
      background: 'var(--white)',
      padding: isMobile ? '18px 16px' : '20px 28px',
      borderRadius: isMobile ? '16px 16px 0 0' : '16px',
      boxShadow: '0 -4px 30px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: isMobile ? '14px' : '24px',
      zIndex: 9999,
      border: '1px solid var(--border)',
      boxSizing: 'border-box',
    }}>
      {/* Icon + Text */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: isMobile ? '1.4rem' : '1.6rem', flexShrink: 0, marginTop: '2px' }}>🍪</span>
        <div>
          <h4 style={{ margin: '0 0 5px 0', color: 'var(--navy)', fontFamily: 'var(--font-h)', fontSize: isMobile ? '0.95rem' : '1rem' }}>
            We value your privacy
          </h4>
          <p style={{ margin: 0, fontSize: isMobile ? '0.78rem' : '0.88rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
            We use cookies to enhance your experience, serve personalised content, and analyse traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexShrink: 0,
        width: isMobile ? '100%' : 'auto',
      }}>
        <button
          className="btn-ghost"
          onClick={handleDecline}
          style={{
            flex: isMobile ? 1 : 'none',
            borderColor: 'var(--border)',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            padding: isMobile ? '10px 0' : undefined,
          }}
        >
          Decline
        </button>
        <button
          className="btn-primary"
          onClick={handleAccept}
          style={{
            flex: isMobile ? 1 : 'none',
            fontSize: isMobile ? '0.85rem' : '0.9rem',
            padding: isMobile ? '10px 0' : undefined,
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
