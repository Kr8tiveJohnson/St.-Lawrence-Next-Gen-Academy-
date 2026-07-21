import { Link } from 'react-router-dom';

export default function TeacherPanel({ user }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ color: 'var(--navy)', fontSize: '1.3rem', margin: 0 }}>
        Teacher Dashboard 🎓
      </h2>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
        Welcome, {user?.profile?.fullName || 'Teacher'}. Manage your classrooms and students.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {[
          { label: 'My Classrooms', to: '/classrooms', icon: '🎥' },
          { label: 'Communities', to: '/groups', icon: '🤝' },
          { label: 'Messages', to: '/chat', icon: '💬' },
          { label: 'News', to: '/news', icon: '📰' },
        ].map(({ label, to, icon }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none', background: 'var(--off-white)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'all 0.15s ease' }}>
            <span style={{ fontSize: '1.6rem' }}>{icon}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)' }}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
