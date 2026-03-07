import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAppointments, getAllAppointments } from '../../services/appointmentService';

export default function AdminAppointmentView() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [filters, setFilters] = useState({ doctorId: '', patientId: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllAppointments();
            setAppointments(data);
        } catch (err) {
            setError('Failed to fetch appointments.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Only include filters that are not empty
            const params = {};
            if (filters.doctorId.trim()) params.doctorId = filters.doctorId.trim();
            if (filters.patientId.trim()) params.patientId = filters.patientId.trim();

            const data = await searchAppointments(params);
            setAppointments(data);
        } catch (err) {
            setError('Search failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFilters({ doctorId: '', patientId: '' });
        fetchAppointments();
    };

    return (
        <div className="admin-appointment-view">
            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Doctor ID</label>
                    <input
                        type="text"
                        className="admin-input"
                        style={{ width: '200px' }}
                        placeholder="Search by Doctor ID"
                        value={filters.doctorId}
                        onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Patient ID</label>
                    <input
                        type="text"
                        className="admin-input"
                        style={{ width: '200px' }}
                        placeholder="Search by Patient ID"
                        value={filters.patientId}
                        onChange={(e) => setFilters({ ...filters, patientId: e.target.value })}
                    />
                </div>
                <button className="btn-primary" onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : '🔍 Search'}
                </button>
                <button className="btn-secondary" onClick={handleClear} disabled={loading}>
                    ↺ Clear
                </button>
            </div>

            {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient ID</th>
                            <th>Doctor ID</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Reason</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <tr key={apt.id}>
                                    <td style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.id}</td>
                                    <td>{apt.patientId}</td>
                                    <td>{apt.doctorId}</td>
                                    <td>{new Date(apt.appointmentTime).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge badge-${apt.status?.toLowerCase()}`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td>{apt.reason}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn-link"
                                            onClick={() => navigate(`/app/appointments/${apt.id}`)}
                                        >
                                            View details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                    No appointments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
