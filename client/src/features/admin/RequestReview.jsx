export default function RequestReview() {
  return (
    <div>
      <h2 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginBottom: '8px' }}>Request Review</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Review pending profile photo approvals and content requests.
      </p>
      <div style={{ padding: '64px', textAlign: 'center', background: 'var(--off-white)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>No pending requests at this time.</p>
      </div>
    </div>
  );
}
