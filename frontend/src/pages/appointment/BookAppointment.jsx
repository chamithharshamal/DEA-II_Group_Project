import React, { useState } from 'react';
import { bookAppointment } from '../../services/appointmentService';

const BookAppointment = () => {
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentTime: '',
        reason: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        try {
            await bookAppointment(formData);
            setStatus({ type: 'success', message: 'Appointment successfully booked!' });
            setFormData({
                patientId: '',
                doctorId: '',
                appointmentTime: '',
                reason: '',
            });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to book appointment. Please verify Patient and Doctor IDs.';
            setStatus({ type: 'error', message: errorMsg });
        }
    };

    return (
        <div className="book-appointment-page">
            <div className="page-header">
                <h1>Book Appointment</h1>
                <p>Schedule a new consultation with our specialist doctors.</p>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Appointment Information</h2>

                {status.message && (
                    <div style={{
                        padding: '12px 16px',
                        marginBottom: '24px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: status.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
                        fontWeight: 500,
                        border: `1px solid ${status.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                    }}>
                        {status.type === 'success' ? '✅' : '⚠️'} {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Patient ID</label>
                        <input
                            type="text"
                            name="patientId"
                            className="input-field"
                            value={formData.patientId}
                            onChange={handleChange}
                            required
                            placeholder="e.g. p123-uuid"
                        />
                    </div>

                    <div className="form-group">
                        <label>Doctor ID</label>
                        <input
                            type="text"
                            name="doctorId"
                            className="input-field"
                            value={formData.doctorId}
                            onChange={handleChange}
                            required
                            placeholder="e.g. d456-uuid"
                        />
                    </div>

                    <div className="form-group">
                        <label>Appointment Time</label>
                        <input
                            type="datetime-local"
                            name="appointmentTime"
                            className="input-field"
                            value={formData.appointmentTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Reason for Visit</label>
                        <textarea
                            name="reason"
                            className="input-field"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            placeholder="Briefly describe the medical concern..."
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px', fontSize: '1.05rem' }}>
                            Confirm & Schedule Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
