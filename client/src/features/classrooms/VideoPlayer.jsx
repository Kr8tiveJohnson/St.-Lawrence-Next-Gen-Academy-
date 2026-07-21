import { useRef, useState, useEffect } from 'react';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import client from '../../api/client';

export default function VideoPlayer({ lesson, courseId }) {
  const { videoRef, playing, progress, duration, volume, togglePlay, onTimeUpdate, onLoadedMetadata, seek, changeVolume } = useVideoPlayer();
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef(null);

  // Save progress every 10 seconds while playing
  useEffect(() => {
    if (playing && lesson?.id) {
      saveTimer.current = setInterval(() => {
        const currentTime = videoRef.current?.currentTime || 0;
        client.post(`/classrooms/progress`, {
          lessonId: lesson.id,
          watchedSeconds: Math.floor(currentTime)
        }).catch(() => {});
      }, 10000);
    }
    return () => clearInterval(saveTimer.current);
  }, [playing, lesson?.id]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!lesson) return (
    <div style={{ background: '#0a1628', borderRadius: '16px', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎬</div>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Select a lesson to begin watching</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Video Element */}
      <div style={{ position: 'relative', background: '#000', borderRadius: '16px', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src={lesson.playbackUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onClick={togglePlay}
          style={{ width: '100%', display: 'block', maxHeight: '480px', cursor: 'pointer' }}
        />
        {!playing && (
          <div onClick={togglePlay} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', cursor: 'pointer' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>▶</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ background: '#0a1628', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Seek Bar */}
        <input type="range" min="0" max="100" value={progress} onChange={e => seek(parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--gold)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>
              {playing ? '⏸' : '▶'}
            </button>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
              {formatTime((progress / 100) * duration)} / {formatTime(duration)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>🔊</span>
            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => changeVolume(parseFloat(e.target.value))}
              style={{ width: '80px', cursor: 'pointer', accentColor: 'var(--gold)' }} />
          </div>
        </div>
      </div>

      <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '1.05rem' }}>{lesson.title}</div>
    </div>
  );
}
