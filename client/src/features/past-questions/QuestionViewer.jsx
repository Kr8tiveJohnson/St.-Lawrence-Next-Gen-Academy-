import { useState } from 'react';

export default function QuestionViewer({ question, onNext, onPrev }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  if (!question) return (
    <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--off-white)', borderRadius: '16px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📖</div>
      <p style={{ margin: 0 }}>Select a question from the browser to start practising.</p>
    </div>
  );

  const options = typeof question.options === 'string' ? JSON.parse(question.options) : question.options;

  const handleSelect = (key) => {
    if (revealed) return;
    setSelected(key);
  };

  const handleReveal = () => setRevealed(true);
  const handleNext = () => { setSelected(null); setRevealed(false); onNext?.(); };
  const handlePrev = () => { setSelected(null); setRevealed(false); onPrev?.(); };

  const getOptionStyle = (key) => {
    const base = { padding: '14px 18px', borderRadius: '12px', border: '2px solid', cursor: revealed ? 'default' : 'pointer', fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.15s ease', lineHeight: 1.5 };
    if (!revealed) return { ...base, borderColor: selected === key ? 'var(--navy)' : 'var(--border)', background: selected === key ? 'rgba(10,22,40,0.05)' : 'white', color: 'var(--navy)' };
    if (key === question.correctOption) return { ...base, borderColor: '#16a34a', background: '#f0fdf4', color: '#15803d' };
    if (key === selected) return { ...base, borderColor: '#dc2626', background: '#fef2f2', color: '#dc2626' };
    return { ...base, borderColor: 'var(--border)', background: 'var(--off-white)', color: 'var(--text-muted)' };
  };

  return (
    <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--navy)', color: 'white', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>{question.examType}</span>
        <span style={{ background: 'var(--off-white)', color: 'var(--navy)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)' }}>{question.subject}</span>
        <span style={{ background: 'var(--off-white)', color: 'var(--navy)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border)' }}>{question.year}</span>
      </div>

      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.7, margin: 0 }}>{question.questionText}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Object.entries(options || {}).map(([key, value]) => (
          <div key={key} onClick={() => handleSelect(key)} style={getOptionStyle(key)}>
            <span style={{ fontWeight: 800, marginRight: '10px' }}>{key}.</span> {value}
            {revealed && key === question.correctOption && <span style={{ marginLeft: '8px' }}>✅</span>}
            {revealed && key === selected && key !== question.correctOption && <span style={{ marginLeft: '8px' }}>❌</span>}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {!revealed && selected && (
          <button onClick={handleReveal} className="btn-primary">Check Answer</button>
        )}
        <button onClick={handlePrev} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>← Prev</button>
        <button onClick={handleNext} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Next →</button>
      </div>
    </div>
  );
}
