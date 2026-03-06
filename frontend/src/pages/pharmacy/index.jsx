import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PharmacyDashboard from './PharmacyDashboard';

export default function PharmacyRoutes() {
  // Authentication is already handled by the global PrivateRoute in App.jsx.
  // Both 'admin' and 'pharmacist' roles are permitted to access this module.
  
  return (
    <Routes>
      <Route path="/dashboard" element={<PharmacyDashboard />} />
      <Route path="/" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
