import { useEffect, useState } from 'react';
import client from '../api/client';

const AD_FACTS = [
  "Students who revise daily retain 40% more than those who cram.",
  "Reading out loud boosts memory retention by 10%.",
  "The best time to study is right after a good night's sleep.",
  "St. Lawrence Next Gen Academy has helped 3,200+ students succeed!",
  "Practice tests are the most effective form of exam revision."
];

export default function AdBanner({ slot = 'sidebar' }) {
  const [adConfig, setAdConfig] = useState(null);

  useEffect(() => {
    client.get('/admin/ads/settings')
      .then(({ data }) => {
        const active = (data.settings || []).find(a => a.slot === slot && a.isActive);
        if (active) setAdConfig(active);
      })
      .catch(() => {});
  }, [slot]);

  if (adConfig) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ fontSize: '0.7rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Advertisement</div>
        <div id={adConfig.clientId}></div>
      </div>
    );
  }

  // Fallback: fun fact card
  const fact = AD_FACTS[Math.floor(Date.now() / 86400000) % AD_FACTS.length];
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--navy), #1a3a6b)',
      borderRadius: '16px',
      padding: '20px',
      color: 'white',
      fontSize: '0.9rem',
      lineHeight: '1.6'
    }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
        💡 Study Tip
      </div>
      <p style={{ margin: 0 }}>{fact}</p>
    </div>
  );
}
