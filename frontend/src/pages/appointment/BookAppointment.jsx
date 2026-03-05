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
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ marginBottom: '25px', textAlign: 'center', color: '#1a202c' }}>Book New Appointment</h2>

            {status.message && (
                <div style={{
                    padding: '12px',
                    marginBottom: '20px',
                    borderRadius: '4px',
                    backgroundColor: status.type === 'success' ? '#c6f6d5' : '#fed7d7',
                    color: status.type === 'success' ? '#22543d' : '#822727',
                    textAlign: 'center'
                }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568' }}>Patient ID</label>
                    <input
                        type="text"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        required
                        placeholder="Enter Patient UUID"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '16px' }}
                    />
                </div>

                <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568' }}>Doctor ID</label>
                    <input
                        type="text"
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                        placeholder="Enter Doctor UUID"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '16px' }}
                    />
                </div>

                <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568' }}>Appointment Time</label>
                    <input
                        type="datetime-local"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '16px' }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#4a5568' }}>Reason for Visit</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        placeholder="Describe the reason for the appointment"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '16px', minHeight: '120px' }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#357abd'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4a90e2'}
                >
                    Confirm Appointment
                </button>
            </form>
        </div>
    );
};

export default BookAppointment;
