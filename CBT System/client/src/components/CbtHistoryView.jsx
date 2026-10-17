import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { goToDashboard } from '../utils/navigation';

export default function CbtHistoryView({ onBack }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/cbt/attempts/me')
      .then((res) => {
        setAttempts(res.data.attempts || []);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to fetch exam history. Please sign in.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <button onClick={onBack} className="cbt-btn cbt-btn-outline">
              ← Back to Exam Hall
            </button>
            <button onClick={goToDashboard} className="cbt-btn cbt-btn-gold">
              ← Go Back to Dashboard
            </button>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)' }}>
            My CBT Test History
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track your performance progress across JAMB, WAEC, NECO and internal mock sessions.
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading your test records...
        </div>
      )}

      {error && (
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          background: 'var(--red-dim)',
          color: 'var(--red)',
          fontWeight: 600,
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {!loading && !error && attempts.length === 0 && (
        <div style={{
          padding: '60px',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎯</div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '8px' }}>No CBT attempts recorded yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Take your first CBT practice test to start tracking scores, speed, and accuracy!
          </p>
          <button onClick={onBack} className="cbt-btn cbt-btn-gold">
            Start Practice Exam Now
          </button>
        </div>
      )}

      {!loading && attempts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {attempts.map((att) => {
            const dateStr = new Date(att.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            const minutes = Math.floor(att.timeSpentSeconds / 60);
            const seconds = att.timeSpentSeconds % 60;
            const isHigh = att.percentage >= 70;
            const isMid = att.percentage >= 50 && att.percentage < 70;

            return (
              <div
                key={att.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span className={`cbt-badge cbt-badge-${(att.examType || 'JAMB').toLowerCase()}`}>
                      {att.examType}
                    </span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>{att.subject}</strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Completed on {dateStr} • Duration: {minutes}m {seconds}s
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Questions</div>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--navy)' }}>
                      {att.score} / {att.totalQuestions}
                    </strong>
                  </div>

                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: isHigh ? 'var(--green-dim)' : isMid ? 'var(--gold-dim)' : 'var(--red-dim)',
                    color: isHigh ? 'var(--green)' : isMid ? 'var(--gold)' : 'var(--red)',
                    fontWeight: 800,
                    fontSize: '1.1rem'
                  }}>
                    {att.percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
