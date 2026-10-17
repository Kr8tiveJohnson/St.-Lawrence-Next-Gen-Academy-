import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { goToDashboard } from '../utils/navigation';

const DEFAULT_SUBJECTS = [
  { name: 'Mathematics', icon: '📐', desc: 'Algebra, Calculus, Geometry & General Math' },
  { name: 'English Language', icon: '📖', desc: 'Comprehension, Lexis, Structure & Oral' },
  { name: 'Physics', icon: '⚡', desc: 'Mechanics, Electricity, Waves & Optics' },
  { name: 'Chemistry', icon: '🧪', desc: 'Organic, Inorganic & Physical Chemistry' },
  { name: 'Biology', icon: '🧬', desc: 'Cell biology, Genetics, Ecology & Anatomy' },
  { name: 'Economics', icon: '📈', desc: 'Micro, Macro, Monetary & International Trade' },
  { name: 'Government', icon: '🏛️', desc: 'Political systems, Constitution & Public Admin' },
  { name: 'Literature in English', icon: '🎭', desc: 'Drama, Poetry, Prose & Literary terms' }
];

const EXAM_TYPES = [
  { id: 'JAMB', label: 'JAMB UTME', badge: 'Entrance Mock', icon: '🎯' },
  { id: 'WAEC', label: 'WAEC SSCE', badge: 'Senior Secondary', icon: '📝' },
  { id: 'NECO', label: 'NECO SSCE', badge: 'National Syllabus', icon: '📚' },
  { id: 'INTERNAL', label: 'Academy Mock', badge: 'St. Lawrence Internal', icon: '🏛️' }
];

