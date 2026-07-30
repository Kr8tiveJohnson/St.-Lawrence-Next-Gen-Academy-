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
  
  // Legal pages management state
  const [activeLegalTab, setActiveLegalTab] = useState('terms'); // 'terms' | 'privacy'
  const [termsData, setTermsData] = useState({ lastUpdated: '', sections: [] });
  const [privacyData, setPrivacyData] = useState({ lastUpdated: '', sections: [] });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');

  useEffect(() => {
    Promise.all([
      client.get('/site-content/upcoming_exams').catch(() => ({ data: { value: [] } })),
      client.get('/site-content/trending_courses').catch(() => ({ data: { value: [] } })),
      client.get('/site-content/latest_achievement').catch(() => ({ data: { value: null } })),
      client.get('/site-content/terms_and_conditions').catch(() => ({ data: { value: { lastUpdated: '', sections: [] } } })),
      client.get('/site-content/privacy_policy').catch(() => ({ data: { value: { lastUpdated: '', sections: [] } } })),
    ]).then(([examsRes, coursesRes, achievementRes, termsRes, privacyRes]) => {
      setExams(examsRes.data.value || []);
      setCourses(coursesRes.data.value || []);
      if (achievementRes.data.value) setAchievement(achievementRes.data.value);
      setTermsData(termsRes.data.value || { lastUpdated: '', sections: [] });
      setPrivacyData(privacyRes.data.value || { lastUpdated: '', sections: [] });
      setLoading(false);
    }).catch(err => {
      console.error(err);
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
      {/* ─── LEGAL PAGES SETTINGS ────────────────────────────────────── */}
      <div style={sectionCard}>
        <h3 style={sectionTitle}>📜 Legal Pages Settings</h3>
        <p style={sectionSub}>Update the Terms &amp; Conditions and Privacy Policy pages</p>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveLegalTab('terms')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeLegalTab === 'terms' ? '#0f2144' : 'transparent',
              color: activeLegalTab === 'terms' ? '#fff' : '#64748b',
              transition: 'all 0.15s'
            }}
          >
            Terms &amp; Conditions
          </button>
          <button
            type="button"
            onClick={() => setActiveLegalTab('privacy')}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeLegalTab === 'privacy' ? '#0f2144' : 'transparent',
              color: activeLegalTab === 'privacy' ? '#fff' : '#64748b',
              transition: 'all 0.15s'
            }}
          >
            Privacy Policy
          </button>
        </div>

        {activeLegalTab === 'terms' ? (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Last Updated Date</label>
              <input
                placeholder="e.g. July 29, 2026"
                value={termsData.lastUpdated}
                onChange={e => setTermsData({ ...termsData, lastUpdated: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#0f2144', fontWeight: 700 }}>Sections</h4>
              {termsData.sections.map((sec, idx) => (
                <div key={idx} style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)' }}>Section {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = termsData.sections.filter((_, sIdx) => sIdx !== idx).map((s, i) => ({ ...s, id: i + 1 }));
                        setTermsData({ ...termsData, sections: updated });
                      }}
                      style={btnDanger}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    placeholder="Section Title"
                    value={sec.title}
                    onChange={e => {
                      const updated = [...termsData.sections];
                      updated[idx].title = e.target.value;
                      setTermsData({ ...termsData, sections: updated });
                    }}
                    style={{ ...inputStyle, marginBottom: '8px' }}
                  />
                  <textarea
                    placeholder="Section Content / Body text"
                    value={sec.body}
                    onChange={e => {
                      const updated = [...termsData.sections];
                      updated[idx].body = e.target.value;
                      setTermsData({ ...termsData, sections: updated });
                    }}
                    rows={4}
                    style={{ ...inputStyle, marginBottom: 0, resize: 'vertical' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const newId = termsData.sections.length + 1;
                    setTermsData({ ...termsData, sections: [...termsData.sections, { id: newId, title: '', body: '' }] });
                  }}
                  style={btnSecondary}
                >
                  + Add Section
                </button>
                <button
                  type="button"
                  onClick={() => saveContent('terms_and_conditions', termsData, 'Terms & Conditions')}
                  disabled={saving === 'terms_and_conditions'}
                  style={btnPrimary}
                >
                  {saving === 'terms_and_conditions' ? 'Saving...' : '💾 Save Terms & Conditions'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Last Updated Date</label>
              <input
                placeholder="e.g. July 29, 2026"
                value={privacyData.lastUpdated}
                onChange={e => setPrivacyData({ ...privacyData, lastUpdated: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#0f2144', fontWeight: 700 }}>Sections</h4>
              {privacyData.sections.map((sec, idx) => (
                <div key={idx} style={{ padding: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy)' }}>Section {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = privacyData.sections.filter((_, sIdx) => sIdx !== idx).map((s, i) => ({ ...s, id: i + 1 }));
                        setPrivacyData({ ...privacyData, sections: updated });
                      }}
                      style={btnDanger}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    placeholder="Section Title"
                    value={sec.title}
                    onChange={e => {
                      const updated = [...privacyData.sections];
                      updated[idx].title = e.target.value;
                      setPrivacyData({ ...privacyData, sections: updated });
                    }}
                    style={{ ...inputStyle, marginBottom: '8px' }}
                  />
                  <textarea
                    placeholder="Section Content / Body text"
                    value={sec.body}
                    onChange={e => {
                      const updated = [...privacyData.sections];
                      updated[idx].body = e.target.value;
                      setPrivacyData({ ...privacyData, sections: updated });
                    }}
                    rows={4}
                    style={{ ...inputStyle, marginBottom: 0, resize: 'vertical' }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const newId = privacyData.sections.length + 1;
                    setPrivacyData({ ...privacyData, sections: [...privacyData.sections, { id: newId, title: '', body: '' }] });
                  }}
                  style={btnSecondary}
                >
                  + Add Section
                </button>
                <button
                  type="button"
                  onClick={() => saveContent('privacy_policy', privacyData, 'Privacy Policy')}
                  disabled={saving === 'privacy_policy'}
                  style={btnPrimary}
                >
                  {saving === 'privacy_policy' ? 'Saving...' : '💾 Save Privacy Policy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
