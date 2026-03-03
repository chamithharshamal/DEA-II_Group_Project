// ─── Staff List — connected to staff-service ──────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import StaffForm from './StaffForm';
import * as staffService from '../../services/staffService';

const ROLE_BADGE = {
                'Doctor': 'badge-danger',
                'Nurse': 'badge-info',
                'Receptionist': 'badge-warning',
                'Admin': 'badge-primary',
                'Staff': 'badge-info'
};

export default function StaffList() {
                const [staff, setStaff] = useState([]);
                const [loading, setLoading] = useState(true);
                const [error, setError] = useState(null);
                const [search, setSearch] = useState('');
                const [editing, setEditing] = useState(null);   // null | 'new' | staff obj
                const [deleting, setDeleting] = useState(null);   // staff id
                const [saving, setSaving] = useState(false);

                // ── Fetch ──────────────────────────────────────────────────────────────────
                const fetchStaff = useCallback(async () => {
                                setLoading(true); setError(null);
                                try {
                                                const data = await staffService.getStaff();
                                                setStaff(data);
                                } catch (e) {
                                                setError(
                                                                e.code === 'ERR_NETWORK'
                                                                                ? 'Cannot reach the staff service. Make sure it is running on port 8089.'
                                                                                : (e.response?.data?.error || e.message)
                                                );
                                } finally {
                                                setLoading(false);
                                }
                }, []);

                useEffect(() => { fetchStaff(); }, [fetchStaff]);

                // ── Save (create / update) ─────────────────────────────────────────────────
                async function handleSave(formData) {
                                setSaving(true);
                                try {
                                                if (formData.staffId) {
                                                                await staffService.updateStaff(formData.staffId, formData);
                                                } else {
                                                                await staffService.createStaff(formData);
                                                }
                                                setEditing(null);
                                                await fetchStaff();
                                } catch (e) {
                                                alert('Error saving staff: ' + (e.response?.data?.error || e.message));
                                } finally {
                                                setSaving(false);
                                }
                }

                // ── Delete ─────────────────────────────────────────────────────────────────
                async function handleDelete(id) {
                                try {
                                                await staffService.deleteStaff(id);
                                                setDeleting(null);
                                                await fetchStaff();
                                } catch (e) {
                                                alert('Error deleting staff: ' + (e.response?.data?.error || e.message));
                                }
                }

                // ── Filter ─────────────────────────────────────────────────────────────────
                const filtered = staff.filter(s =>
                                (s.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
                                (s.lastName || '').toLowerCase().includes(search.toLowerCase()) ||
                                (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
                                (s.role || '').toLowerCase().includes(search.toLowerCase()) ||
                                (s.department || '').toLowerCase().includes(search.toLowerCase())
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
                                                                                <button onClick={fetchStaff} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
                                                                </div>
                                                )}

                                                {/* Toolbar */}
                                                <div className="flex items-center justify-between mb-4">
                                                                <div className="search-bar" style={{ width: 300 }}>
                                                                                <span className="search-icon">🔍</span>
                                                                                <input
                                                                                                placeholder="Search staff…"
                                                                                                value={search}
                                                                                                onChange={e => setSearch(e.target.value)}
                                                                                />
                                                                </div>
                                                                <button className="btn btn-primary" onClick={() => setEditing('new')}>
                                                                                + Add Staff
                                                                </button>
                                                </div>

                                                {/* Summary */}
                                                <div className="flex gap-3 mb-4">
                                                                <span className="badge badge-info">{staff.length} Total</span>
                                                                <span className="badge badge-success">{staff.filter(s => s.role !== 'Inactive').length} Active</span>
                                                </div>

                                                {/* Loading */}
                                                {loading ? (
                                                                <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-muted)' }}>
                                                                                ⏳ Loading staff…
                                                                </div>
                                                ) : (
                                                                <div className="table-wrapper">
                                                                                <table>
                                                                                                <thead>
                                                                                                                <tr>
                                                                                                                                <th>#</th>
                                                                                                                                <th>Name</th>
                                                                                                                                <th>Email</th>
                                                                                                                                <th>Role</th>
                                                                                                                                <th>Department</th>
                                                                                                                                <th>Staff ID</th>
                                                                                                                                <th>Actions</th>
                                                                                                                </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                                {filtered.length === 0 ? (
                                                                                                                                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 32 }}>
                                                                                                                                                {error ? 'Could not load staff.' : 'No staff members found.'}
                                                                                                                                </td></tr>
                                                                                                                ) : filtered.map((s, i) => (
                                                                                                                                <tr key={s.staffId || i}>
                                                                                                                                                <td className="text-muted text-xs">{i + 1}</td>
                                                                                                                                                <td style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</td>
                                                                                                                                                <td className="text-muted">{s.email}</td>
                                                                                                                                                <td><span className={`badge ${ROLE_BADGE[s.role] || 'badge-info'}`}>{s.role}</span></td>
                                                                                                                                                <td>{s.department}</td>
                                                                                                                                                <td className="text-muted text-xs">{s.staffId}</td>
                                                                                                                                                <td>
                                                                                                                                                                <div className="flex gap-2">
                                                                                                                                                                                <button className="btn btn-outline btn-sm btn-icon" title="Edit" onClick={() => setEditing(s)}>✏️</button>
                                                                                                                                                                                <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDeleting(s.staffId)}>🗑️</button>
                                                                                                                                                                </div>
                                                                                                                                                </td>
                                                                                                                                </tr>
                                                                                                                ))}
                                                                                                </tbody>
                                                                                </table>
                                                                </div>
                                                )}

                                                {/* Staff Form Modal */}
                                                {editing && (
                                                                <StaffForm
                                                                                staff={editing === 'new' ? null : editing}
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
                                                                                                                <h2>Delete Staff</h2>
                                                                                                                <button className="modal-close" onClick={() => setDeleting(null)}>×</button>
                                                                                                </div>
                                                                                                <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                                                                                                                Are you sure you want to delete this staff member? This action cannot be undone.
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
