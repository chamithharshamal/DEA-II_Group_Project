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
        <div style={{ padding: '20px', maxWidth: '800px', margin: '20px auto', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer' }}>&larr; Back</button>

            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Appointment Details</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div>
                    <p><strong>Appointment ID:</strong></p>
                    <p>{appointment.id}</p>
                </div>
                <div>
                    <p><strong>Status:</strong></p>
                    <p>
                        <span style={{
                            padding: '4px 12px',
                            borderRadius: '16px',
                            backgroundColor: appointment.status === 'PLANNED' ? '#e3f2fd' : appointment.status === 'CANCELLED' ? '#fbe9e7' : '#e8f5e9',
                            color: appointment.status === 'PLANNED' ? '#1976d2' : appointment.status === 'CANCELLED' ? '#d32f2f' : '#388e3c'
                        }}>
                            {appointment.status}
                        </span>
                    </p>
                </div>
                <div>
                    <p><strong>Patient ID:</strong></p>
                    <p>{appointment.patientId}</p>
                </div>
                <div>
                    <p><strong>Doctor ID:</strong></p>
                    <p>{appointment.doctorId}</p>
                </div>
                <div>
                    <p><strong>Time:</strong></p>
                    <p>{new Date(appointment.appointmentTime).toLocaleString()}</p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <p><strong>Reason:</strong></p>
                    <p style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #007bff' }}>
                        {appointment.reason}
                    </p>
                </div>
            </div>

            {appointment.status === 'PLANNED' && (
                <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                    <button
                        onClick={handleComplete}
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Mark Completed
                    </button>
                    <button
                        onClick={handleCancel}
                        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancel Appointment
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentDetail;
