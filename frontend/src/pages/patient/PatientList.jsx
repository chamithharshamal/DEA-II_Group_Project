import { useState, useEffect, useCallback } from 'react';
import PatientForm from './PatientForm';
import ConfirmModal from '../../components/ConfirmModal';
import * as patientService from '../../services/patientService';

const GENDER_BADGE = { Male: 'info', Female: 'success', Other: 'warning' };

export default function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
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
        <div style={{ padding: '0px' }}>
            <div className="flex-between mb-4 mt-2">
                {/* Search */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search patients…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: '250px' }}
                    />
                    <div className="text-muted text-sm ml-2">
                        <b>{patients.length}</b> Patients ({patients.filter(p => p.gender === 'Female').length} Female | {patients.filter(p => p.gender === 'Male').length} Male)
                    </div>
                </div>
                
                <button className="btn btn-primary" onClick={() => setEditing('new')}>
                    + Add Patient
                </button>
            </div>

            {error && (
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    ⚠️ {error}
                    <button onClick={fetchPatients} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Retry</button>
                </div>
            )}

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    ⏳ Loading patients…
                </div>
            ) : (
                <div className="table-container mt-4">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                                <th>Patient ID</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>
                                        {error ? 'Could not load patients.' : 'No patients found.'}
                                    </td>
                                </tr>
                            ) : filtered.map((p, i) => (
                                <tr key={p.patientId || i}>
                                    <td className="text-muted text-xs">{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}</td>
                                    <td className="text-muted">{p.email}</td>
                                    <td className="text-muted">{p.phone}</td>
                                    <td style={{ fontWeight: 700, color: '#111827' }}>
                                        {typeof p.gender === 'string' ? p.gender.toUpperCase() : p.gender}
                                    </td>
                                    <td style={{ fontWeight: 700, color: '#111827' }}>{p.bloodGroup}</td>
                                    <td className="text-muted text-xs">{p.patientId}</td>
                                    <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button className="btn btn-sm btn-outline" title="Edit" onClick={() => setEditing(p)}>
                                            ✏️ Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" title="Delete" onClick={() => setDeleting(p.patientId)}>
                                            🗑️
                                        </button>
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
                <ConfirmModal
                    title="Delete Patient"
                    message="Are you sure you want to delete this patient? This action cannot be undone and will remove all associated records."
                    onConfirm={() => handleDelete(deleting)}
                    onCancel={() => setDeleting(null)}
                    confirmText="Delete Patient"
                />
            )}
        </div>
    );
}
