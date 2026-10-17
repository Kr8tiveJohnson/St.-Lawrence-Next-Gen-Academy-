import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import CbtHomePage from './pages/CbtHomePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CbtHomePage />} />
          <Route path="/cbt" element={<CbtHomePage />} />
          <Route path="/exam" element={<CbtHomePage />} />
          <Route path="*" element={<CbtHomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
