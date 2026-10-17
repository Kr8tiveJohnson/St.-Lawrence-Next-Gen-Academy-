import React, { useState, useEffect, useCallback, useMemo } from 'react';
import client from '../../api/client';

const EXAM_TYPES = ['ALL', 'JAMB', 'WAEC', 'NECO', 'INTERNAL'];
const DIFFICULTIES = ['ALL', 'EASY', 'MEDIUM', 'HARD'];
const STATUSES = ['ALL', 'APPROVED', 'PENDING_REVIEW', 'DRAFT', 'REJECTED', 'ARCHIVED'];
const ORIGINS = ['ALL', 'PAST_QUESTION', 'ORIGINAL_PRACTICE', 'AI_GENERATED'];

const MATH_SYMBOLS = ['±', '√', 'π', 'θ', 'α', 'β', '²', '³', '≤', '≥', '≠', '≈', '∫', '∑', '÷', '×', '°', 'Δ', 'λ', 'Ω'];

export default function QuestionBankAdmin() {
  // Navigation sub-tab: 'questions' | 'subjects' | 'history'
  const [subTab, setSubTab] = useState('questions');

  // Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Subjects & Topics
  const [subjectsList, setSubjectsList] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Question List State
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 15;

  // Filters
  const [filterExam, setFilterExam] = useState('ALL');
  const [filterSubject, setFilterSubject] = useState('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterOrigin, setFilterOrigin] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [reviewModalQuestion, setReviewModalQuestion] = useState(null);
  const [newSubjectModalOpen, setNewSubjectModalOpen] = useState(false);
  const [newTopicSubject, setNewTopicSubject] = useState(null);

  // Feedback Notification
  const [alertBanner, setAlertBanner] = useState(null);
  const showAlert = (type, message) => {
    setAlertBanner({ type, message });
    setTimeout(() => setAlertBanner(null), 5000);
  };

  // ── Fetch Real-time Stats ──────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await client.get('/cbt/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load CBT stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // ── Fetch Configurable Subjects & Topics ───────────────────────────
  const fetchSubjects = useCallback(async () => {
    setLoadingSubjects(true);
    try {
      const res = await client.get('/cbt/subjects');
      setSubjectsList(res.data.subjects || []);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  // ── Fetch Filtered & Paginated Questions ───────────────────────────
  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const params = new URLSearchParams();
      if (filterExam !== 'ALL') params.set('examType', filterExam);
      if (filterSubject !== 'ALL') params.set('subject', filterSubject);
      if (filterDifficulty !== 'ALL') params.set('difficulty', filterDifficulty);
      if (filterStatus !== 'ALL') params.set('status', filterStatus);
      if (filterOrigin !== 'ALL') params.set('origin', filterOrigin);
      if (filterYear !== 'ALL') params.set('year', filterYear);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      params.set('page', page);
      params.set('limit', limit);

      const res = await client.get(`/cbt/questions?${params.toString()}`);
      setQuestions(res.data.questions || []);
      setTotalQuestions(res.data.total || 0);
      setSelectedIds([]);
    } catch (err) {
      console.error('Failed to load questions:', err);
      showAlert('error', 'Failed to retrieve questions from question bank.');
    } finally {
      setLoadingQuestions(false);
    }
  }, [filterExam, filterSubject, filterDifficulty, filterStatus, filterOrigin, filterYear, searchQuery, page]);

  useEffect(() => {
    fetchStats();
    fetchSubjects();
  }, [fetchStats, fetchSubjects]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // ── Bulk Actions Handler ───────────────────────────────────────────
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    if (action === 'DELETE' && !window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} questions?`)) {
      return;
    }

    setBulkActionLoading(true);
    try {
      const res = await client.post('/cbt/questions/bulk', {
        ids: selectedIds,
        action
      });
      showAlert('success', res.data.message || `Bulk action "${action}" completed.`);
      fetchQuestions();
      fetchStats();
    } catch (err) {
      showAlert('error', err.response?.data?.error || 'Failed to execute bulk action.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  // ── Delete Single Question ─────────────────────────────────────────
  const handleDeleteQuestion = async (id, questionText) => {
    const isSoft = window.confirm(
      `Do you want to ARCHIVE this question? (Click 'Cancel' to permanently delete):\n\n"${questionText.slice(0, 60)}..."`
    );
    try {
      const res = await client.delete(`/cbt/questions/${id}${isSoft ? '?soft=true' : ''}`);
      showAlert('success', res.data.message);
      fetchQuestions();
      fetchStats();
    } catch (err) {
      showAlert('error', err.response?.data?.error || 'Failed to delete question.');
    }
  };

  return (
    <div style={{ padding: '0 4px', maxWidth: '1440px', margin: '0 auto', fontFamily: 'var(--font-b, sans-serif)' }}>
      
      {/* ── Top Header & Action Controls ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.4rem' }}>📚</span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--navy, #0a1628)', margin: 0 }}>
              CBT Question Bank & Syllabus Management
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
            Unified question acquisition, syllabus moderation, AI generation, and bulk imports for JAMB UTME, WAEC, NECO & Academy Mocks.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setEditingQuestion(null);
              setEditModalOpen(true);
            }}
            style={actionBtnStyle('#0f172a', '#ffffff')}
          >
            <span>➕</span> Add Question
          </button>

          <button
            type="button"
            onClick={() => setAiModalOpen(true)}
            style={actionBtnStyle('#dfa921', '#0a1628')}
          >
            <span>🤖</span> AI Question Generator
          </button>

          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            style={actionBtnStyle('#2563eb', '#ffffff')}
          >
            <span>📥</span> Bulk Import (CSV / JSON)
          </button>
        </div>
      </div>

      {/* ── Alert Notification ── */}
      {alertBanner && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.88rem',
          fontWeight: 700,
          background: alertBanner.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: alertBanner.type === 'error' ? '#b91c1c' : '#15803d',
          border: `1px solid ${alertBanner.type === 'error' ? '#fca5a5' : '#86efac'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{alertBanner.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{alertBanner.message}</span>
        </div>
      )}

      {/* ── Section 1: Real-time Stats Cards ── */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <StatBox label="Total Questions" value={stats.total} icon="📚" color="#0a1628" />
          <StatBox label="JAMB UTME" value={stats.byExam?.JAMB || 0} icon="🎯" color="#2563eb" sub="Official & Practice" />
          <StatBox label="WAEC SSCE" value={stats.byExam?.WAEC || 0} icon="📝" color="#059669" sub="Senior Secondary" />
          <StatBox label="NECO SSCE" value={stats.byExam?.NECO || 0} icon="📖" color="#d97706" sub="National Syllabus" />
          <StatBox label="Academy Mocks" value={stats.byExam?.INTERNAL || 0} icon="🏛️" color="#7c3aed" sub="Internal Tests" />
          <StatBox label="Approved & Published" value={stats.publishedCount || 0} icon="✅" color="#10b981" sub="Live for Students" />
          <StatBox label="Pending Review" value={stats.byStatus?.PENDING_REVIEW || 0} icon="⏳" color="#f59e0b" sub="Action Required" />
        </div>
      )}

      {/* ── Section 2: Sub-navigation Tabs ── */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '20px', gap: '20px' }}>
        <button
          type="button"
          onClick={() => setSubTab('questions')}
          style={subTabBtnStyle(subTab === 'questions')}
        >
          📋 Question Explorer ({totalQuestions})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('subjects')}
          style={subTabBtnStyle(subTab === 'subjects')}
        >
          ⚙️ Subjects & Topics ({subjectsList.length})
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── SUB-TAB 1: QUESTIONS EXPLORER ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'questions' && (
        <div>
          {/* Filters Bar */}
          <div style={{
            background: '#ffffff',
            padding: '16px 20px',
            borderRadius: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
              <input
                type="text"
                placeholder="Search question text, topic, passage, or source..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <div>
                <label style={filterLabelStyle}>Exam Body</label>
                <select value={filterExam} onChange={e => { setFilterExam(e.target.value); setPage(1); }} style={selectStyle}>
                  {EXAM_TYPES.map(e => <option key={e} value={e}>{e === 'ALL' ? 'All Exams' : e}</option>)}
                </select>
              </div>

              <div>
                <label style={filterLabelStyle}>Subject</label>
                <select value={filterSubject} onChange={e => { setFilterSubject(e.target.value); setPage(1); }} style={selectStyle}>
                  <option value="ALL">All Subjects</option>
                  {subjectsList.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label style={filterLabelStyle}>Difficulty</label>
                <select value={filterDifficulty} onChange={e => { setFilterDifficulty(e.target.value); setPage(1); }} style={selectStyle}>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d === 'ALL' ? 'All Difficulties' : d}</option>)}
                </select>
              </div>

              <div>
                <label style={filterLabelStyle}>Workflow Status</label>
                <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} style={selectStyle}>
                  {STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
                </select>
              </div>

              <div>
                <label style={filterLabelStyle}>Question Origin</label>
                <select value={filterOrigin} onChange={e => { setFilterOrigin(e.target.value); setPage(1); }} style={selectStyle}>
                  {ORIGINS.map(o => <option key={o} value={o}>{o === 'ALL' ? 'All Origins' : o.replace('_', ' ')}</option>)}
                </select>
              </div>

              <div>
                <label style={filterLabelStyle}>Exam Year</label>
                <select value={filterYear} onChange={e => { setFilterYear(e.target.value); setPage(1); }} style={selectStyle}>
                  <option value="ALL">All Years</option>
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2015, 2010].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions Banner */}
          {selectedIds.length > 0 && (
            <div style={{
              background: '#0a1628',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 4px 16px rgba(10,22,40,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#dfa921', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 900, fontSize: '0.8rem' }}>
                  {selectedIds.length}
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Questions selected</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  disabled={bulkActionLoading}
                  onClick={() => handleBulkAction('APPROVE')}
                  style={bulkBtnStyle('#10b981')}
                >
                  ✅ Approve & Publish
                </button>
                <button
                  type="button"
                  disabled={bulkActionLoading}
                  onClick={() => handleBulkAction('REJECT')}
                  style={bulkBtnStyle('#ef4444')}
                >
                  ❌ Reject
                </button>
                <button
                  type="button"
                  disabled={bulkActionLoading}
                  onClick={() => handleBulkAction('ARCHIVE')}
                  style={bulkBtnStyle('#64748b')}
                >
                  📦 Archive
                </button>
                <button
                  type="button"
                  disabled={bulkActionLoading}
                  onClick={() => handleBulkAction('DELETE')}
                  style={bulkBtnStyle('#dc2626')}
                >
                  🗑️ Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  style={bulkBtnStyle('transparent', '1px solid rgba(255,255,255,0.3)')}
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* Questions Table */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 16px', width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={questions.length > 0 && selectedIds.length === questions.length}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(questions.map(q => q.id));
                          else setSelectedIds([]);
                        }}
                      />
                    </th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#334155' }}>Exam / Subject</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#334155' }}>Question & Options</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#334155' }}>Topic & Diff</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#334155' }}>Origin & Year</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#334155' }}>Status</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#334155', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loadingQuestions ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
                        ⏳ Loading questions from question bank...
                      </td>
                    </tr>
                  ) : questions.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
                        No questions found matching your filter criteria. Try clearing filters or add a new question.
                      </td>
                    </tr>
                  ) : (
                    questions.map((q) => {
                      const isSelected = selectedIds.includes(q.id);
                      return (
                        <tr
                          key={q.id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: isSelected ? '#f8faff' : '#ffffff',
                            transition: 'background 0.15s'
                          }}
                        >
                          {/* Checkbox */}
                          <td style={{ padding: '14px 16px' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedIds(prev => [...prev, q.id]);
                                else setSelectedIds(prev => prev.filter(id => id !== q.id));
                              }}
                            />
                          </td>

                          {/* Exam / Subject */}
                          <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={examBadgeStyle(q.examType)}>{q.examType}</span>
                              <strong style={{ color: '#0f172a', fontSize: '0.86rem' }}>{q.subject}</strong>
                            </div>
                          </td>

                          {/* Question Text & Snippet */}
                          <td style={{ padding: '14px 16px', maxWidth: '380px' }}>
                            {q.passageText && (
                              <div style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic', marginBottom: '4px' }}>
                                📄 Shared Passage Attached
                              </div>
                            )}
                            <div style={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.4, marginBottom: '6px' }}>
                              {q.questionText}
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.76rem', color: '#64748b' }}>
                              <span>Key: <strong style={{ color: '#059669' }}>({q.correctOption})</strong></span>
                              <span>•</span>
                              <span>{Array.isArray(q.options) ? q.options.length : 0} Options</span>
                              {q.explanation && <span>• 💡 Worked Solution</span>}
                            </div>
                          </td>

                          {/* Topic & Difficulty */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ color: '#334155', fontWeight: 600, fontSize: '0.82rem', marginBottom: '4px' }}>
                              {q.topic}
                            </div>
                            <span style={difficultyBadgeStyle(q.difficulty)}>{q.difficulty}</span>
                          </td>

                          {/* Origin & Year */}
                          <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={originBadgeStyle(q.origin)}>
                                {q.origin === 'PAST_QUESTION' ? '📜 Past Question' : q.origin === 'AI_GENERATED' ? '🤖 AI Draft' : '✏️ Practice'}
                              </span>
                              {q.year && (
                                <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700 }}>
                                  Year {q.year}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Workflow Status */}
                          <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={statusBadgeStyle(q.status)}>{q.status}</span>
                              <span style={{ fontSize: '0.74rem', color: q.isPublished ? '#16a34a' : '#94a3b8', fontWeight: 700 }}>
                                {q.isPublished ? '● Published' : '○ Unpublished'}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                type="button"
                                title="Preview Student View"
                                onClick={() => setPreviewQuestion(q)}
                                style={tableActionBtnStyle('#f1f5f9', '#0f172a')}
                              >
                                👁️
                              </button>
                              <button
                                type="button"
                                title="Edit Question"
                                onClick={() => {
                                  setEditingQuestion(q);
                                  setEditModalOpen(true);
                                }}
                                style={tableActionBtnStyle('#fef3c7', '#d97706')}
                              >
                                ✏️
                              </button>
                              <button
                                type="button"
                                title="Review / Status Decision"
                                onClick={() => setReviewModalQuestion(q)}
                                style={tableActionBtnStyle('#e0e7ff', '#4f46e5')}
                              >
                                ⚖️
                              </button>
                              <button
                                type="button"
                                title="Delete or Archive"
                                onClick={() => handleDeleteQuestion(q.id, q.questionText)}
                                style={tableActionBtnStyle('#fee2e2', '#dc2626')}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderTop: '1px solid #e2e8f0',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <span style={{ fontSize: '0.84rem', color: '#64748b' }}>
                Showing <strong>{questions.length}</strong> of <strong>{totalQuestions}</strong> questions
              </span>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  style={paginationBtnStyle(page <= 1)}
                >
                  ← Previous
                </button>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, padding: '0 8px' }}>
                  Page {page} of {Math.ceil(totalQuestions / limit) || 1}
                </span>
                <button
                  type="button"
                  disabled={page >= Math.ceil(totalQuestions / limit)}
                  onClick={() => setPage(p => p + 1)}
                  style={paginationBtnStyle(page >= Math.ceil(totalQuestions / limit))}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── SUB-TAB 2: SUBJECTS & TOPICS CONFIGURATION ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'subjects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)', margin: '0 0 4px' }}>
                Configurable Nigerian Examination Subjects & Syllabuses
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.86rem', margin: 0 }}>
                Manage subjects and topics across JAMB UTME, WAEC SSCE, NECO and internal mock curricula.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewSubjectModalOpen(true)}
              style={actionBtnStyle('#0f172a', '#ffffff')}
            >
              ➕ Add Subject
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {subjectsList.map((subj) => (
              <div
                key={subj.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{subj.icon || '📚'}</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{subj.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Code: {subj.code || 'N/A'}</span>
                    </div>
                  </div>
                  <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                    {subj.questionCount || 0} Questions
                  </span>
                </div>

                {/* Topics list */}
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Syllabus Topics ({subj.topics?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewTopicSubject(subj)}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      + Add Topic
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                    {subj.topics && subj.topics.length > 0 ? (
                      subj.topics.map(t => (
                        <span key={t.id} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600 }}>
                          {t.name}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>No topics configured yet.</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── MODAL: ADD / EDIT QUESTION ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {editModalOpen && (
        <QuestionEditModal
          question={editingQuestion}
          subjects={subjectsList}
          onClose={() => setEditModalOpen(false)}
          onSaved={() => {
            setEditModalOpen(false);
            showAlert('success', editingQuestion ? 'Question updated successfully.' : 'New question added to bank.');
            fetchQuestions();
            fetchStats();
          }}
        />
      )}

      {/* ── MODAL: PREVIEW STUDENT VIEW ── */}
      {previewQuestion && (
        <QuestionPreviewModal
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
        />
      )}

      {/* ── MODAL: BULK CSV / JSON IMPORT ── */}
      {importModalOpen && (
        <BulkImportModal
          onClose={() => setImportModalOpen(false)}
          onImportCompleted={() => {
            setImportModalOpen(false);
            showAlert('success', 'Bulk import processing complete.');
            fetchQuestions();
            fetchStats();
          }}
        />
      )}

      {/* ── MODAL: AI QUESTION GENERATOR ── */}
      {aiModalOpen && (
        <AiGeneratorModal
          subjects={subjectsList}
          onClose={() => setAiModalOpen(false)}
          onGenerated={() => {
            setAiModalOpen(false);
            showAlert('success', 'AI questions generated and saved as Pending Review.');
            fetchQuestions();
            fetchStats();
          }}
        />
      )}

      {/* ── MODAL: FORMAL QUESTION REVIEW DECISION ── */}
      {reviewModalQuestion && (
        <ReviewDecisionModal
          question={reviewModalQuestion}
          onClose={() => setReviewModalQuestion(null)}
          onReviewed={(updated) => {
            setReviewModalQuestion(null);
            showAlert('success', `Question status changed to ${updated.status}.`);
            fetchQuestions();
            fetchStats();
          }}
        />
      )}

      {/* ── MODAL: ADD SUBJECT ── */}
      {newSubjectModalOpen && (
        <NewSubjectModal
          onClose={() => setNewSubjectModalOpen(false)}
          onCreated={() => {
            setNewSubjectModalOpen(false);
            showAlert('success', 'New subject added.');
            fetchSubjects();
          }}
        />
      )}

      {/* ── MODAL: ADD TOPIC ── */}
      {newTopicSubject && (
        <NewTopicModal
          subject={newTopicSubject}
          onClose={() => setNewTopicSubject(null)}
          onCreated={() => {
            setNewTopicSubject(null);
            showAlert('success', 'Topic added.');
            fetchSubjects();
          }}
        />
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SUB-COMPONENT 1: QUESTION ADD/EDIT MODAL ─────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function QuestionEditModal({ question, subjects, onClose, onSaved }) {
  const isEditing = Boolean(question?.id);

  const [form, setForm] = useState({
    examType: question?.examType || 'JAMB',
    subject: question?.subject || (subjects[0]?.name || 'Mathematics'),
    topic: question?.topic || 'General',
    subTopic: question?.subTopic || '',
    syllabusVersion: question?.syllabusVersion || '2024-2027',
    difficulty: question?.difficulty || 'MEDIUM',
    questionType: question?.questionType || 'MULTIPLE_CHOICE',
    questionText: question?.questionText || '',
    options: question?.options && Array.isArray(question.options)
      ? question.options
      : [
          { id: 'A', text: '' },
          { id: 'B', text: '' },
          { id: 'C', text: '' },
          { id: 'D', text: '' }
        ],
    correctOption: question?.correctOption || 'A',
    explanation: question?.explanation || '',
    passageText: question?.passageText || '',
    imageUrl: question?.imageUrl || '',
    markingGuide: question?.markingGuide || '',
    origin: question?.origin || 'ORIGINAL_PRACTICE',
    sourceName: question?.sourceName || '',
    year: question?.year || new Date().getFullYear(),
    status: question?.status || 'APPROVED',
    isPublished: question?.isPublished !== undefined ? question.isPublished : true
  });

  const [optionCount, setOptionCount] = useState(form.options.length >= 5 ? 5 : 4);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize options when count toggles between 4 (A-D) and 5 (A-E)
  const handleToggleOptionCount = (count) => {
    setOptionCount(count);
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const current = [...form.options];
    const newOpts = letters.slice(0, count).map((letter, idx) => {
      const match = current.find(o => o.id === letter);
      return match || { id: letter, text: '' };
    });
    setForm(prev => ({ ...prev, options: newOpts }));
  };

  const handleInsertSymbol = (sym) => {
    setForm(prev => ({ ...prev, questionText: prev.questionText + sym }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.questionText.trim()) {
      setErrorMsg('Question text is required.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        await client.put(`/cbt/questions/${question.id}`, form);
      } else {
        await client.post('/cbt/questions', form);
      }
      onSaved();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save question.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '860px', maxHeight: '92vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.35rem', fontWeight: 900, color: 'var(--navy)' }}>
              {isEditing ? '✏️ Edit Question & Worked Solution' : '➕ Add Question to Bank'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Standardized Nigerian Examination Form (JAMB UTME, WAEC SSCE, NECO, Mocks)
            </span>
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '0.84rem', fontWeight: 700, marginBottom: '16px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Row 1: Exam Body & Subject */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
            <div>
              <label style={filterLabelStyle}>Examination *</label>
              <select
                value={form.examType}
                onChange={e => setForm({ ...form, examType: e.target.value })}
                style={selectStyle}
              >
                <option value="JAMB">JAMB UTME</option>
                <option value="WAEC">WAEC SSCE</option>
                <option value="NECO">NECO SSCE</option>
                <option value="INTERNAL">Academy Mock</option>
              </select>
            </div>

            <div>
              <label style={filterLabelStyle}>Subject *</label>
              <select
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                style={selectStyle}
              >
                {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label style={filterLabelStyle}>Difficulty *</label>
              <select
                value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value })}
                style={selectStyle}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          {/* Row 2: Topic & Origin */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
            <div>
              <label style={filterLabelStyle}>Syllabus Topic *</label>
              <input
                type="text"
                required
                placeholder="e.g. Algebra, Calculus, Mechanics..."
                value={form.topic}
                onChange={e => setForm({ ...form, topic: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={filterLabelStyle}>Question Origin *</label>
              <select
                value={form.origin}
                onChange={e => setForm({ ...form, origin: e.target.value })}
                style={selectStyle}
              >
                <option value="ORIGINAL_PRACTICE">Original Practice Question</option>
                <option value="PAST_QUESTION">Verified Past Question (WAEC/JAMB/NECO)</option>
                <option value="AI_GENERATED">AI Generated Practice Draft</option>
              </select>
            </div>

            {form.origin === 'PAST_QUESTION' && (
              <div>
                <label style={filterLabelStyle}>Verified Exam Year *</label>
                <input
                  type="number"
                  placeholder="e.g. 2022"
                  value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          {/* Optional Shared Passage Box */}
          <div>
            <label style={filterLabelStyle}>Reading Comprehension / Context Passage (Optional)</label>
            <textarea
              rows="3"
              placeholder="If this question belongs to a shared reading passage or case study, paste passage here..."
              value={form.passageText}
              onChange={e => setForm({ ...form, passageText: e.target.value })}
              style={{ ...inputStyle, fontFamily: 'inherit' }}
            />
          </div>

          {/* Question Text with Math Symbols Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={filterLabelStyle}>Question Text *</label>
              
              {/* Math symbols quick insertion */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {MATH_SYMBOLS.map(sym => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => handleInsertSymbol(sym)}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              rows="4"
              placeholder="Enter question text here... (Math expressions and LaTeX formatting supported)"
              value={form.questionText}
              onChange={e => setForm({ ...form, questionText: e.target.value })}
              style={{ ...inputStyle, fontFamily: 'inherit', fontWeight: 600 }}
            />
          </div>

          {/* Image / Diagram URL */}
          <div>
            <label style={filterLabelStyle}>Diagram, Chart, or Table Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/diagram.png"
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              style={inputStyle}
            />
            {form.imageUrl && (
              <div style={{ marginTop: '8px', padding: '8px', background: '#f8fafc', borderRadius: '8px', display: 'inline-block' }}>
                <img src={form.imageUrl} alt="Diagram preview" style={{ maxHeight: '120px', borderRadius: '6px' }} />
              </div>
            )}
          </div>

          {/* Answer Options Section */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                Answer Options & Correct Key
              </span>

              {/* Toggle 4 options (A-D) vs 5 options (A-E) */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleOptionCount(4)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: optionCount === 4 ? '#0f172a' : '#ffffff',
                    color: optionCount === 4 ? '#ffffff' : '#334155',
                    cursor: 'pointer'
                  }}
                >
                  A–D (4 Options)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleOptionCount(5)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: optionCount === 5 ? '#0f172a' : '#ffffff',
                    color: optionCount === 5 ? '#ffffff' : '#334155',
                    cursor: 'pointer'
                  }}
                >
                  A–E (5 Options)
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {form.options.map((opt, idx) => {
                const isCorrect = form.correctOption === opt.id;
                return (
                  <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label
                      title="Click radio to mark this as correct answer"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: isCorrect ? '#10b981' : '#e2e8f0',
                        color: isCorrect ? '#ffffff' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.15s'
                      }}
                    >
                      <input
                        type="radio"
                        name="correctAnswerKey"
                        checked={isCorrect}
                        onChange={() => setForm({ ...form, correctOption: opt.id })}
                        style={{ display: 'none' }}
                      />
                      {opt.id}
                    </label>

                    <input
                      type="text"
                      required
                      placeholder={`Text for Option ${opt.id}...`}
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...form.options];
                        updated[idx].text = e.target.value;
                        setForm({ ...form, options: updated });
                      }}
                      style={{
                        ...inputStyle,
                        borderColor: isCorrect ? '#10b981' : '#cbd5e1',
                        background: isCorrect ? '#f0fdf4' : '#ffffff'
                      }}
                    />

                    {isCorrect && (
                      <span style={{ fontSize: '0.76rem', color: '#16a34a', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        ✅ Correct Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Worked Solution & Explanation */}
          <div>
            <label style={filterLabelStyle}>Detailed Solution & Step-by-Step Explanation</label>
            <textarea
              rows="3"
              placeholder="Provide the complete mathematical derivation, grammatical rule, or scientific rationale..."
              value={form.explanation}
              onChange={e => setForm({ ...form, explanation: e.target.value })}
              style={{ ...inputStyle, fontFamily: 'inherit' }}
            />
          </div>

          {/* Status & Publication Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            <div>
              <label style={filterLabelStyle}>Publication Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value, isPublished: e.target.value === 'APPROVED' })}
                style={selectStyle}
              >
                <option value="APPROVED">Approved (Ready for Exams)</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="DRAFT">Draft</option>
                <option value="REJECTED">Rejected</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '22px' }}>
              <input
                type="checkbox"
                id="isPubCheck"
                checked={form.isPublished}
                onChange={e => setForm({ ...form, isPublished: e.target.checked })}
              />
              <label htmlFor="isPubCheck" style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                Publish Immediately to CBT Test Sessions
              </label>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={actionBtnStyle('#0f172a', '#ffffff')}>
              {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add to Question Bank'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SUB-COMPONENT 2: STUDENT SIMULATION / PREVIEW MODAL ──────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function QuestionPreviewModal({ question, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={examBadgeStyle(question.examType)}>{question.examType}</span>
            <strong style={{ color: '#0f172a' }}>{question.subject}</strong>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>• {question.topic}</span>
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {/* Student Test Engine Visual Screen */}
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
          
          {/* Passage if present */}
          {question.passageText && (
            <div style={{
              background: '#ffffff',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              marginBottom: '16px',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: '#334155'
            }}>
              <strong style={{ display: 'block', marginBottom: '6px', color: '#0f172a' }}>📖 Read the passage below:</strong>
              {question.passageText}
            </div>
          )}

          {/* Question Text */}
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.5, marginBottom: '16px' }}>
            {question.questionText}
          </h3>

          {/* Diagram if present */}
          {question.imageUrl && (
            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <img src={question.imageUrl} alt="Diagram" style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: '8px' }} />
            </div>
          )}

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {Array.isArray(question.options) && question.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isActualCorrect = question.correctOption === opt.id;

              let optBg = '#ffffff';
              let optBorder = '#cbd5e1';
              if (showExplanation) {
                if (isActualCorrect) {
                  optBg = '#f0fdf4';
                  optBorder = '#10b981';
                } else if (isSelected && !isActualCorrect) {
                  optBg = '#fef2f2';
                  optBorder = '#ef4444';
                }
              } else if (isSelected) {
                optBg = '#eff6ff';
                optBorder = '#3b82f6';
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: optBg,
                    border: `1.5px solid ${optBorder}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isSelected ? '#2563eb' : '#e2e8f0',
                    color: isSelected ? '#ffffff' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.85rem'
                  }}>
                    {opt.id}
                  </span>
                  <span style={{ fontSize: '0.92rem', color: '#1e293b', fontWeight: 600 }}>{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Explanation Reveal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              style={actionBtnStyle('#475569', '#ffffff')}
            >
              {showExplanation ? 'Hide Answer Key' : 'Reveal Solution & Answer Key'}
            </button>

            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Origin: <strong>{question.origin || 'PRACTICE'}</strong> {question.year ? `(${question.year})` : ''}
            </span>
          </div>

          {showExplanation && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '10px', background: '#fefce8', border: '1px solid #fef08a' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#854d0e', marginBottom: '6px' }}>
                💡 Correct Key: Option ({question.correctOption})
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#713f12', lineHeight: 1.5 }}>
                {question.explanation || 'No step-by-step worked solution provided for this question.'}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SUB-COMPONENT 3: BULK IMPORT MODAL ───────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function BulkImportModal({ onClose, onImportCompleted }) {
  const [fileText, setFileText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('CSV');
  const [importing, setImporting] = useState(false);
  const [resultSummary, setResultSummary] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const ext = file.name.split('.').pop().toUpperCase();
    setFileType(ext === 'JSON' ? 'JSON' : 'CSV');

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFileText(ev.target.result);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    window.open('http://localhost:5000/api/cbt/questions/import-template', '_blank');
  };

  const handleExecuteImport = async () => {
    if (!fileText.trim()) {
      setErrorMsg('Please select or paste a CSV or JSON file.');
      return;
    }

    setImporting(true);
    setErrorMsg('');
    try {
      const res = await client.post('/cbt/questions/import', {
        fileContent: fileText,
        fileName,
        fileType
      });
      setResultSummary(res.data.summary);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to process import.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.35rem', fontWeight: 900, color: 'var(--navy)' }}>
              📥 Bulk Question Importer (CSV & JSON)
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Safely import large question archives with automated validation & duplicate detection
            </span>
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '0.84rem', fontWeight: 700, marginBottom: '16px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Step 1: Template Download */}
        <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>Standardized Import Template</strong>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Includes columns for Examination, Subject, Topic, Options A-E, Correct Answer, Explanation & Year.</span>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            style={actionBtnStyle('#0f172a', '#ffffff')}
          >
            📥 Download Template (.CSV)
          </button>
        </div>

        {/* Step 2: Upload File */}
        {!resultSummary && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              background: '#ffffff',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                accept=".csv, .json, text/csv, application/json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="cbtFileInput"
              />
              <label htmlFor="cbtFileInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '2.5rem' }}>📄</span>
                <strong style={{ color: '#2563eb', fontSize: '0.95rem' }}>Click to select CSV or JSON file</strong>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Supports files with hundreds of questions in batches</span>
              </label>
              {fileName && (
                <div style={{ marginTop: '12px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  Selected: {fileName}
                </div>
              )}
            </div>

            {/* Direct Paste Fallback */}
            <div>
              <label style={filterLabelStyle}>Or paste raw CSV or JSON data directly:</label>
              <textarea
                rows="6"
                placeholder="Paste CSV rows here..."
                value={fileText}
                onChange={e => setFileText(e.target.value)}
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
              <button
                type="button"
                disabled={importing || !fileText.trim()}
                onClick={handleExecuteImport}
                style={actionBtnStyle('#16a34a', '#ffffff')}
              >
                {importing ? 'Validating & Importing...' : 'Validate & Import Questions'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result Summary Display */}
        {resultSummary && (
          <div>
            <div style={{ padding: '16px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 8px', color: '#166534', fontSize: '1.1rem' }}>🎉 Import Processing Complete</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #86efac' }}>
                  <strong style={{ display: 'block', fontSize: '1.4rem', color: '#15803d' }}>{resultSummary.acceptedCount}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Accepted as Drafts</span>
                </div>
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fde047' }}>
                  <strong style={{ display: 'block', fontSize: '1.4rem', color: '#a16207' }}>{resultSummary.duplicateCount}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Duplicates Skipped</span>
                </div>
                <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                  <strong style={{ display: 'block', fontSize: '1.4rem', color: '#b91c1c' }}>{resultSummary.failedCount}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Failed / Invalid Rows</span>
                </div>
              </div>
            </div>

            {/* Error logs */}
            {resultSummary.errors && resultSummary.errors.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#b91c1c', display: 'block', marginBottom: '6px' }}>
                  Row Validation & Duplicate Notice Log ({resultSummary.errors.length})
                </strong>
                <div style={{ maxHeight: '160px', overflowY: 'auto', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {resultSummary.errors.map((err, idx) => (
                    <div key={idx} style={{ color: err.isDuplicate ? '#d97706' : '#dc2626' }}>
                      <strong>Row {err.row || idx + 1}:</strong> {err.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={onImportCompleted} style={actionBtnStyle('#0f172a', '#ffffff')}>
                Finish & View Questions
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SUB-COMPONENT 4: AI QUESTION GENERATOR MODAL ─────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AiGeneratorModal({ subjects, onClose, onGenerated }) {
  const [examType, setExamType] = useState('JAMB');
  const [subject, setSubject] = useState(subjects[0]?.name || 'Mathematics');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [count, setCount] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMsg('');
    try {
      await client.post('/cbt/questions/ai-generate', {
        examType,
        subject,
        topic: topic.trim() || 'General Curriculum',
        difficulty,
        count: parseInt(count)
      });
      onGenerated();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'AI question generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.35rem', fontWeight: 900, color: 'var(--navy)' }}>
              🤖 AI Syllabus Question Generator
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Synthesizes new syllabus-aligned questions as Pending Review drafts
            </span>
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '0.84rem', fontWeight: 700, marginBottom: '16px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={filterLabelStyle}>Examination Target</label>
              <select value={examType} onChange={e => setExamType(e.target.value)} style={selectStyle}>
                <option value="JAMB">JAMB UTME</option>
                <option value="WAEC">WAEC SSCE</option>
                <option value="NECO">NECO SSCE</option>
                <option value="INTERNAL">Academy Mock</option>
              </select>
            </div>

            <div>
              <label style={filterLabelStyle}>Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} style={selectStyle}>
                {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={filterLabelStyle}>Topic or Curriculum Sub-section</label>
            <input
              type="text"
              placeholder="e.g. Quadratic Equations, Wave Motion, Organic Hydrocarbons..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={filterLabelStyle}>Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={selectStyle}>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label style={filterLabelStyle}>Number of Questions (1–10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={count}
                onChange={e => setCount(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569' }}>
            🛡️ <strong>Editorial Governance Rule:</strong> All AI-generated questions are automatically saved as <em>Pending Review</em> and will not appear in student tests until approved by a human educator.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={generating} style={actionBtnStyle('#dfa921', '#0a1628')}>
              {generating ? 'Synthesizing Questions...' : 'Generate Question Drafts'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SUB-COMPONENT 5: REVIEW / APPROVAL DECISION MODAL ────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ReviewDecisionModal({ question, onClose, onReviewed }) {
  const [decision, setDecision] = useState(question.status || 'APPROVED');
  const [notes, setNotes] = useState(question.reviewNotes || '');
  const [submitting, setSubmitting] = useState(false);

  const handleDecision = async () => {
    setSubmitting(true);
    try {
      const res = await client.post(`/cbt/questions/${question.id}/review`, {
        status: decision,
        reviewNotes: notes
      });
      onReviewed(res.data.question);
    } catch (err) {
      alert('Review failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '540px' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy)' }}>
          ⚖️ Formal Question Review & Audit Decision
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '16px' }}>
          Record your editorial verdict for ID: <code>{question.id.slice(0, 8)}</code>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={filterLabelStyle}>Editorial Decision</label>
            <select value={decision} onChange={e => setDecision(e.target.value)} style={selectStyle}>
              <option value="APPROVED">✅ Approve & Publish</option>
              <option value="PENDING_REVIEW">⏳ Needs Re-Check (Pending)</option>
              <option value="REJECTED">❌ Reject (Flawed/Inaccurate)</option>
              <option value="ARCHIVED">📦 Archive (Retire from Tests)</option>
            </select>
          </div>

          <div>
            <label style={filterLabelStyle}>Review Notes / Audit Remarks</label>
            <textarea
              rows="3"
              placeholder="Add verification notes, rationale for rejection, or syllabus alignment comments..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button type="button" disabled={submitting} onClick={handleDecision} style={actionBtnStyle('#0f172a', '#ffffff')}>
            {submitting ? 'Recording Decision...' : 'Save Review Decision'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SUB-COMPONENT 6: NEW SUBJECT MODAL ───────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function NewSubjectModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [icon, setIcon] = useState('📚');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/cbt/subjects', { name, code, icon });
      onCreated();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create subject.');
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '440px' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: '1.2rem', fontWeight: 800 }}>➕ Add New Subject</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={filterLabelStyle}>Subject Name *</label>
            <input required type="text" placeholder="e.g. Geography" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={filterLabelStyle}>Subject Code</label>
            <input type="text" placeholder="e.g. GEO" value={code} onChange={e => setCode(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={filterLabelStyle}>Icon Emoji</label>
            <input type="text" placeholder="🌍" value={icon} onChange={e => setIcon(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" style={actionBtnStyle('#0f172a', '#ffffff')}>Save Subject</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SUB-COMPONENT 7: NEW TOPIC MODAL ─────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function NewTopicModal({ subject, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [syllabusVersion, setSyllabusVersion] = useState('2024-2027');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post(`/cbt/subjects/${subject.id}/topics`, { name, syllabusVersion });
      onCreated();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add topic.');
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalCardStyle, maxWidth: '440px' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800 }}>
          ➕ Add Topic for {subject.name}
        </h3>
        <p style={{ margin: '0 0 14px', fontSize: '0.8rem', color: '#64748b' }}>Associate with official examination syllabus</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={filterLabelStyle}>Topic Name *</label>
            <input required type="text" placeholder="e.g. Integration, Photosynthesis..." value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={filterLabelStyle}>Syllabus Version</label>
            <input type="text" placeholder="2024-2027" value={syllabusVersion} onChange={e => setSyllabusVersion(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" style={actionBtnStyle('#0f172a', '#ffffff')}>Save Topic</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── HELPER STYLES & BADGES ───────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function StatBox({ label, value, icon, color, sub }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      padding: '18px 20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: '14px'
    }}>
      <div style={{
        width: '46px',
        height: '46px',
        borderRadius: '12px',
        background: `${color}14`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginTop: '4px' }}>{label}</div>
        {sub && <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{sub}</span>}
      </div>
    </div>
  );
}

const filterLabelStyle = {
  display: 'block',
  fontSize: '0.76rem',
  fontWeight: 800,
  color: '#475569',
  marginBottom: '5px',
  textTransform: 'uppercase'
};

const selectStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.84rem',
  outline: 'none',
  background: '#ffffff',
  color: '#0f172a'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.86rem',
  outline: 'none',
  background: '#ffffff',
  color: '#0f172a'
};

function actionBtnStyle(bg, text) {
  return {
    background: bg,
    color: text,
    border: 'none',
    padding: '9px 16px',
    borderRadius: '10px',
    fontSize: '0.84rem',
    fontWeight: 800,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  };
}

function bulkBtnStyle(bg, border = 'none') {
  return {
    background: bg,
    color: '#ffffff',
    border,
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.78rem',
    fontWeight: 800,
    cursor: 'pointer'
  };
}

function subTabBtnStyle(active) {
  return {
    background: 'none',
    border: 'none',
    padding: '10px 14px',
    fontSize: '0.92rem',
    fontWeight: active ? 800 : 600,
    color: active ? '#0f172a' : '#64748b',
    borderBottom: active ? '3px solid #dfa921' : '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s'
  };
}

function tableActionBtnStyle(bg, color) {
  return {
    background: bg,
    color,
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    fontSize: '0.88rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  };
}

function paginationBtnStyle(disabled) {
  return {
    background: disabled ? '#f1f5f9' : '#ffffff',
    color: disabled ? '#94a3b8' : '#0f172a',
    border: '1px solid #cbd5e1',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer'
  };
}

const cancelBtnStyle = {
  background: '#f1f5f9',
  color: '#334155',
  border: '1px solid #cbd5e1',
  padding: '9px 16px',
  borderRadius: '10px',
  fontSize: '0.84rem',
  fontWeight: 700,
  cursor: 'pointer'
};

const closeBtnStyle = {
  background: '#f1f5f9',
  border: 'none',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  fontWeight: 900,
  fontSize: '0.9rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(10, 22, 40, 0.65)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '20px'
};

const modalCardStyle = {
  background: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  width: '100%',
  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
  border: '1px solid #e2e8f0'
};

function examBadgeStyle(exam) {
  const map = {
    JAMB: { bg: '#dbeafe', color: '#1e40af' },
    WAEC: { bg: '#d1fae5', color: '#065f46' },
    NECO: { bg: '#fef3c7', color: '#92400e' },
    INTERNAL: { bg: '#ede9fe', color: '#5b21b6' }
  };
  const theme = map[exam] || { bg: '#f1f5f9', color: '#334155' };
  return {
    background: theme.bg,
    color: theme.color,
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 900,
    display: 'inline-block'
  };
}

function difficultyBadgeStyle(diff) {
  const map = {
    EASY: { bg: '#ecfdf5', color: '#047857' },
    MEDIUM: { bg: '#fffbeb', color: '#b45309' },
    HARD: { bg: '#fef2f2', color: '#b91c1c' }
  };
  const theme = map[diff] || { bg: '#f1f5f9', color: '#475569' };
  return {
    background: theme.bg,
    color: theme.color,
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 800
  };
}

function originBadgeStyle(origin) {
  const map = {
    PAST_QUESTION: { bg: '#fdf4ff', color: '#86198f' },
    ORIGINAL_PRACTICE: { bg: '#eff6ff', color: '#1d4ed8' },
    AI_GENERATED: { bg: '#fefce8', color: '#854d0e' }
  };
  const theme = map[origin] || { bg: '#f8fafc', color: '#475569' };
  return {
    background: theme.bg,
    color: theme.color,
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 700
  };
}

function statusBadgeStyle(status) {
  const map = {
    APPROVED: { bg: '#dcfce7', color: '#15803d' },
    PENDING_REVIEW: { bg: '#fef3c7', color: '#b45309' },
    DRAFT: { bg: '#f1f5f9', color: '#475569' },
    REJECTED: { bg: '#fee2e2', color: '#b91c1c' },
    ARCHIVED: { bg: '#e2e8f0', color: '#64748b' }
  };
  const theme = map[status] || { bg: '#f1f5f9', color: '#475569' };
  return {
    background: theme.bg,
    color: theme.color,
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.72rem',
    fontWeight: 800
  };
}
