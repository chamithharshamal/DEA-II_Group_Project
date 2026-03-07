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
        <div className="appointment-list-page">
            <div className="page-header">
                <h1>Appointment Management</h1>
                <p>View, search, and manage hospital appointments.</p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
                <div className="flex-between mb-4 mt-2">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            className="input-field"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                            style={{ width: '200px' }}
                        >
                            <option value="patient">Search by Patient ID</option>
                            <option value="doctor">Search by Doctor ID</option>
                        </select>
                        <input
                            type="text"
                            className="input-field"
                            placeholder={`Enter ${searchType} ID...`}
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            style={{ width: '300px' }}
                        />
                        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                            {loading ? 'Searching...' : '🔍 Find'}
                        </button>
                        {searchId && (
                            <button className="btn btn-secondary" onClick={clearSearch}>
                                ↺ Clear
                            </button>
                        )}
                    </div>

                    <button className="btn btn-primary" onClick={() => navigate('book')}>
                        + New Appointment
                    </button>
                </div>

                {error && (
                    <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        ⚠️ {error}
                    </div>
                )}

                <div className="table-container mt-4">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Time</th>
                                <th>Doctor ID</th>
                                <th>Patient ID</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                                        Loading appointments...
                                    </td>
                                </tr>
                            ) : appointments.length > 0 ? (
                                appointments.map((app) => (
                                    <tr key={app.id}>
                                        <td className="text-muted text-xs">{app.id.substring(0, 8)}...</td>
                                        <td style={{ fontWeight: 600 }}>{new Date(app.appointmentTime).toLocaleString()}</td>
                                        <td>{app.doctorId}</td>
                                        <td>{app.patientId}</td>
                                        <td>
                                            <span className={`status ${app.status === 'PLANNED' ? 'pending' :
                                                    app.status === 'CANCELLED' ? 'cancelled' : 'success'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => navigate(`${app.id}`)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                        No appointments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppointmentList;
