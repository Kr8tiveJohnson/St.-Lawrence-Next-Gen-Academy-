/**
 * Helper to navigate back to the main Academy Student Dashboard
 * Passing the JWT token via URL hash allows seamless auto-login on port 5173.
 */
export function goToDashboard() {
  const token = localStorage.getItem('token');
  const targetUrl = token
    ? `http://localhost:5173/dashboard#token=${encodeURIComponent(token)}`
    : 'http://localhost:5173/dashboard';
  
  window.location.href = targetUrl;
}
