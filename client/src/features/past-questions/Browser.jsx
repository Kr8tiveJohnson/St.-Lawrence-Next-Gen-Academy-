import { useEffect, useState } from 'react';
import client from '../../api/client';

const EXAMS = ['WAEC', 'JAMB', 'NECO', 'GCE'];

export default function Browser({ onSelect }) {
  const [exam, setExam] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!exam) return;
    client.get(`/questions/subjects?examType=${exam}`)
      .then(({ data }) => setSubjects(data.subjects || []))
      .catch(() => setSubjects([]));
    setSubject(''); setYear(''); setYears([]); setQuestions([]);
  }, [exam]);

  useEffect(() => {
    if (!exam || !subject) return;
    client.get(`/questions/years?examType=${exam}&subject=${subject}`)
      .then(({ data }) => setYears(data.years || []))
      .catch(() => setYears([]));
    setYear(''); setQuestions([]);
  }, [exam, subject]);

  useEffect(() => {
    if (!exam || !subject || !year) return;
    setLoading(true);
    client.get(`/questions?examType=${exam}&subject=${subject}&year=${year}`)
      .then(({ data }) => setQuestions(data.questions || []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [exam, subject, year]);

  const selectStyle = {
    padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border)',
    fontSize: '0.9rem', background: 'white', cursor: 'pointer', minWidth: '160px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <select value={exam} onChange={e => setExam(e.target.value)} style={selectStyle}>
          <option value="">Select Exam…</option>
          {EXAMS.map(e => <option key={e}>{e}</option>)}
        </select>
        <select value={subject} onChange={e => setSubject(e.target.value)} disabled={!subjects.length} style={selectStyle}>
          <option value="">Select Subject…</option>
          {subjects.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={year} onChange={e => setYear(e.target.value)} disabled={!years.length} style={selectStyle}>
          <option value="">Select Year…</option>
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {loading && <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>Loading questions…</div>}

      {!loading && questions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {questions.map((q, i) => (
            <div key={q.id} onClick={() => onSelect?.(q)}
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', transition: 'all 0.15s ease' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Question {i + 1}</div>
              <div style={{ color: 'var(--navy)', fontWeight: 600, lineHeight: 1.5 }}>{q.questionText}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && year && questions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', background: 'var(--off-white)', borderRadius: '16px' }}>
          No questions found for this selection.
        </div>
      )}
    </div>
  );
}
