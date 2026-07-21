import { useEffect, useState } from 'react';
import client from '../../api/client';
import QuestionViewer from './QuestionViewer';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    client.get('/questions/bookmarks')
      .then(({ data }) => setBookmarks(data.bookmarks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (pastQuestionId) => {
    try {
      await client.delete(`/questions/bookmarks/${pastQuestionId}`);
      setBookmarks(prev => prev.filter(b => b.pastQuestionId !== pastQuestionId));
      if (selected?.id === pastQuestionId) setSelected(null);
    } catch { alert('Failed to remove bookmark.'); }
  };

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading bookmarks…</div>;

  if (bookmarks.length === 0) return (
    <div style={{ padding: '64px', textAlign: 'center', background: 'var(--off-white)', borderRadius: '16px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔖</div>
      <h3 style={{ color: 'var(--navy)', marginBottom: '8px' }}>No bookmarks yet</h3>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Bookmark questions while practising to review them here.</p>
    </div>
  );

  const questions = bookmarks.map(b => b.pastQuestion).filter(Boolean);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'start' }}>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>
          🔖 Saved Questions ({bookmarks.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {questions.map((q, i) => (
            <div key={q.id}
              onClick={() => { setSelected(q); setSelectedIdx(i); }}
              style={{
                padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                background: selected?.id === q.id ? 'rgba(10,22,40,0.05)' : 'white',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px'
              }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{q.examType} · {q.subject} · {q.year}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: 600, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{q.questionText}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); removeBookmark(q.id); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0, padding: '0 4px' }}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <QuestionViewer
        question={selected}
        onNext={() => { const next = Math.min(selectedIdx + 1, questions.length - 1); setSelectedIdx(next); setSelected(questions[next]); }}
        onPrev={() => { const prev = Math.max(selectedIdx - 1, 0); setSelectedIdx(prev); setSelected(questions[prev]); }}
      />
    </div>
  );
}
