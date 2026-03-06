import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LabDashboard from './LabDashboard';

// Simple PrivateRoute wrapper for lab module
const LabPrivateRoute = ({ children }) => {
  const role = localStorage.getItem('activeRole');
  return role ? children : <Navigate to="/login" replace />;
};

const LabRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/dashboard" 
        element={
          <LabPrivateRoute>
            <LabDashboard />
          </LabPrivateRoute>
        } 
      />
      
      {/* Default route redirect */}
      <Route path="/" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default LabRoutes;
