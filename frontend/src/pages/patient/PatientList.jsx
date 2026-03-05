// ─── Patient List — connected to patient-service ──────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import PatientForm from './PatientForm';
import * as patientService from '../../services/patientService';

const GENDER_BADGE = { Male: 'badge-info', Female: 'badge-success', Other: 'badge-warning' };

export default function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);   // null | 'new' | patient obj
    const [deleting, setDeleting] = useState(null);   // patient id
    const [saving, setSaving] = useState(false);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchPatients = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const data = await patientService.getPatients();
            setPatients(data);
        } catch (e) {
            setError(
                e.code === 'ERR_NETWORK'
                    ? 'Cannot reach the patient service. Make sure it is running on port 8087.'
                    : (e.response?.data?.error || e.message)
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPatients(); }, [fetchPatients]);

    // ── Save (create / update) ─────────────────────────────────────────────────
    async function handleSave(formData) {
        setSaving(true);
        try {
            const dto = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                bloodGroup: formData.bloodGroup,
            };
            if (formData.password) dto.password = formData.password;

            if (formData.patientId) {
                await patientService.updatePatient(formData.patientId, dto);
            } else {
                await patientService.createPatient(dto);
            }
            setEditing(null);
            await fetchPatients();
        } catch (e) {
            alert('Error saving patient: ' + (e.response?.data?.error || e.message));
        } finally {
            setSaving(false);
        }
    }

    // ── Delete ─────────────────────────────────────────────────────────────────
    async function handleDelete(id) {
        try {
            await patientService.deletePatient(id);
            setDeleting(null);
            await fetchPatients();
        } catch (e) {
            alert('Error deleting patient: ' + (e.response?.data?.error || e.message));
        }
    }

    // ── Filter ─────────────────────────────────────────────────────────────────
    const filtered = patients.filter(p =>
        (p.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.lastName || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.phone || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.bloodGroup || '').toLowerCase().includes(search.toLowerCase())
    );

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Error Banner */}
            {error && (
                <div style={{
                    background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10,
                    padding: '12px 16px', marginBottom: 16, color: '#991b1b',
                    display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem',
                }}>
                    ⚠️ {error}
                    <button onClick={fetchPatients} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
                <div className="search-bar" style={{ width: 300 }}>
                    <span className="search-icon">🔍</span>
                    <input
                        placeholder="Search patients…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => setEditing('new')}>
                    + Add Patient
                </button>
            </div>

            {/* Summary */}
            <div className="flex gap-3 mb-4">
                <span className="badge badge-info">{patients.length} Total</span>
                <span className="badge badge-success">
                    {patients.filter(p => p.gender === 'Male').length} Male
                </span>
                <span className="badge badge-warning">
                    {patients.filter(p => p.gender === 'Female').length} Female
                </span>
            </div>

            {/* Loading */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-muted)' }}>
                    ⏳ Loading patients…
                </div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                                <th>Date of Birth</th>
                                <th>Patient ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 32 }}>
                                    {error ? 'Could not load patients.' : 'No patients found.'}
                                </td></tr>
                            ) : filtered.map((p, i) => (
                                <tr key={p.patientId || i}>
                                    <td className="text-muted text-xs">{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</td>
                                    <td className="text-muted">{p.email}</td>
                                    <td className="text-muted">{p.phone}</td>
                                    <td><span className={`badge ${GENDER_BADGE[p.gender] || 'badge-info'}`}>{p.gender}</span></td>
                                    <td><span className="badge badge-danger">{p.bloodGroup}</span></td>
                                    <td className="text-muted text-xs">{p.dateOfBirth}</td>
                                    <td className="text-muted text-xs">{p.patientId}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-outline btn-sm btn-icon" title="Edit" onClick={() => setEditing(p)}>✏️</button>
                                            <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDeleting(p.patientId)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Patient Form Modal */}
            {editing && (
                <PatientForm
                    patient={editing === 'new' ? null : editing}
                    onSave={handleSave}
                    onClose={() => setEditing(null)}
                    saving={saving}
                />
            )}

            {/* Delete Confirm Modal */}
            {deleting && (
                <div className="modal-overlay" onClick={() => setDeleting(null)}>
                    <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Delete Patient</h2>
                            <button className="modal-close" onClick={() => setDeleting(null)}>×</button>
                        </div>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                            Are you sure you want to delete this patient? This action cannot be undone.
                        </p>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setDeleting(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleting)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
