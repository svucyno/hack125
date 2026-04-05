import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VoiceAssistantProvider } from './contexts/VoiceAssistantContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading MEDI-CONNECT...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'patient' ? <PatientDashboard /> :
            user.role === 'doctor' ? <DoctorDashboard /> :
            user.role === 'admin' ? <AdminDashboard /> :
            <StaffDashboard />
          ) : <Navigate to="/login" />
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <VoiceAssistantProvider>
        <Router>
          <AppRoutes />
        </Router>
      </VoiceAssistantProvider>
    </AuthProvider>
  );
}

export default App;
