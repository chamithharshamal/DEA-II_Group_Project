import { useState } from 'react';
import { createAppointment } from '../services/appointmentService';

export default function AppointmentModal({ doctor, onClose }) {
  const [formData, setFormData] = useState({
    patientId: '', 
    appointmentTime: '', // Changed to align with backend DTO
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const dto = {
      doctorId: doctor.doctorId,
      // Pass the patient ID as string/integer as requested. Guests must enter one.
      patientId: formData.patientId, 
      appointmentTime: formData.appointmentTime, // Aligning with backend model
      reason: formData.reason,
      status: 'SCHEDULED'
    };

    try {
      await createAppointment(dto);
      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Failed to book appointment. Please check your Patient ID and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 32, position: 'relative' }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'var(--off-white)', border: '1px solid var(--border)',
          width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', cursor: 'pointer', color: 'var(--text-secondary)'
        }}>✖</button>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: '8px' }}>
          📅 Book Appointment
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
          Scheduling a session with <strong style={{color: 'var(--text-primary)'}}>{doctor.name}</strong> ({doctor.specialization}).
        </p>

        {success ? (
          <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '20px', borderRadius: 8, textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            🎉 Appointment Confirmed!
            <div style={{fontSize: '0.85rem', fontWeight: 'normal', marginTop: '8px', color: 'var(--text-secondary)'}}>
              We will see you then.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)' }}>⚠️ {error}</div>}
            
            <div className="form-group">
              <label>Patient ID *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.patientId}
                onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                placeholder="Enter your Patient ID (e.g. 1)"
              />
              <span className="text-muted" style={{fontSize: '0.75rem', marginTop: '4px'}}>New patients please register at the front desk first.</span>
            </div>

            <div className="form-group">
              <label>Date & Time *</label>
              <input
                type="datetime-local"
                required
                className="input-field"
                value={formData.appointmentTime}
                onChange={e => setFormData({ ...formData, appointmentTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Reason for Visit *</label>
              <textarea
                required
                className="input-field"
                rows={3}
                value={formData.reason}
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Briefly describe your symptoms or reason for visit"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '14px', marginTop: 8, width: '100%', justifyContent: 'center', fontSize: '1rem' }}
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
