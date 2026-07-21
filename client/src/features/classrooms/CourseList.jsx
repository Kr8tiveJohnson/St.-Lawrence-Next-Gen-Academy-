import { useEffect, useState } from 'react';
import client from '../../api/client';
import VideoPlayer from './VideoPlayer';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    client.get('/classrooms')
      .then(({ data }) => setCourses(data.courses || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading courses…</div>;

  if (courses.length === 0) return (
    <div style={{ padding: '64px', textAlign: 'center', background: 'var(--off-white)', borderRadius: '16px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📹</div>
      <h3 style={{ color: 'var(--navy)', marginBottom: '8px' }}>No Courses Yet</h3>
      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Courses uploaded by teachers will appear here.</p>
    </div>
  );

  if (selected) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
        <div>
          <button onClick={() => { setSelected(null); setActiveLesson(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Courses
          </button>
          <VideoPlayer lesson={activeLesson} courseId={selected.id} />
        </div>

        {/* Lesson List */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>
            📋 {selected.title}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(selected.lessons || []).map((lesson, i) => (
              <div key={lesson.id} onClick={() => setActiveLesson({ ...lesson, playbackUrl: lesson.playbackId })}
                style={{
                  padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                  background: activeLesson?.id === lesson.id ? 'rgba(10,22,40,0.05)' : 'white',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: activeLesson?.id === lesson.id ? 'var(--navy)' : 'var(--off-white)', color: activeLesson?.id === lesson.id ? 'var(--gold)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--navy)', fontWeight: activeLesson?.id === lesson.id ? 700 : 500, lineHeight: 1.4 }}>{lesson.title}</span>
              </div>
            ))}
            {(!selected.lessons || selected.lessons.length === 0) && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No lessons uploaded yet.</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {courses.map(course => (
        <div key={course.id} onClick={() => setSelected(course)}
          style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease' }}>
          <div style={{ height: '160px', background: 'linear-gradient(135deg, var(--navy), #1a3a6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            🎥
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>{course.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{course.subject} · {course.category}</div>
            {course.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.5 }}>{course.description}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: course.isPaid ? '#f59e0b' : '#16a34a', fontWeight: 700 }}>{course.isPaid ? '⭐ Premium' : '✅ Free'}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course._count?.lessons ?? 0} lessons</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
