import React, { useState } from 'react';

export default function CbtCalculator({ onClose }) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleDigit = (d) => {
    setDisplay((prev) => (prev === '0' || prev === 'Error' ? String(d) : prev + d));
  };

  const handleOp = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleSqrt = () => {
    try {
      const val = parseFloat(display);
      if (val < 0) {
        setDisplay('Error');
      } else {
        setDisplay(String(Math.sqrt(val)));
      }
    } catch {
      setDisplay('Error');
    }
  };

  const handleEqual = () => {
    try {
      const expr = equation + display;
      // Sanitize expression
      if (!/^[0-9+\-*/. ()]+$/.test(expr)) {
        setDisplay('Error');
        return;
      }
      // eslint-disable-next-line no-eval
      const res = Function(`'use strict'; return (${expr})`)();
      setDisplay(String(Number(res.toFixed(8))));
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '280px',
      background: '#101c44',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      border: '2px solid #dfa921',
      zIndex: 999,
      overflow: 'hidden',
      color: '#fff',
      fontFamily: 'monospace'
    }}>
      {/* Title bar */}
      <div style={{
        padding: '10px 14px',
        background: '#152554',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f4c243' }}>
          🧮 CBT Calculator
        </span>
        <button
          onClick={onClose}
          style={{
            color: '#fff',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '4px',
            width: '22px',
            height: '22px',
            cursor: 'pointer',
            fontWeight: 800
          }}
        >
          ×
        </button>
      </div>

      {/* Screen */}
      <div style={{ padding: '14px', background: '#091026', textAlign: 'right' }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', minHeight: '16px' }}>{equation}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', wordBreak: 'break-all' }}>{display}</div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px',
        padding: '12px',
        background: '#101c44'
      }}>
        <button onClick={handleClear} style={btnStyle('#ef4444')}>C</button>
        <button onClick={handleSqrt} style={btnStyle('#3b82f6')}>√</button>
        <button onClick={() => handleOp('/')} style={btnStyle('#dfa921')}>÷</button>
        <button onClick={() => handleOp('*')} style={btnStyle('#dfa921')}>×</button>

        <button onClick={() => handleDigit(7)} style={btnStyle()}>7</button>
        <button onClick={() => handleDigit(8)} style={btnStyle()}>8</button>
        <button onClick={() => handleDigit(9)} style={btnStyle()}>9</button>
        <button onClick={() => handleOp('-')} style={btnStyle('#dfa921')}>−</button>

        <button onClick={() => handleDigit(4)} style={btnStyle()}>4</button>
        <button onClick={() => handleDigit(5)} style={btnStyle()}>5</button>
        <button onClick={() => handleDigit(6)} style={btnStyle()}>6</button>
        <button onClick={() => handleOp('+')} style={btnStyle('#dfa921')}>+</button>

        <button onClick={() => handleDigit(1)} style={btnStyle()}>1</button>
        <button onClick={() => handleDigit(2)} style={btnStyle()}>2</button>
        <button onClick={() => handleDigit(3)} style={btnStyle()}>3</button>
        <button onClick={handleEqual} style={{ ...btnStyle('#10b981'), gridRow: 'span 2' }}>=</button>

        <button onClick={() => handleDigit(0)} style={{ ...btnStyle(), gridColumn: 'span 2' }}>0</button>
        <button onClick={() => handleDigit('.')} style={btnStyle()}>.</button>
      </div>
    </div>
  );
}

function btnStyle(bg = '#1e3370') {
  return {
    background: bg,
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 0',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  };
}
