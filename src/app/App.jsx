import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '@pages/AuthPage';
import { DashboardPage } from '@pages/DashboardPage';

export const App = () => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Simplified example

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" />}
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

