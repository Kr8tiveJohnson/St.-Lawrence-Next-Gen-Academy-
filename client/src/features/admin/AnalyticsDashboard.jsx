import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics…</div>;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: '👥', color: '#3b82f6' },
    { label: 'Teachers', value: stats?.activeTeachers ?? 0, icon: '🎓', color: '#8b5cf6' },
    { label: 'Premium Users', value: stats?.premiumUsers ?? 0, icon: '⭐', color: '#f59e0b' },
    { label: 'Total Revenue', value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: '#10b981' },
    { label: 'Courses', value: stats?.coursesPublished ?? 0, icon: '📹', color: '#6366f1' },
    { label: 'News Articles', value: stats?.newsArticles ?? 0, icon: '📰', color: '#ec4899' },
    { label: 'Hall of Fame', value: stats?.hallOfFameEntries ?? 0, icon: '🏆', color: '#f97316' },
    { label: 'Messages Sent', value: stats?.totalMessages ?? 0, icon: '💬', color: '#14b8a6' },
  ];

  return (
    <div>
      <h2 style={{ color: 'var(--navy)', marginBottom: '24px', fontSize: '1.4rem' }}>Analytics Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
        {cards.map(({ label, value, icon, color }) => (
          <div key={label} style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            borderTop: `4px solid ${color}`
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--navy)' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
