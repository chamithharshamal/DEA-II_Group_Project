// ─── Patient Panel (Member 2) ──────────────────────────────────────────────────
// Shows a login gate first; after successful login the JWT is in localStorage
// and all subsequent API calls are authenticated.

import { useState } from 'react';
import PatientList from './PatientList';
import PatientLogin from './PatientLogin';
import { logoutPatient } from '../../services/patientService';

export default function PatientRoutes() {
  // Check if a token already exists so the user isn't asked to log in again after a page refresh
  const [loggedIn, setLoggedIn] = useState(() => Boolean(localStorage.getItem('patientToken')));

  function handleLogout() {
    logoutPatient();
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return <PatientLogin onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Patient Management</h1>
          <p>Manage patient records and information.</p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={handleLogout}
          style={{ marginTop: 4 }}
        >
          🔓 Logout
        </button>
      </div>

      <PatientList />
    </div>
  );
}
