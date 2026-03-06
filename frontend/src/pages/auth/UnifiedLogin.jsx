// ─── Unified Login Page ───────────────────────────────────────────────────────
// Routes: /login
// Lets every HMS user (Admin, Doctor, Patient, Pharmacist, Lab Tech, Staff)
// pick their role and sign in.  On success it stores `activeRole` in
// localStorage and navigates to the matching /app/* sub-tree.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Role definitions ──────────────────────────────────────────────────────────
const ROLES = [
  { key: 'admin',      label: 'Admin',       icon: '🛡️',  color: '#1a6fba', light: '#e2edf7',  path: '/app/admin'      },
  { key: 'doctor',     label: 'Doctor',      icon: '👨‍⚕️', color: '#0f766e', light: '#ccfbf1',  path: '/app/doctors'    },
  { key: 'patient',    label: 'Patient',     icon: '🏥',  color: '#7c3aed', light: '#ede9fe',  path: '/app/patients'   },
  { key: 'pharmacist', label: 'Pharmacist',  icon: '💊',  color: '#059669', light: '#d1fae5',  path: '/app/pharmacy'   },
  { key: 'lab',        label: 'Lab Tech',    icon: '🧪',  color: '#b45309', light: '#fef3c7',  path: '/app/lab-reports'},
  { key: 'staff',      label: 'Staff',       icon: '👤',  color: '#be185d', light: '#fce7f3',  path: '/app/staff'      },
];

// ── Per-role login logic ──────────────────────────────────────────────────────
async function performLogin(role, email, password) {
  // Dynamic imports keep bundle splitting clean and avoid circular deps.
  switch (role) {
    case 'admin': {
      const { loginAdmin } = await import('../../services/adminService');
      const data = await loginAdmin(email, password);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('token', data.token);       // shared key read by api.js
      localStorage.setItem('activeRole', 'admin');
      return;
    }
    case 'doctor': {
      const api = (await import('../../services/api')).default;
      const { data } = await api.post('/api/doctors/login', { email, password });
      localStorage.setItem('doctorToken', data.token);
      localStorage.setItem('token', data.token);       // shared key read by api.js
      localStorage.setItem('doctorId', data.id ?? data.doctorId ?? '');
      localStorage.setItem('activeRole', 'doctor');
      return;
    }
    case 'patient': {
      const api = (await import('../../services/api')).default;
      const { data } = await api.post('/api/patients/login', { email, password });
      localStorage.setItem('patientToken', data.token);
      localStorage.setItem('token', data.token);       // shared key read by api.js
      localStorage.setItem('patientId', data.id ?? data.patientId ?? '');
      localStorage.setItem('activeRole', 'patient');
      return;
    }
    case 'pharmacist': {
      const { default: pharmacyService } = await import('../../services/pharmacyService');
      const data = await pharmacyService.loginPharmacist({ email, password });
      localStorage.setItem('pharmacistToken', data.token);
      localStorage.setItem('token', data.token);       // shared key read by api.js
      localStorage.setItem('activeRole', 'pharmacist');
      return;
    }
    case 'lab': {
      const api = (await import('../../services/api')).default;
      const { data } = await api.post('/api/lab/login', { email, password });
      localStorage.setItem('labToken', data.token);
      localStorage.setItem('token', data.token);       // shared key read by api.js
      localStorage.setItem('activeRole', 'lab');
      return;
    }
    case 'staff': {
      const api = (await import('../../services/api')).default;
      const { data } = await api.post('/api/staff/login', { email, password });
      localStorage.setItem('staffToken', data.token);
      localStorage.setItem('token', data.token);       // shared key read by api.js
      localStorage.setItem('activeRole', 'staff');
      return;
    }
    default:
      throw new Error('Unknown role');
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function UnifiedLogin() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [form,  setForm]  = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy,  setBusy]  = useState(false);

  const role = ROLES.find(r => r.key === selectedRole);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await performLogin(selectedRole, form.email, form.password);
      navigate(role.path, { replace: true });
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach the server. Make sure the backend is running.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const accentColor = role?.color ?? '#1a6fba';
  const accentLight = role?.light ?? '#e2edf7';

  const s = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5e9 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    },
    card: {
      background: '#fff',
      borderRadius: 20,
      padding: '40px 44px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
      width: '100%',
      maxWidth: 460,
    },
    header: { textAlign: 'center', marginBottom: 28 },
    iconWrap: {
      width: 64, height: 64,
      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 14px', fontSize: 28,
      transition: 'background 0.3s',
    },
    title: { margin: 0, color: '#0f172a', fontSize: '1.6rem', fontWeight: 700 },
    subtitle: { margin: '6px 0 0', color: '#64748b', fontSize: '0.875rem' },
    rolesGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24,
    },
    roleBtn: (r) => ({
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 4, padding: '12px 8px',
      borderRadius: 12, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
      border: selectedRole === r.key ? `2px solid ${r.color}` : '2px solid #e2e8f0',
      background: selectedRole === r.key ? r.light : '#f8fafc',
      color: selectedRole === r.key ? r.color : '#475569',
      transition: 'all 0.18s',
    }),
    roleIcon: { fontSize: 22 },
    formGroup: { marginBottom: 16 },
    label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 6 },
    input: {
      width: '100%', boxSizing: 'border-box',
      padding: '11px 14px', borderRadius: 10,
      border: '1.5px solid #d1d5db', fontSize: '0.95rem',
      outline: 'none', transition: 'border-color 0.2s',
    },
    submitBtn: {
      width: '100%', padding: '13px', marginTop: 8,
      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
      color: '#fff', border: 'none', borderRadius: 10,
      fontSize: '1rem', fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer',
      opacity: busy ? 0.7 : 1, transition: 'all 0.2s',
    },
    errorBox: {
      background: '#fff0f0', border: '1.5px solid #fca5a5', borderRadius: 8,
      padding: '10px 14px', marginBottom: 16, color: '#991b1b', fontSize: '0.85rem',
    },
    backBtn: {
      background: 'none', border: 'none', color: '#64748b',
      fontSize: '0.85rem', cursor: 'pointer', marginTop: 14,
      display: 'block', textAlign: 'center', width: '100%',
    },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.iconWrap}>
            {role ? role.icon : '🏥'}
          </div>
          <h1 style={s.title}>
            {role ? `${role.label} Login` : 'HMS Portal'}
          </h1>
          <p style={s.subtitle}>
            {role ? `Sign in to access the ${role.label} dashboard` : 'Select your role to continue'}
          </p>
        </div>

        {/* Role selector */}
        {!selectedRole && (
          <div style={s.rolesGrid}>
            {ROLES.map(r => (
              <button
                key={r.key}
                style={s.roleBtn(r)}
                onClick={() => { setSelectedRole(r.key); setError(null); }}
              >
                <span style={s.roleIcon}>{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>
        )}

        {/* Login form — shown after role selection */}
        {selectedRole && (
          <>
            {error && <div style={s.errorBox}>⚠️ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={s.formGroup}>
                <label style={s.label}>Email</label>
                <input
                  style={s.input}
                  type="email" required
                  placeholder="user@hospital.lk"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="username"
                  autoFocus
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Password</label>
                <input
                  style={s.input}
                  type="password" required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" style={s.submitBtn} disabled={busy}>
                {busy ? 'Signing in…' : `Sign In as ${role.label} →`}
              </button>
            </form>

            <button style={s.backBtn} onClick={() => { setSelectedRole(null); setError(null); }}>
              ← Choose a different role
            </button>
          </>
        )}
      </div>
    </div>
  );
}
