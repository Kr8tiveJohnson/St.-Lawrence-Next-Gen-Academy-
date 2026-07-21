import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--navy)',
      color: 'rgba(255,255,255,0.7)',
      padding: '48px 24px 32px',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>

          {/* Brand */}
          <div>
            <div style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '1px', color: 'white', marginBottom: '8px' }}>ST. LAWRENCE</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '16px' }}>NEXT GEN ACADEMY</div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
              Empowering Nigerian students with world-class exam prep and digital skills.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: '16px', fontSize: '0.9rem' }}>Platform</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <Link to="/past-questions" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Past Questions</Link>
              <Link to="/classrooms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Classrooms</Link>
              <Link to="/groups" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Communities</Link>
              <Link to="/hall-of-fame" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Hall of Fame</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: '16px', fontSize: '0.9rem' }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <Link to="/news" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>News</Link>
              <Link to="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Terms of Service</Link>
              <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Privacy Policy</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, color: 'white', marginBottom: '16px', fontSize: '0.9rem' }}>Contact Us</div>
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="mailto:support@stlawrence.edu" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>support@stlawrence.edu</a>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>Lagos, Nigeria</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem' }}>
          <span>© {currentYear} St. Lawrence Next Gen Academy. All rights reserved.</span>
          <span>Built with ❤️ for Nigerian students.</span>
        </div>
      </div>
    </footer>
  );
}
