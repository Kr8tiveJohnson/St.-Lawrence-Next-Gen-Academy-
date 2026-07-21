import { useState, useEffect } from 'react';
import client from '../../api/client';

const adminHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

const inputStyle = { display: 'block', width: '100%', marginBottom: '10px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box' };
const btnPrimary = { padding: '10px 20px', background: '#0f2144', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' };
const btnSecondary = { padding: '10px 16px', background: '#f1f5f9', color: '#0f2144', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 };
const btnDanger = { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' };

export default function HomepageSettings() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [achievement, setAchievement] = useState({ label: '🏆 Latest Achievement', headline: '', subtext: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');

  useEffect(() => {
    Promise.all([
      client.get('/site-content/upcoming_exams').catch(() => ({ data: { value: [] } })),
      client.get('/site-content/trending_courses').catch(() => ({ data: { value: [] } })),
      client.get('/site-content/latest_achievement').catch(() => ({ data: { value: null } })),
    ]).then(([examsRes, coursesRes, achievementRes]) => {
      setExams(examsRes.data.value || []);
      setCourses(coursesRes.data.value || []);
      if (achievementRes.data.value) setAchievement(achievementRes.data.value);
      setLoading(false);
    });
  }, []);

  const saveContent = async (key, value, label) => {
    setSaving(key);
    try {
      await client.put(`/site-content/${key}`, { value }, { headers: adminHeaders() });
      setSaving('');
      alert(`✅ ${label} saved!`);
    } catch (e) {
      alert('Failed to save. Check console.');
      console.error(e);
      setSaving('');
    }
  };

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚙️</div>
      Loading settings...
    </div>
  );

  const sectionCard = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '28px' };
  const sectionTitle = { color: '#0f2144', fontWeight: 800, fontSize: '1rem', marginBottom: '4px', marginTop: 0 };
  const sectionSub = { color: '#9ca3af', fontSize: '0.8rem', marginBottom: '20px', marginTop: '4px' };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#0f2144', fontWeight: 900, fontSize: '1.3rem' }}>Homepage Settings</h2>
        <p style={{ margin: '6px 0 0', color: '#9ca3af', fontSize: '0.85rem' }}>Control what appears in key sections of the public homepage</p>
      </div>

      {/* ─── LATEST ACHIEVEMENT ────────────────────────────────────── */}
      <div style={sectionCard}>
        <h3 style={sectionTitle}>🏆 Latest Achievement Banner</h3>
        <p style={sectionSub}>Shown as a highlight banner on the homepage — great for celebrating a recent student win</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Label / Badge Text</label>
            <input
              placeholder="e.g. 🏆 Latest Achievement"
              value={achievement.label}
              onChange={e => setAchievement({ ...achievement, label: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Headline</label>
            <input
              placeholder="e.g. Adaeze Okonkwo scored 9 A1s in WAEC 2024 🎉"
              value={achievement.headline}
              onChange={e => setAchievement({ ...achievement, headline: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Supporting Text</label>
          <textarea
            placeholder="e.g. Outstanding student performance continues to define the St. Lawrence standard."
            value={achievement.subtext}
            onChange={e => setAchievement({ ...achievement, subtext: e.target.value })}
            rows={2}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        {/* Live Preview */}
        {(achievement.headline || achievement.subtext) && (
          <div style={{ background: 'linear-gradient(135deg, #0f2144, #1a3a6b)', borderRadius: '10px', padding: '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flexShrink: 0, fontSize: '2rem' }}>🏆</div>
            <div>
              <div style={{ color: '#d4a853', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>{achievement.label}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '3px' }}>{achievement.headline}</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem' }}>{achievement.subtext}</div>
            </div>
          </div>
        )}
        <button onClick={() => saveContent('latest_achievement', achievement, 'Achievement banner')} disabled={saving === 'latest_achievement'} style={btnPrimary}>
          {saving === 'latest_achievement' ? 'Saving...' : '💾 Save Achievement Banner'}
        </button>
      </div>

      {/* ─── UPCOMING EXAMS ────────────────────────────────────────── */}
      <div style={sectionCard}>
        <h3 style={sectionTitle}>📅 Upcoming Exams</h3>
        <p style={sectionSub}>Displayed in the sidebar next to the News section</p>
        {exams.map((exam, i) => (
          <div key={i} style={{ marginBottom: '12px', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
              <input placeholder="Exam Name (e.g. WAEC SSCE)" value={exam.name} onChange={e => { const n=[...exams]; n[i].name=e.target.value; setExams(n); }} style={{ ...inputStyle, marginBottom: 0 }} />
              <input placeholder="Date (e.g. May 5, 2025)" value={exam.date} onChange={e => { const n=[...exams]; n[i].date=e.target.value; setExams(n); }} style={{ ...inputStyle, marginBottom: 0 }} />
              <input placeholder="Countdown (e.g. 115 days left)" value={exam.countdown} onChange={e => { const n=[...exams]; n[i].countdown=e.target.value; setExams(n); }} style={{ ...inputStyle, marginBottom: 0 }} />
              <button onClick={() => setExams(exams.filter((_,idx)=>idx!==i))} style={btnDanger}>✕</button>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setExams([...exams, { name:'', date:'', countdown:'' }])} style={btnSecondary}>+ Add Exam</button>
          <button onClick={() => saveContent('upcoming_exams', exams, 'Upcoming exams')} disabled={saving==='upcoming_exams'} style={btnPrimary}>
            {saving==='upcoming_exams' ? 'Saving...' : '💾 Save Exams'}
          </button>
        </div>
      </div>

      {/* ─── TRENDING COURSES ──────────────────────────────────────── */}
      <div style={sectionCard}>
        <h3 style={sectionTitle}>📈 Trending University Courses</h3>
        <p style={sectionSub}>Displayed in the sidebar next to the News section</p>
        {courses.map((course, i) => (
          <div key={i} style={{ marginBottom: '12px', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
              <input placeholder="Rank" value={course.rank} onChange={e => { const n=[...courses]; n[i].rank=e.target.value; setCourses(n); }} style={{ ...inputStyle, marginBottom: 0 }} />
              <input placeholder="Course Title (e.g. Medicine & Surgery)" value={course.title} onChange={e => { const n=[...courses]; n[i].title=e.target.value; setCourses(n); }} style={{ ...inputStyle, marginBottom: 0 }} />
              <input placeholder="Aspirants (e.g. 3,420 aspirants)" value={course.aspirants} onChange={e => { const n=[...courses]; n[i].aspirants=e.target.value; setCourses(n); }} style={{ ...inputStyle, marginBottom: 0 }} />
              <button onClick={() => setCourses(courses.filter((_,idx)=>idx!==i))} style={btnDanger}>✕</button>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setCourses([...courses, { rank:'', title:'', aspirants:'' }])} style={btnSecondary}>+ Add Course</button>
          <button onClick={() => saveContent('trending_courses', courses, 'Trending courses')} disabled={saving==='trending_courses'} style={btnPrimary}>
            {saving==='trending_courses' ? 'Saving...' : '💾 Save Courses'}
          </button>
        </div>
      </div>
    </div>
  );
}
