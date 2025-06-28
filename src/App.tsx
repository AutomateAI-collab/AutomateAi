import React , { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
  setTimeout(() => {
    console.clear(); // Optional: clear previous logs
    console.log('%c🧠 Welcome Curious Dev!', 'color:#fff; background:#111; font-size:20px; padding:8px 12px; border-radius:6px;');
    setTimeout(() => {
      console.log('%c🚀 Built by Vinu | theaitoautomate.com', 'color:#000; background:#FFC107; font-weight:bold; padding:4px 8px; border-radius:4px;');
    }, 500);
    setTimeout(() => {
      console.log('%c💡 Tips: Always inspect... you might find treasure.', 'color:#00BFFF; font-size:12px;');
    }, 1000);
  }, 1000);
}, []);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;