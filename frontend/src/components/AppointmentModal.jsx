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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Book Appointment
          </h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
            Scheduling a session with <strong style={{color: 'var(--text-primary)'}}>{doctor.name}</strong> ({doctor.specialization}).
          </p>

          {success ? (
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '24px', borderRadius: 12, textAlign: 'center', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              🎉 Appointment Confirmed!
              <div style={{fontSize: '0.85rem', fontWeight: 'normal', marginTop: '8px', color: 'var(--text-secondary)'}}>
                We will see you then. Closing...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: 16 }}>
                  ⚠️ {error}
                </div>
              )}
              
              <div className="form-group">
                <label>Patient ID *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={formData.patientId}
                  onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                  placeholder="Enter Patient ID (e.g. 1)"
                />
                <span className="text-muted" style={{fontSize: '0.75rem', marginTop: '4px'}}>New patients please register at the front desk first.</span>
              </div>

              <div className="form-group">
                <label>Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  value={formData.appointmentTime}
                  onChange={e => setFormData({ ...formData, appointmentTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Reason for Visit *</label>
                <textarea
                  required
                  className="form-control"
                  rows={3}
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Briefly describe symptoms..."
                />
              </div>

              <div className="modal-footer" style={{ padding: '20px 0 0 0', border: 'none' }}>
                <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {loading ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
