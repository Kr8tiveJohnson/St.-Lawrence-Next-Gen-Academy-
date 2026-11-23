import React, { useState, useEffect, useRef, useCallback } from 'react';
import CbtQuestionPalette from './CbtQuestionPalette';
import CbtCalculator from './CbtCalculator';

export default function CbtExamHall({
  examMeta,
  questions,
  durationMinutes,
  onExamFinish,
  onExamExit
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' }
  const [flagged, setFlagged] = useState(new Set()); // Set of question IDs
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [submitting, setSubmitting] = useState(false);

  const timerRef = useRef(null);
  const totalSeconds = durationMinutes * 60;

  // Auto-submit when time expires
  const handleAutoSubmit = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    const timeSpent = totalSeconds - secondsRemaining;
    onExamFinish({ answers, timeSpentSeconds: timeSpent });
  }, [submitting, totalSeconds, secondsRemaining, answers, onExamFinish]);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [handleAutoSubmit]);

  const currentQ = questions[currentIndex] || {};

  // Option selection
  const handleSelectOption = (optId) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId
    }));
  };

  // Flag toggle
  const handleToggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if modal or calculator is focused on typing
      if (showSubmitModal || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (['a', 'b', 'c', 'd'].includes(key)) {
        handleSelectOption(key.toUpperCase());
      } else if (key === 'n' || e.key === 'ArrowRight') {
        if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
      } else if (key === 'p' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) setCurrentIndex((i) => i - 1);
      } else if (key === 'r' || key === 'f') {
        handleToggleFlag();
      } else if (key === 's' && e.ctrlKey) {
        e.preventDefault();
        setShowSubmitModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isTimeWarning = secondsRemaining <= 300; // Under 5 minutes

  const formatTimer = () => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleManualSubmit = () => {
    setSubmitting(true);
    const timeSpent = totalSeconds - secondsRemaining;
    onExamFinish({ answers, timeSpentSeconds: timeSpent });
  };

  // Font size multiplier
  const fontStyle = {
    fontSize: fontSize === 'xlarge' ? '1.35rem' : fontSize === 'large' ? '1.2rem' : '1.05rem'
  };

  return (
    <div>
      {/* Top Navigation & Clock */}
      <header className="cbt-topbar">
        <div className="cbt-brand">
          <div className="cbt-logo-badge">🏛️</div>
          <div className="cbt-brand-text">
            <h1>{examMeta.subject || 'Examination'}</h1>
            <span>{examMeta.examType || 'CBT'} Session • {questions.length} Questions</span>
          </div>
        </div>

        {/* Center Clock */}
        <div className={`cbt-timer-box ${isTimeWarning ? 'timer-warning' : ''}`}>
          <span>⏱️</span>
          <span>{formatTimer()}</span>
        </div>

        {/* Right Tools: Font Scaler, Calculator, Exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowCalculator((prev) => !prev)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: showCalculator ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Toggle On-Screen Calculator"
          >
            🧮 Calculator
          </button>

          {/* Font scaler */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={() => setFontSize('normal')}
              style={{
                padding: '4px 8px',
                color: fontSize === 'normal' ? 'var(--gold)' : '#fff',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              style={{
                padding: '4px 8px',
                color: fontSize === 'large' ? 'var(--gold)' : '#fff',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              A+
            </button>
          </div>

          <button
            onClick={onExamExit}
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '6px 10px',
              borderRadius: '6px'
            }}
          >
            Quit Exam
          </button>
        </div>
      </header>

      {/* Main Examination View */}
      <main className="cbt-exam-grid">
        {/* Left Column: Question Card & Controls */}
        <div className="cbt-question-card">
          {/* Question Metadata */}
          <div className="cbt-meta-bar">
            <div className="cbt-q-number">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className={`cbt-badge cbt-badge-${(examMeta.examType || 'JAMB').toLowerCase()}`}>
                {examMeta.examType}
              </span>
            </div>
            {currentQ.topic && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Topic: {currentQ.topic}
              </span>
            )}
          </div>

          {/* Question Text */}
          <div className="cbt-question-text" style={fontStyle}>
            {currentQ.questionText}
          </div>

          {/* Options */}
          <div className="cbt-options-list">
            {(currentQ.options || []).map((opt) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`cbt-option-item ${isSelected ? 'selected' : ''}`}
                >
                  <span className="cbt-option-letter">{opt.id}</span>
                  <span className="cbt-option-text" style={fontStyle}>{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Keyboard shortcut hint */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '16px' }}>
            Keyboard Shortcuts: Press <strong>A, B, C, D</strong> to select • <strong>N</strong> for Next • <strong>P</strong> for Previous • <strong>R</strong> to Flag
          </div>

          {/* Bottom Bar Controls */}
          <div className="cbt-bottom-bar">
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="cbt-btn cbt-btn-outline"
                style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIndex === questions.length - 1}
                className="cbt-btn cbt-btn-primary"
                style={{ opacity: currentIndex === questions.length - 1 ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleToggleFlag}
                className={`cbt-btn cbt-btn-flag ${flagged.has(currentQ.id) ? 'active' : ''}`}
              >
                ★ {flagged.has(currentQ.id) ? 'Flagged for Review' : 'Mark for Review'}
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="cbt-btn cbt-btn-gold"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div>
          <CbtQuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            flagged={flagged}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
            onSubmitClick={() => setShowSubmitModal(true)}
          />
        </div>
      </main>

      {/* On-Screen Calculator */}
      {showCalculator && (
        <CbtCalculator onClose={() => setShowCalculator(false)} />
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="cbt-modal-backdrop">
          <div className="cbt-modal-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px' }}>
              Submit Examination?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Please review your completion status before final submission:
            </p>

            {/* Status counts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--green-dim)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)' }}>Answered</span>
                <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--green)' }}>{Object.keys(answers).length}</strong>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--surface-2)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Unanswered</span>
                <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--text-muted)' }}>
                  {questions.length - Object.keys(answers).length}
                </strong>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--purple-dim)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--purple)' }}>Flagged</span>
                <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--purple)' }}>{flagged.size}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="cbt-btn cbt-btn-outline"
                disabled={submitting}
              >
                Continue Exam
              </button>
              <button
                onClick={handleManualSubmit}
                className="cbt-btn cbt-btn-danger"
                disabled={submitting}
              >
                {submitting ? 'Grading Exam...' : 'Yes, Submit Final Answers'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
