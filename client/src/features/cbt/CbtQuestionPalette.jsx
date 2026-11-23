import React from 'react';

export default function CbtQuestionPalette({
  questions,
  currentIndex,
  answers,
  flagged,
  onSelectIndex,
  onSubmitClick
}) {
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flagged.size;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="cbt-palette-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--navy)' }}>
          Question Matrix
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {answeredCount}/{questions.length} Answered
        </span>
      </div>

      {/* Grid of questions */}
      <div className="cbt-palette-grid">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = !!answers[q.id];
          const isFlagged = flagged.has(q.id);

          let pillClass = 'cbt-q-pill';
          if (isAnswered) pillClass += ' answered';
          if (isFlagged) pillClass += ' flagged';
          if (isCurrent) pillClass += ' current';

          return (
            <button
              key={q.id}
              onClick={() => onSelectIndex(idx)}
              className={pillClass}
              title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}${isFlagged ? ' (Marked for review)' : ''}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="cbt-legend">
        <div className="cbt-legend-item">
          <span className="cbt-dot cbt-dot-answered" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="cbt-legend-item">
          <span className="cbt-dot cbt-dot-unanswered" />
          <span>Unanswered ({unansweredCount})</span>
        </div>
        <div className="cbt-legend-item">
          <span className="cbt-dot cbt-dot-flagged" />
          <span>Marked for Review ({flaggedCount})</span>
        </div>
        <div className="cbt-legend-item">
          <span className="cbt-dot cbt-dot-current" />
          <span>Active Question</span>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: '24px' }}>
        <button
          onClick={onSubmitClick}
          className="cbt-btn cbt-btn-danger"
          style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
        >
          Finish & Submit Exam
        </button>
      </div>
    </div>
  );
}
