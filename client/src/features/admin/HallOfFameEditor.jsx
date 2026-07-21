import { useState } from 'react';
import client from '../../api/client';

export default function HallOfFameEditor() {
  const [form, setForm] = useState({ title: '', summary: '', details: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    try {
      await client.post('/news', { ...form, tag: 'hall-of-fame' });
      setSuccess('Hall of Fame entry added!');
      setForm({ title: '', summary: '', details: '' });
    } catch {
      alert('Failed to add entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginBottom: '8px' }}>Hall of Fame Editor</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
        Add a new student success story or achievement to the Hall of Fame.
      </p>

      {success && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 16px', color: '#16a34a', fontSize: '0.9rem', marginBottom: '20px' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.85rem', color: 'var(--navy)' }}>Student Name / Title</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Adaeze Okonkwo scored 9 A1s in WAEC 2024 🎉"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.85rem', color: 'var(--navy)' }}>Short Summary</label>
          <textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} required rows={2}
            placeholder="Brief description shown on the Hall of Fame card…"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.85rem', color: 'var(--navy)' }}>Full Details / Story</label>
          <textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} required rows={5}
            placeholder="Full story, achievements, inspiration quote, etc…"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: submitting ? 0.6 : 1 }}>
          {submitting ? 'Saving…' : '🏆 Add to Hall of Fame'}
        </button>
      </form>
    </div>
  );
}