export default function CbtWelcomePage({ candidate, onStartExam, onSwitchCandidate, onViewHistory }) {
  const { logout } = useAuth();

  const profile = candidate?.profile || {};
  const fullName = profile.fullName || 'Candidate';
  const surname = profile.surname || fullName.trim().split(/\s+/).slice(-1)[0];
  const targetClass = profile.targetClass || 'Senior Secondary (SS3)';
  const candidateId = candidate?.id ? `STU-${candidate.id.slice(0, 8).toUpperCase()}` : 'STU-VERIFIED';

  // Candidate enrolled subjects from dashboard (if any)
  const registeredSubjects = Array.isArray(profile.selectedSubjects) && profile.selectedSubjects.length > 0
    ? profile.selectedSubjects
    : ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology'];

  // Current exam config state
  const [selectedExamType, setSelectedExamType] = useState('JAMB');
  const [selectedSubject, setSelectedSubject] = useState(registeredSubjects[0] || 'Mathematics');
  const [questionCount, setQuestionCount] = useState(15);
  const [durationMinutes, setDurationMinutes] = useState(20);

  const handleLaunch = () => {
    onStartExam({
      examType: selectedExamType,
      subject: selectedSubject,
      questionCount: parseInt(questionCount, 10),
      durationMinutes: parseInt(durationMinutes, 10),
      candidateInfo: {
        fullName,
        surname,
        candidateId,
        avatarUrl: profile.avatarUrl,
        email: candidate?.email,
        targetClass
      }
    });
  };

  return (
    <div className="cbt-welcome-container">
      {/* ── Candidate Information Card (Synced with Dashboard) ── */}
      <div className="cbt-candidate-hero">
        <div className="cbt-candidate-grid">
          {/* Avatar */}
          <div>
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={fullName}
                className="cbt-candidate-avatar"
              />
            ) : (
              <div className="cbt-candidate-avatar">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="cbt-candidate-surname-badge">
                SURNAME: {surname.toUpperCase()}
              </span>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.74rem', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                ● Registered Student
              </span>
              <span style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                Reg: {candidateId}
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Welcome, {fullName}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div>
                <strong style={{ color: '#f4c243' }}>Target Class / Level:</strong> {targetClass}
              </div>
              <div>
                <strong style={{ color: '#f4c243' }}>Enrolled Email:</strong> {candidate?.email}
              </div>
              {profile.phone && (
                <div>
                  <strong style={{ color: '#f4c243' }}>Phone:</strong> {profile.phone}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={goToDashboard}
              style={{
                background: 'linear-gradient(135deg, #dfa921, #c89312)',
                color: '#0a1628',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(223, 169, 33, 0.4)',
                transition: 'transform 0.15s ease'
              }}
            >
              <span>←</span> Go Back to Dashboard
            </button>
            <button
              type="button"
              onClick={onViewHistory}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center'
              }}
            >
              <span>📊 Past Attempts</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                onSwitchCandidate();
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center'
              }}
            >
              <span>Switch Candidate</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Section: Select Exam Type ── */}
      <div className="cbt-subjects-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--navy)', margin: '0 0 4px' }}>
              Select Examination Category
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Choose the standard examination format for this practice drill.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
          {EXAM_TYPES.map((et) => {
            const isSelected = selectedExamType === et.id;
            return (
              <div
                key={et.id}
                onClick={() => setSelectedExamType(et.id)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid var(--gold)' : '1.5px solid var(--border)',
                  background: isSelected ? 'rgba(223, 169, 33, 0.08)' : 'var(--surface-2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{et.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--navy)' }}>{et.label}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{et.badge}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: Subjects to be Taken ── */}
      <div className="cbt-subjects-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--navy)', margin: 0 }}>
                Subjects To Be Taken
              </h2>
              <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                {registeredSubjects.length} Enrolled on Profile
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Select the subject you want to sit for in this session. Enrolled subjects are highlighted.
            </p>
          </div>
        </div>

        <div className="cbt-subjects-grid">
          {DEFAULT_SUBJECTS.map((sub) => {
            const isSelected = selectedSubject.toLowerCase() === sub.name.toLowerCase();
            const isEnrolled = registeredSubjects.some(
              (r) => r.toLowerCase().trim() === sub.name.toLowerCase().trim()
            );

            return (
              <div
                key={sub.name}
                className={`cbt-subject-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedSubject(sub.name)}
                style={{ position: 'relative' }}
              >
                <span style={{ fontSize: '1.4rem' }}>{sub.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{sub.name}</span>
                  </div>
                  {isEnrolled && (
                    <span style={{ color: '#059669', fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>
                      ✓ On Student Profile
                    </span>
                  )}
                </div>
                <div className="cbt-chip-indicator">
                  {isSelected ? '✓' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section: Examination Parameters & Launch ── */}
      <div className="cbt-subjects-section" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
              Number of Questions:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[10, 15, 20, 40].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    border: questionCount === count ? '2px solid var(--gold)' : '1.5px solid var(--border)',
                    background: questionCount === count ? 'var(--gold)' : 'var(--surface)',
                    color: questionCount === count ? '#000000' : 'var(--navy)'
                  }}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '8px' }}>
              Time Allocation:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    border: durationMinutes === mins ? '2px solid var(--gold)' : '1.5px solid var(--border)',
                    background: durationMinutes === mins ? 'var(--gold)' : 'var(--surface)',
                    color: durationMinutes === mins ? '#000000' : 'var(--navy)'
                  }}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Ready to begin <strong>{selectedExamType} — {selectedSubject}</strong>?
            </div>
            <button
              type="button"
              onClick={handleLaunch}
              className="cbt-btn-primary"
              style={{ padding: '14px 24px', fontSize: '1rem' }}
            >
              <span>Start Examination Hall</span>
              <span style={{ fontSize: '1.2rem' }}>🚀</span>
            </button>
          </div>
        </div>

        {/* Examination Instructions Bar */}
        <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🖥️</span>
            <span>Full-screen examination mode</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧮</span>
            <span>On-screen scientific calculator</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⏱️</span>
            <span>Auto-grading on timer expiry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
