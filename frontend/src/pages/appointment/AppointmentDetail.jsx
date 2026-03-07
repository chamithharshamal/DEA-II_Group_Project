import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointmentById, cancelAppointment, completeAppointment } from '../../services/appointmentService';

const AppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        setLoading(true);
        try {
            const data = await getAppointmentById(id);
            setAppointment(data);
        } catch (err) {
            setError('Failed to load appointment details.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            const updated = await cancelAppointment(id);
            setAppointment(updated);
        } catch (err) {
            alert('Error cancelling appointment.');
        }
    };

    const handleComplete = async () => {
        try {
            const updated = await completeAppointment(id);
            setAppointment(updated);
        } catch (err) {
            alert('Error marking appointment as completed.');
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading appointment details...</div>;
    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    if (!appointment) return <div style={{ padding: '20px' }}>Appointment not found.</div>;

    return (
        <div className="appointment-detail-page">
            <div className="page-header">
                <h1>Appointment Details</h1>
                <p>Detailed view and management for appointment {appointment.id.substring(0, 8)}...</p>
            </div>

            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="flex-between mb-4">
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        &larr; Back to List
                    </button>
                    <span className={`status ${appointment.status === 'PLANNED' ? 'pending' :
                            appointment.status === 'CANCELLED' ? 'cancelled' : 'success'
                        }`}>
                        {appointment.status}
                    </span>
                </div>

                <div className="grid-2" style={{ gap: '32px', marginTop: '24px' }}>
                    <div className="info-group">
                        <label>Appointment ID</label>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', wordBreak: 'break-all' }}>{appointment.id}</div>
                    </div>
                    <div className="info-group">
                        <label>Appointment Time</label>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{new Date(appointment.appointmentTime).toLocaleString()}</div>
                    </div>
                    <div className="info-group">
                        <label>Patient ID</label>
                        <div className="text-muted">{appointment.patientId}</div>
                    </div>
                    <div className="info-group">
                        <label>Doctor ID</label>
                        <div className="text-muted">{appointment.doctorId}</div>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Reason for Visit</label>
                        <div style={{
                            background: 'var(--off-white)',
                            padding: '20px',
                            borderRadius: 'var(--radius-md)',
                            borderLeft: '4px solid var(--primary-blue)',
                            fontSize: '1rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            {appointment.reason}
                        </div>
                    </div>
                </div>

                {appointment.status === 'PLANNED' && (
                    <div style={{ marginTop: '40px', display: 'flex', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                        <button className="btn btn-primary" onClick={handleComplete}>
                            Mark as Completed
                        </button>
                        <button className="btn btn-danger" onClick={handleCancel}>
                            Cancel Appointment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetail;
