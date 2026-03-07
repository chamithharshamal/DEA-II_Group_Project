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
            <div className="flex-between mb-4 mt-2" style={{ gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Doctor ID</label>
                        <input
                            type="text"
                            className="input-field"
                            style={{ width: '200px' }}
                            placeholder="Doctor UUID..."
                            value={filters.doctorId}
                            onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Patient ID</label>
                        <input
                            type="text"
                            className="input-field"
                            style={{ width: '200px' }}
                            placeholder="Patient UUID..."
                            value={filters.patientId}
                            onChange={(e) => setFilters({ ...filters, patientId: e.target.value })}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                        {loading ? 'Searching...' : '🔍 Search'}
                    </button>
                    <button className="btn btn-secondary" onClick={handleClear} disabled={loading}>
                        ↺ Clear
                    </button>
                </div>
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
                            <th>Patient ID</th>
                            <th>Doctor ID</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Reason</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                                    Searching appointments...
                                </td>
                            </tr>
                        ) : appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <tr key={apt.id}>
                                    <td className="text-muted text-xs">{apt.id.substring(0, 8)}...</td>
                                    <td>{apt.patientId}</td>
                                    <td>{apt.doctorId}</td>
                                    <td style={{ fontWeight: 600 }}>{new Date(apt.appointmentTime).toLocaleString()}</td>
                                    <td>
                                        <span className={`status ${apt.status === 'PLANNED' ? 'pending' :
                                                apt.status === 'CANCELLED' ? 'cancelled' : 'success'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {apt.reason}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => navigate(`/app/appointments/${apt.id}`)}
                                        >
                                            View details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                                    No appointments found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
