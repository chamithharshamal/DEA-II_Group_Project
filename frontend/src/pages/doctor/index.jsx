import { useState, useEffect } from 'react';
import DoctorList      from './DoctorList';
import DoctorLogin     from './DoctorLogin';
import DoctorDashboard from './DoctorDashboard';

export default function DoctorRoutes() {
  // Determine user context based on tokens
  const [isDoctor, setIsDoctor] = useState(() => Boolean(localStorage.getItem('doctorToken')));
  const [isAdmin, setIsAdmin]   = useState(() => Boolean(localStorage.getItem('adminToken')));

  // Listen for changes across the app just in case
  useEffect(() => {
    setIsDoctor(Boolean(localStorage.getItem('doctorToken')));
    setIsAdmin(Boolean(localStorage.getItem('adminToken')));
  }, []);

  function handleDoctorLogin() {
    setIsDoctor(true);
  }

  function handleDoctorLogout() {
    setIsDoctor(false);
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

  // 3. Otherwise, show the Doctor Login Screen
  return (
    <DoctorLogin onSuccess={handleDoctorLogin} />
  );
}
