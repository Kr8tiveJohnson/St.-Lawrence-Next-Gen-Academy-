import React, { useState, useEffect } from 'react';

export default function TimeWeatherWidget() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    // Fetch weather
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const data = await res.json();
          if (data && data.current_weather) {
            setWeather(data.current_weather);
          }
        } catch (err) {
          console.error("Failed to fetch weather", err);
        }
      });
    }

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const formatLocationDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="time-weather-widget" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: 'rgba(255,255,255,0.1)',
      padding: '6px 16px',
      borderRadius: '20px',
      border: '1px solid rgba(0,0,0,0.05)',
      fontSize: '0.9rem',
      fontWeight: '600',
      color: 'var(--navy)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '1rem', fontWeight: 800 }}>{formatTime(time)}</span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-2)' }}>{formatLocationDate(time)}</span>
      </div>
      {weather && (
        <>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.2rem' }}>
              {weather.weathercode <= 3 ? '☀️' : weather.weathercode <= 60 ? '☁️' : '🌧️'}
            </span>
            <span>{Math.round(weather.temperature)}°C</span>
          </div>
        </>
      )}
    </div>
  );
}
