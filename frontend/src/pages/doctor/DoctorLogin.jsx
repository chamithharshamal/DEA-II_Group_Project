import { useState } from 'react';
import { loginDoctor } from '../../services/doctorService';

export default function DoctorLogin({ onSuccess }) {
  const [form,  setForm]  = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy,  setBusy]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await loginDoctor(form.email, form.password);
      onSuccess();
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach the doctor service. Make sure it is running on port 8084.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(err.response?.data?.error || err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 48px',
        boxShadow: '0 4px 32px rgba(46,196,182,0.10)', width: '100%', maxWidth: 420,
        border: '1px solid #e2f7f4',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'linear-gradient(135deg, #2ec4b6, #20b2aa)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 24,
          }}>🩺</div>
          <h2 style={{ margin: 0, color: '#0f5550', fontSize: '1.5rem', fontWeight: 700 }}>Doctor Portal</h2>
          <p style={{ margin: '6px 0 0', color: '#648b87', fontSize: '0.875rem' }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 8,
            padding: '10px 14px', marginBottom: 20, color: '#991b1b', fontSize: '0.85rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email" required
              placeholder="doctor@hospital.lk"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="username"
            />
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label>Password</label>
            <input
              className="form-control"
              type="password" required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy}
            style={{ width: '100%', marginTop: 24, padding: '12px', fontSize: '1rem', background: '#2ec4b6', border: 'none' }}
          >
            {busy ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
