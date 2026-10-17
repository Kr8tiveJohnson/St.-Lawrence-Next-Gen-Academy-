import React, { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const EXAM_TYPES = ['ALL', 'JAMB', 'WAEC', 'NECO', 'INTERNAL'];
const SUBJECTS = ['ALL', 'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics'];

export default function QuestionBankManager({ onBack }) {
  const { isTeacherOrAdmin } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filters
  const [examType, setExamType] = useState('ALL');
  const [subject, setSubject] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Add/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    examType: 'JAMB',
    subject: 'Mathematics',
    targetClass: 'JAMB',
    topic: '',
    year: 2025,
    difficulty: 'MEDIUM',
    questionText: '',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' },
    ],
    correctOption: 'A',
    explanation: ''
  });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (examType !== 'ALL') params.set('examType', examType);
      if (subject !== 'ALL') params.set('subject', subject);
      if (search) params.set('search', search);
      params.set('page', page);
      params.set('limit', 20);

      const res = await client.get(`/cbt/questions?${params.toString()}`);
      setQuestions(res.data.questions || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Fetch questions error:', err);
    } finally {
      setLoading(false);
    }
  }, [examType, subject, search, page]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleOpenAdd = () => {
    setEditItem(null);
    setForm({
      examType: 'JAMB',
      subject: 'Mathematics',
      targetClass: 'JAMB',
      topic: '',
      year: 2025,
      difficulty: 'MEDIUM',
      questionText: '',
      options: [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
      ],
      correctOption: 'A',
      explanation: ''
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditItem(q);
    setForm({
      examType: q.examType || 'JAMB',
      subject: q.subject || 'Mathematics',
      targetClass: q.targetClass || 'JAMB',
      topic: q.topic || '',
      year: q.year || 2024,
      difficulty: q.difficulty || 'MEDIUM',
      questionText: q.questionText || '',
      options: Array.isArray(q.options) ? q.options : [
        { id: 'A', text: '' },
        { id: 'B', text: '' },
        { id: 'C', text: '' },
        { id: 'D', text: '' },
      ],
      correctOption: q.correctOption || 'A',
      explanation: q.explanation || ''
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question from the question bank?')) return;
    try {
      await client.delete(`/cbt/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete question');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    try {
      if (editItem) {
        await client.put(`/cbt/questions/${editItem.id}`, form);
      } else {
        await client.post('/cbt/questions', form);
      }
      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save question. Check permissions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <button onClick={onBack} className="cbt-btn cbt-btn-outline" style={{ marginBottom: '12px' }}>
            ← Back to Exam Hall
          </button>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)' }}>
            Central Question Bank Manager
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage and expand test questions for JAMB UTME, WAEC SSCE, NECO, and Academy Internal assessments.
          </p>
        </div>

        <div>
          <button onClick={handleOpenAdd} className="cbt-btn cbt-btn-gold">
            + Add New Question
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{
        background: '#fff',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '24px'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
            EXAM TYPE
          </label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            style={selectStyle}
          >
            {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
            SUBJECT
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={selectStyle}
          >
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
            SEARCH QUESTIONS
          </label>
          <input
            type="text"
            placeholder="Search keywords, topics, or formulas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...selectStyle, width: '100%' }}
          />
        </div>

        <div style={{ alignSelf: 'flex-end', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {total} questions found
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading questions from repository...
        </div>
      ) : questions.length === 0 ? (
        <div style={{ padding: '60px', background: '#fff', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <h3>No questions match your current filter</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Try selecting "ALL" or click "+ Add New Question" to create one.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {questions.map((q, idx) => (
            <div
              key={q.id}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`cbt-badge cbt-badge-${(q.examType || 'JAMB').toLowerCase()}`}>
                    {q.examType}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--navy)' }}>
                    {q.subject} • {q.topic}
                  </span>
                  {q.year && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({q.year})</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleOpenEdit(q)} className="cbt-btn cbt-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="cbt-btn cbt-btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    Delete
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
                {idx + 1}. {q.questionText}
              </div>

              {/* Options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                {(q.options || []).map((opt) => (
                  <div
                    key={opt.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: q.correctOption === opt.id ? 'var(--green-dim)' : 'var(--surface-2)',
                      border: q.correctOption === opt.id ? '1px solid var(--green)' : '1px solid transparent',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <strong>{opt.id}.</strong> {opt.text}
                    {q.correctOption === opt.id && (
                      <span style={{ marginLeft: 'auto', color: 'var(--green)', fontWeight: 800 }}>✓ Correct</span>
                    )}
                  </div>
                ))}
              </div>

              {q.explanation && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--surface-2)', padding: '10px 14px', borderRadius: '8px' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="cbt-modal-backdrop">
          <div className="cbt-modal-card" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '16px' }}>
              {editItem ? 'Edit Question' : 'Create New CBT Question'}
            </h3>

            {errorMsg && (
              <div style={{ padding: '12px', background: 'var(--red-dim)', color: 'var(--red)', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Exam Type</label>
                  <select
                    value={form.examType}
                    onChange={(e) => setForm({ ...form, examType: e.target.value })}
                    style={{ ...selectStyle, width: '100%' }}
                  >
                    <option value="JAMB">JAMB</option>
                    <option value="WAEC">WAEC</option>
                    <option value="NECO">NECO</option>
                    <option value="INTERNAL">INTERNAL</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{ ...selectStyle, width: '100%' }}
                  >
                    {SUBJECTS.filter((s) => s !== 'ALL').map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Year</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    style={{ ...selectStyle, width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Quadratic Equations, Motion, Concord"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  style={{ ...selectStyle, width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Question Text</label>
                <textarea
                  rows={3}
                  placeholder="Type the full exam question here..."
                  value={form.questionText}
                  onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                  style={{ ...selectStyle, width: '100%', resize: 'vertical' }}
                  required
                />
              </div>

              {/* Options */}
              <div>
                <label style={labelStyle}>Options</label>
                {['A', 'B', 'C', 'D'].map((letter, i) => (
                  <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, width: '20px' }}>{letter}.</span>
                    <input
                      type="text"
                      placeholder={`Option ${letter} text`}
                      value={form.options[i]?.text || ''}
                      onChange={(e) => {
                        const newOpts = [...form.options];
                        newOpts[i] = { id: letter, text: e.target.value };
                        setForm({ ...form, options: newOpts });
                      }}
                      style={{ ...selectStyle, flex: 1 }}
                      required
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Correct Option</label>
                  <select
                    value={form.correctOption}
                    onChange={(e) => setForm({ ...form, correctOption: e.target.value })}
                    style={{ ...selectStyle, width: '100%', borderColor: 'var(--green)' }}
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    style={{ ...selectStyle, width: '100%' }}
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Solution & Explanation (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Detailed step-by-step solution shown during review..."
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  style={{ ...selectStyle, width: '100%', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="cbt-btn cbt-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cbt-btn cbt-btn-gold"
                >
                  {saving ? 'Saving...' : editItem ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--border-strong)',
  fontSize: '0.88rem',
  background: '#fff',
  fontFamily: 'inherit',
  outline: 'none'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '4px',
  textTransform: 'uppercase'
};
