import React, { useState, useEffect } from 'react';

export default function TimeWeatherWidget() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Update time every second to match "11:25:59" format
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Fetch weather
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // fetch current weather with windspeed
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`);
          const data = await res.json();
          if (data && data.current_weather) {
            let humidity = 72; // default
            if (data.hourly && data.hourly.relativehumidity_2m && data.hourly.relativehumidity_2m.length > 0) {
              humidity = data.hourly.relativehumidity_2m[0];
            }
            setWeather({ ...data.current_weather, humidity });
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
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const formatLocationDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Helper to map weathercode to text
  const getWeatherDesc = (code) => {
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 60) return 'Cloudy';
    return 'Rainy';
  };

  const getWeatherIcon = (code) => {
    if (code <= 3) return '⛅';
    if (code <= 60) return '☁️';
    return '🌧️';
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(16px)',
      borderRadius: '24px',
      padding: 'clamp(20px, 5vw, 32px)',
      color: 'white',
      boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(20px, 5vw, 28px)'
    }}>
      {/* Top Section: Time and Weather */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Time Area */}
        <div style={{ flex: '1 1 140px' }}>
          <div style={{ 
            fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', 
            fontWeight: '800', 
            color: 'var(--gold)', 
            lineHeight: '1.1',
            letterSpacing: '1px',
            fontFamily: 'monospace'
          }}>
            {formatTime(time)}
          </div>
          <div style={{ fontSize: '0.9rem', marginTop: '6px', color: 'rgba(255,255,255,0.7)' }}>
            {formatLocationDate(time)}
          </div>
        </div>

        {/* Weather Area */}
        <div style={{ textAlign: 'right', flex: '1 1 140px' }}>
          <div style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', lineHeight: '1.1', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', fontWeight: '800' }}>
            {weather ? Math.round(weather.temperature) : '28'}
            <span style={{ fontSize: '1.2rem', marginTop: '4px', marginLeft: '2px', color: 'rgba(255,255,255,0.7)' }}>°C</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginTop: '6px' }}>
            <span>{weather ? getWeatherIcon(weather.weathercode) : '⛅'}</span>
            <span>{weather ? getWeatherDesc(weather.weathercode) : 'Partly Cloudy'}</span>
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>💧</span> {weather ? weather.humidity : '72'}% Humidity
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🍃</span> {weather ? Math.round(weather.windspeed) : '14'} km/h Wind
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📍</span> Lagos, NG
        </div>
      </div>

      {/* Did You Know Section */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ background: 'rgba(223, 169, 33, 0.15)', color: 'var(--gold)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            💡 Did You Know?
          </span>
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0, color: 'rgba(255, 255, 255, 0.85)' }}>
          The average attention span for effective studying is <strong style={{ color: 'white' }}>25 minutes</strong>. Try using the Pomodoro technique for better retention!
        </p>
      </div>
    </div>
  );
}
