import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.6rem' }}>🎓</span>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1.5px', color: 'var(--navy)' }}>ST. LAWRENCE</div>
          <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '1px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Next Gen Academy</div>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--navy)', color: 'var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1rem'
              }}>
                {(user.profile?.fullName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            </Link>
            <button
              onClick={handleLogout}
              style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem', color: 'var(--navy)', fontWeight: 600 }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
