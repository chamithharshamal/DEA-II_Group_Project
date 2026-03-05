import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LabLogin from './LabLogin';
import LabDashboard from './LabDashboard';

// Simple PrivateRoute wrapper for lab module
const LabPrivateRoute = ({ children }) => {
  const token = localStorage.getItem('labToken');
  return token ? children : <Navigate to="/lab/login" />;
};

const LabRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LabLogin />} />
      <Route 
        path="/dashboard" 
        element={
          <LabPrivateRoute>
            <LabDashboard />
          </LabPrivateRoute>
        } 
      />
      
      {/* Default route redirect */}
      <Route path="/" element={<Navigate to="/lab/dashboard" replace />} />
    </Routes>
  );
};

export default LabRoutes;
