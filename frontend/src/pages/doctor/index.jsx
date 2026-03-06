import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorList      from './DoctorList';
import DoctorDashboard from './DoctorDashboard';

export default function DoctorRoutes() {
  const navigate = useNavigate();
  // Determine user context based on activeRole
  const role = localStorage.getItem('activeRole');
  const [isDoctor, setIsDoctor] = useState(role === 'doctor');
  const [isAdmin, setIsAdmin]   = useState(role === 'admin');

  // Listen for changes across the app just in case
  useEffect(() => {
    const currentRole = localStorage.getItem('activeRole');
    setIsDoctor(currentRole === 'doctor');
    setIsAdmin(currentRole === 'admin');
  }, []);

  function handleDoctorLogout() {
    localStorage.clear();
    navigate('/login');
  }

  // 1. If user is an Admin, they should see the Doctor Management interface (DoctorList)
  if (isAdmin) {
    return (
      <div>
        <div className="page-header">
          <h1>Doctor Management</h1>
          <p>Manage hospital doctors, their specialties, and credentials.</p>
        </div>
        <DoctorList />
      </div>
    );
  }

  // 2. If user is a Doctor, they should see the Doctor Dashboard
  if (isDoctor) {
    return (
      <DoctorDashboard onLogout={handleDoctorLogout} />
    );
  }

  // 3. Otherwise, return null because App.jsx PrivateRoute will handle redirect
  return null;
}
