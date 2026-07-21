import { useState } from 'react';
import client from '../../api/client';

const TABS = ['news', 'courses', 'questions'];

export default function ContentManager() {
  const [tab, setTab] = useState('news');
  const [form, setForm] = useState({ title: '', tag: '', summary: '', details: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    try {
      if (tab === 'news') {
        await client.post('/news', form);
        setSuccess('News article published!');
      }
      setForm({ title: '', tag: '', summary: '', details: '' });
    } catch {
      alert('Submission failed. Check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginBottom: '20px' }}>Content Manager</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: tab === t ? 800 : 500,
            color: tab === t ? 'var(--navy)' : 'var(--text-muted)',
            borderBottom: tab === t ? '2px solid var(--navy)' : '2px solid transparent',
            textTransform: 'capitalize', fontSize: '0.9rem'
          }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'news' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
          {success && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 16px', color: '#16a34a', fontSize: '0.9rem' }}>{success}</div>}
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.85rem', color: 'var(--navy)' }}>Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.85rem', color: 'var(--navy)' }}>Tag</label>
            <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
              <option value="">Select tag…</option>
              {['announcement', 'update', 'exam-tip', 'success-story', 'hall-of-fame'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.85rem', color: 'var(--navy)' }}>Summary</label>
            <textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} required rows={3}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.85rem', color: 'var(--navy)' }}>Full Details</label>
            <textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} required rows={6}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Publishing…' : 'Publish Article'}
          </button>
        </form>
      )}

      {tab !== 'news' && (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--off-white)', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚧</div>
          <p style={{ margin: 0 }}>The <strong>{tab}</strong> content manager is coming soon.</p>
        </div>
      )}
    </div>
  );
}
