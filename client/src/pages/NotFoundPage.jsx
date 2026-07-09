import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="flex-center flex-col" style={{ minHeight: '100vh', background: 'var(--navy-dark)', color: 'var(--white)', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: 'var(--gold)', fontSize: '5rem', marginBottom: '20px' }}>404</h1>
      <h2 style={{ color: 'var(--white)', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--gray-400)', marginBottom: '30px', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn btn-primary">Go Back Home</a>
    </div>
  );
}
