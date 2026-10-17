import React, { useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import CbtCandidateLogin from '../components/CbtCandidateLogin';
import CbtWelcomePage from '../components/CbtWelcomePage';
import CbtExamHall from '../components/CbtExamHall';
import CbtResultsModal from '../components/CbtResultsModal';
import CbtHistoryView from '../components/CbtHistoryView';
import QuestionBankManager from '../components/QuestionBankManager';
import { goToDashboard } from '../utils/navigation';

export default function CbtHomePage() {
  const { user, candidate, setCandidate, isTeacherOrAdmin, logout } = useAuth();

  // Navigation mode: 'home_login' | 'welcome' | 'active_exam' | 'results' | 'history' | 'bank'
  // If candidate is already verified/recognized, default to 'welcome'; otherwise 'home_login'
  const [view, setView] = useState(candidate ? 'welcome' : 'home_login');

  // Exam parameters
  const [selectedExam, setSelectedExam] = useState('JAMB');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [durationMinutes, setDurationMinutes] = useState(20);

  // Active exam state
  const [questions, setQuestions] = useState([]);
  const [loadingExam, setLoadingExam] = useState(false);
  const [examError, setExamError] = useState('');

  // Results state
  const [lastResult, setLastResult] = useState(null);

  // When candidate is verified on Home Page
  const handleCandidateVerified = (verifiedCandidate) => {
    setCandidate(verifiedCandidate);
    setView('welcome');
  };

  // Launch Exam from Welcome Page
  const handleStartExam = async ({ examType, subject, questionCount, durationMinutes: mins, candidateInfo }) => {
    setExamError('');
    setLoadingExam(true);
    setSelectedExam(examType);
    setSelectedSubject(subject);
    setDurationMinutes(mins);

    try {
      const res = await client.post('/cbt/exam/start', {
        examType,
        subject,
        questionCount,
        durationMinutes: mins
      });

      if (!res.data.questions || res.data.questions.length === 0) {
        alert('No questions found for this selection in the database. Please select another subject or seed questions.');
        setLoadingExam(false);
        return;
      }

      setQuestions(res.data.questions);
      setView('active_exam');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to start examination. Please check connection to server.');
    } finally {
      setLoadingExam(false);
    }
  };

  // Exam Finish / Submit
  const handleExamFinish = async ({ answers, timeSpentSeconds }) => {
    try {
      const res = await client.post('/cbt/exam/submit', {
        examType: selectedExam,
        subject: selectedSubject,
        timeSpentSeconds,
        answers
      });
      setLastResult(res.data);
      setView('results');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to grade submission.');
      setView('welcome');
    }
  };

  // View: Active Exam Hall
  if (view === 'active_exam') {
    const candidateName = candidate?.profile?.fullName || user?.profile?.fullName || 'Exam Candidate';
    return (
      <CbtExamHall
        examMeta={{
          examType: selectedExam,
          subject: selectedSubject,
          candidateName,
          candidateSurname: candidate?.profile?.surname
        }}
        questions={questions}
        durationMinutes={durationMinutes}
        onExamFinish={handleExamFinish}
        onExamExit={() => {
          if (window.confirm('Are you sure you want to quit this exam session? Current progress will be lost.')) {
            setView('welcome');
          }
        }}
      />
    );
  }

  // View: Past Exam Attempts
  if (view === 'history') {
    return <CbtHistoryView onBack={() => setView(candidate ? 'welcome' : 'home_login')} />;
  }

  // View: Teacher/Admin Question Bank Manager
  if (view === 'bank') {
    return <QuestionBankManager onBack={() => setView(candidate ? 'welcome' : 'home_login')} />;
  }

  const activeCandidate = candidate || user;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* ── Standard Academy CBT Topbar ── */}
      <header className="cbt-topbar">
        <div className="cbt-brand">
          <img
            src="/logo.png"
            alt="St. Lawrence Logo"
            className="cbt-topbar-logo"
            style={{
              height: '36px',
              width: 'auto',
              maxHeight: '36px',
              objectFit: 'contain',
              borderRadius: '6px'
            }}
          />
          <div className="cbt-brand-text">
            <h1>St. Lawrence Next Gen Academy</h1>
            <span>CBT Examination & Testing Centre</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {activeCandidate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '4px' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--gold)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.85rem'
              }}>
                {(activeCandidate.profile?.fullName || 'S').charAt(0).toUpperCase()}
              </div>
              <span className="cbt-topbar-username" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                {activeCandidate.profile?.fullName || 'Candidate'}
              </span>
            </div>
          )}

          {/* Only show History when candidate is signed in */}
          {activeCandidate && (
            <button
              onClick={() => setView('history')}
              style={{
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)'
              }}
            >
              📊 History
            </button>
          )}

          {isTeacherOrAdmin && (
            <button
              onClick={() => setView('bank')}
              style={{
                color: '#dfa921',
                fontSize: '0.82rem',
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #dfa921',
                background: 'rgba(223, 169, 33, 0.1)'
              }}
            >
              ⚙️ Question Bank
            </button>
          )}

          <button
            type="button"
            onClick={goToDashboard}
            style={{
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid var(--gold, #dfa921)',
              background: 'linear-gradient(135deg, rgba(223, 169, 33, 0.3), rgba(223, 169, 33, 0.12))',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <span>←</span> Go Back to Dashboard
          </button>

          {activeCandidate && (
            <button
              onClick={() => {
                logout();
                setView('home_login');
              }}
              style={{
                color: '#fca5a5',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.1)'
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* ── Main View Switcher ── */}
      {view === 'home_login' || !activeCandidate ? (
        /* View 1: Home Page (Candidate Sign In with Surname) */
        <CbtCandidateLogin
          onCandidateVerified={handleCandidateVerified}
          onGoToBank={() => setView('bank')}
        />
      ) : (
        /* View 2: Welcome Page (Candidate Info & Subjects to be Taken) */
        <CbtWelcomePage
          candidate={activeCandidate}
          onStartExam={handleStartExam}
          onSwitchCandidate={() => setView('home_login')}
          onViewHistory={() => setView('history')}
        />
      )}

      {/* Results Modal */}
      {view === 'results' && lastResult && (
        <CbtResultsModal
          result={lastResult}
          onClose={() => setView('welcome')}
          onRetake={() => setView('welcome')}
        />
      )}
    </div>
  );
}
