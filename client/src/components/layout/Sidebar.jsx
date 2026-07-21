import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/past-questions', icon: '📚', label: 'Past Questions' },
  { to: '/classrooms', icon: '🎥', label: 'Classrooms' },
  { to: '/groups', icon: '🤝', label: 'Communities' },
  { to: '/chat', icon: '💬', label: 'Messages' },
  { to: '/news', icon: '📰', label: 'News' },
  { to: '/hall-of-fame', icon: '🏆', label: 'Hall of Fame' },
  { to: '/profile', icon: '👤', label: 'My Profile' },
];

const TEACHER_ITEMS = [
  { to: '/classrooms', icon: '🎓', label: 'My Classrooms' },
];

const ADMIN_ITEMS = [
  { to: '/admin', icon: '⚙️', label: 'Admin Panel' },
];

export default function Sidebar() {
  const { user, isTeacher, isAdmin } = useAuth();
  const items = [
    ...NAV_ITEMS,
    ...(isTeacher ? TEACHER_ITEMS : []),
    ...(isAdmin ? ADMIN_ITEMS : []),
  ];

  return (
    <aside style={{
      width: '220px',
      flexShrink: 0,
      background: 'var(--white)',
      border: '1px solid var(--border)',
      borderRadius: '20px',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      height: 'fit-content',
      position: 'sticky',
      top: '80px'
    }}>
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: isActive ? 700 : 500,
            color: isActive ? 'var(--navy)' : 'var(--text-muted)',
            background: isActive ? 'rgba(10, 22, 40, 0.05)' : 'transparent',
            transition: 'all 0.15s ease'
          })}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </aside>
  );
}
