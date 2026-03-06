// ─── Patient Module ──────────────────────────────────────────────────
// This module is now integrated into the main Staff Portal relying on global auth

import PatientList from './PatientList';

export default function PatientRoutes() {
  return (
    <div>
      <div className="page-header">
        <h1>Patient Management</h1>
        <p>View and manage patient records and information across the hospital.</p>
      </div>

      <div className="card">
        <PatientList />
      </div>
    </div>
  );
}
