import { useState, useRef, useCallback } from 'react';

export function useVideoPlayer() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setPlaying(true); }
    else { video.pause(); setPlaying(false); }
  }, []);

  const onTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    setDuration(videoRef.current?.duration || 0);
  }, []);

  const seek = useCallback((percent) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = (percent / 100) * video.duration;
  }, []);

  const changeVolume = useCallback((val) => {
    if (videoRef.current) videoRef.current.volume = val;
    setVolume(val);
  }, []);

  return {
    videoRef,
    playing,
    progress,
    duration,
    volume,
    togglePlay,
    onTimeUpdate,
    onLoadedMetadata,
    seek,
    changeVolume
  };
}
