import { Link } from 'react-router-dom';

export default function AdminPanel({ stats }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ color: 'var(--navy)', fontSize: '1.3rem', margin: 0 }}>Admin Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: '👥' },
          { label: 'Teachers', value: stats?.activeTeachers ?? '—', icon: '🎓' },
          { label: 'Premium Users', value: stats?.premiumUsers ?? '—', icon: '⭐' },
          { label: 'Total Revenue', value: stats?.totalRevenue ? `₦${stats.totalRevenue.toLocaleString()}` : '—', icon: '💰' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{ background: 'var(--off-white)', borderRadius: '16px', padding: '20px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--navy)' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
        <Link to="/admin" className="btn-primary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>Open Admin Panel →</Link>
      </div>
    </div>
  );
}
