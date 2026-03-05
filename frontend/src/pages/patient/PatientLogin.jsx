// ─── Patient Login Page ───────────────────────────────────────────────────────
import { useState } from 'react';
import { loginPatient } from '../../services/patientService';

export default function PatientLogin({ onSuccess }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setBusy(true); setError(null);
        try {
            await loginPatient(form.email, form.password);
            onSuccess();
        } catch (err) {
            if (err.code === 'ERR_NETWORK') {
                setError('Cannot reach the patient service. Make sure it is running on port 8087.');
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
                boxShadow: '0 4px 32px rgba(26,111,186,0.10)', width: '100%', maxWidth: 420,
                border: '1px solid #e2edf7',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', fontSize: 24,
                    }}>🏥</div>
                    <h2 style={{ margin: 0, color: '#0f2d55', fontSize: '1.5rem', fontWeight: 700 }}>Patient Login</h2>
                    <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                        Sign in to access the patient portal
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
                            placeholder="patient@hospital.lk"
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
                        style={{ width: '100%', marginTop: 24, padding: '12px', fontSize: '1rem' }}
                    >
                        {busy ? 'Signing in…' : 'Sign In →'}
                    </button>
                </form>
            </div>
        </div>
    );
}
