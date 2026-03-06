import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAppointments, getAppointmentsByPatient, getAppointmentsByDoctor } from '../../services/appointmentService';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchType, setSearchType] = useState('patient');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllAppointments();
            setAppointments(data);
            setAllAppointments(data);
        } catch (err) {
            setError(err.code === 'ERR_NETWORK' ? 'Cannot reach the appointment service.' : 'Failed to fetch appointments.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) {
            setAppointments(allAppointments);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = searchType === 'patient'
                ? await getAppointmentsByPatient(searchId)
                : await getAppointmentsByDoctor(searchId);
            setAppointments(data);
        } catch (err) {
            setError('Failed to fetch appointments. Please check the ID.');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchId('');
        setAppointments(allAppointments);
        setError('');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#333' }}>Appointments</h2>

            <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="patient">Search by Patient ID</option>
                    <option value="doctor">Search by Doctor ID</option>
                </select>
                <input
                    type="text"
                    placeholder={`Enter ${searchType} ID`}
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                    type="submit"
                    style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Find
                </button>
                {searchId && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Clear
                    </button>
                )}
            </form>

            {loading && <p>Loading appointments...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && appointments.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Doctor ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Patient ID</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((app) => (
                            <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{app.id.substring(0, 8)}...</td>
                                <td style={{ padding: '12px' }}>{new Date(app.appointmentTime).toLocaleString()}</td>
                                <td style={{ padding: '12px' }}>{app.doctorId}</td>
                                <td style={{ padding: '12px' }}>{app.patientId}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.8em',
                                        backgroundColor: app.status === 'PLANNED' ? '#e3f2fd' : app.status === 'CANCELLED' ? '#fbe9e7' : '#e8f5e9',
                                        color: app.status === 'PLANNED' ? '#1976d2' : app.status === 'CANCELLED' ? '#d32f2f' : '#388e3c'
                                    }}>
                                        {app.status}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => navigate(`/appointments/${app.id}`)}
                                        style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && appointments.length === 0 && (
                <p>No appointments found.</p>
            )}
        </div>
    );
};

export default AppointmentList;
