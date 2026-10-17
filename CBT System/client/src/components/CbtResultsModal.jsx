import React, { useState } from 'react';
import { goToDashboard } from '../utils/navigation';

export default function CbtResultsModal({ result, onRetake, onExit }) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'review'
  const [filterReview, setFilterReview] = useState('ALL'); // 'ALL' | 'WRONG' | 'CORRECT'

  const {
    score = 0,
    totalQuestions = 0,
    percentage = 0,
    timeSpentSeconds = 0,
    correctCount = 0,
    wrongCount = 0,
    unansweredCount = 0,
    review = [],
    subject = '',
    examType = ''
  } = result || {};

  const minutes = Math.floor(timeSpentSeconds / 60);
  const seconds = timeSpentSeconds % 60;

  // Grade badge determination
  let grade = 'Pass';
  let gradeColor = 'var(--green)';
  if (percentage >= 75) {
    grade = 'Excellent (Distinction)';
    gradeColor = 'var(--green)';
  } else if (percentage >= 50) {
    grade = 'Good Standing (Credit)';
    gradeColor = 'var(--gold)';
  } else {
    grade = 'Needs Improvement';
    gradeColor = 'var(--red)';
  }

  const filteredReview = review.filter((item) => {
    if (filterReview === 'CORRECT') return item.isCorrect;
    if (filterReview === 'WRONG') return !item.isCorrect;
    return true;
  });

  return (
    <div className="cbt-modal-backdrop">
      <div className="cbt-modal-card" style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: percentage >= 50 ? 'var(--green-dim)' : 'var(--red-dim)',
            color: percentage >= 50 ? 'var(--green)' : 'var(--red)',
            fontSize: '2rem',
            marginBottom: '12px'
          }}>
            {percentage >= 50 ? '🎉' : '📖'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)' }}>
            Exam Completed
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            {examType} • {subject} Practice Assessment
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('summary')}
            style={{
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === 'summary' ? 'var(--navy)' : 'var(--text-muted)',
              borderBottom: activeTab === 'summary' ? '3px solid var(--gold)' : '3px solid transparent'
            }}
          >
            Performance Overview
          </button>
          <button
            onClick={() => setActiveTab('review')}
            style={{
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: activeTab === 'review' ? 'var(--navy)' : 'var(--text-muted)',
              borderBottom: activeTab === 'review' ? '3px solid var(--gold)' : '3px solid transparent'
            }}
          >
            Question Review ({review.length})
          </button>
        </div>

        {activeTab === 'summary' ? (
          <div>
            {/* Score Banner */}
            <div style={{
              background: 'linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%)',
              color: '#ffffff',
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              marginBottom: '24px',
              border: '2px solid var(--gold)'
            }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-bright)' }}>
                Final Score
              </span>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3.4rem', fontWeight: 900, lineHeight: 1.1, margin: '8px 0' }}>
                {score} <span style={{ fontSize: '1.8rem', color: 'rgba(255,255,255,0.6)' }}>/ {totalQuestions}</span>
              </div>
              <div style={{
                display: 'inline-block',
                padding: '4px 16px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.12)',
                fontWeight: 700,
                fontSize: '1rem',
                color: gradeColor
              }}>
                {percentage}% — {grade}
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '28px'
            }}>
              <div style={metricBoxStyle('var(--green)')}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Correct</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--green)' }}>{correctCount}</strong>
              </div>
              <div style={metricBoxStyle('var(--red)')}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Wrong</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--red)' }}>{wrongCount}</strong>
              </div>
              <div style={metricBoxStyle('#94a3b8')}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Skipped</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>{unansweredCount}</strong>
              </div>
              <div style={metricBoxStyle('var(--blue)')}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Time Taken</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--navy)' }}>{minutes}m {seconds}s</strong>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['ALL', 'WRONG', 'CORRECT'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterReview(filter)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: filterReview === filter ? 'var(--navy)' : 'var(--surface-2)',
                    color: filterReview === filter ? '#fff' : 'var(--text-main)',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Review Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredReview.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-2)',
                    borderLeft: `5px solid ${item.isCorrect ? 'var(--green)' : 'var(--red)'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--navy)' }}>
                      Question #{i + 1} • {item.topic}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: item.isCorrect ? 'var(--green-dim)' : 'var(--red-dim)',
                      color: item.isCorrect ? 'var(--green)' : 'var(--red)'
                    }}>
                      {item.isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px' }}>
                    {item.questionText}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.82rem', padding: '6px 10px', background: '#fff', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <strong>Your Answer:</strong> {item.chosenOption ? item.chosenOption : 'None (Skipped)'}
                    </div>
                    <div style={{ fontSize: '0.82rem', padding: '6px 10px', background: '#fff', borderRadius: '6px', border: '1px solid var(--green)' }}>
                      <strong style={{ color: 'var(--green)' }}>Correct Answer:</strong> {item.correctOption}
                    </div>
                  </div>

                  {item.explanation && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(223, 169, 33, 0.1)',
                      border: '1px solid var(--gold)',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)'
                    }}>
                      <strong>💡 Solution & Explanation:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={goToDashboard}
            className="cbt-btn"
            style={{
              background: 'linear-gradient(135deg, #dfa921, #c89312)',
              color: '#0a1628',
              fontWeight: 800,
              fontSize: '0.84rem'
            }}
          >
            ← Go Back to Dashboard
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onExit} className="cbt-btn cbt-btn-outline">
              Return to Exam Hall
            </button>
            <button onClick={onRetake} className="cbt-btn cbt-btn-gold">
              Retake Exam
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function metricBoxStyle(accentColor) {
  return {
    background: 'var(--surface-2)',
    padding: '14px',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    borderTop: `3px solid ${accentColor}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };
}
