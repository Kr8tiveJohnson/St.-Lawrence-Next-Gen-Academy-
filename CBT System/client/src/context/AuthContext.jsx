import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract surname helper
  const getSurname = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    return parts[parts.length - 1]; // In Nigerian convention, often the last word (e.g. John in Moses John)
  };

  useEffect(() => {
    // Check if token was passed via URL hash (#token=...) or query (?token=...)
    const hashStr = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
    const hashParams = new URLSearchParams(hashStr);
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = hashParams.get('token') || searchParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');

    if (!token && !adminToken) {
      setLoading(false);
      return;
    }

    // Verify user with server
    client.get('/users/profile')
      .then((res) => {
        const userData = res.data.user || res.data;
        setUser(userData);
        if (userData && userData.profile) {
          const sName = getSurname(userData.profile.fullName);
          setCandidate({
            ...userData,
            profile: {
              ...userData.profile,
              surname: sName
            }
          });
        }
      })
      .catch(() => {
        if (adminToken) {
          const adminUser = { id: 'admin', role: 'ADMIN', username: 'Administrator' };
          setUser(adminUser);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Verify student candidate by surname
  const verifySurname = async (surname, email = '') => {
    const res = await client.post('/cbt/verify-candidate', { surname, email });
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setCandidate(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setUser(null);
    setCandidate(null);
  };

  const isTeacherOrAdmin = user && (user.role === 'TEACHER' || user.role === 'ADMIN' || user.role === 'MAIN_ADMIN' || user.id === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        candidate,
        setCandidate,
        loading,
        verifySurname,
        logout,
        isTeacherOrAdmin,
        getSurname
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
