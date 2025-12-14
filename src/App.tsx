import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AdminPanel from './components/admin/AdminPanel';

/* -------- Private Route -------- */
type PrivateRouteProps = {
  children: React.ReactNode;
};

function PrivateRoute({ children }: PrivateRouteProps): React.ReactElement {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/* -------- App -------- */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
