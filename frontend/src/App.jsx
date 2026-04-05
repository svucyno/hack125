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

  if (loading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="pulse-animation flex h-12 w-12 mb-4"></div>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">MEDI-CONNECT Initialization...</p>
    </div>
  );

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      
      {/* Main Role-Based Redirect */}
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'patient' ? <Navigate to="/patient" /> :
            user.role === 'doctor' ? <Navigate to="/doctor" /> :
            user.role === 'admin' ? <Navigate to="/admin" /> :
            <Navigate to="/staff" />
          ) : <Navigate to="/login" />
        } 
      />

      {/* Explicit Protected Dashboard Routes */}
      <Route 
        path="/patient" 
        element={user && user.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/doctor" 
        element={user && user.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/admin" 
        element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/staff" 
        element={user && user.role === 'staff' ? <StaffDashboard /> : <Navigate to="/login" />} 
      />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <VoiceAssistantProvider>
          <AppRoutes />
        </VoiceAssistantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
