import React, { useState, useEffect } from 'react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function PrivacyNotice() {
  const { user } = useAuth();
  const [showNotice, setShowNotice] = useState(false);

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
      bottom: '20px',
      left: '20px',
      right: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      background: 'var(--white)',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      zIndex: 9999,
      border: '1px solid var(--border)'
    }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: 'var(--navy)', fontFamily: 'var(--font-h)' }}>We value your privacy</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-2)' }}>
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
        <button className="btn-ghost" onClick={handleDecline} style={{ borderColor: 'var(--border)' }}>Decline</button>
        <button className="btn-primary" onClick={handleAccept}>Accept All</button>
      </div>
    </div>
  );
}
