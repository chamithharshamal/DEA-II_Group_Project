// ─── Staff List ──────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import StaffForm from './StaffForm';
import * as staffService from '../../services/staffService';

const ROLE_BADGE = {
  'Doctor': 'danger',
  'Nurse': 'info',
  'Receptionist': 'warning',
  'Admin': 'primary',
  'Staff': 'info'
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
      <div className="flex-between mb-4 mt-2">
        {/* Search */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search staff…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '250px', padding: '10px 14px', marginBottom: 0 }}
          />
          <div className="text-muted text-sm ml-2">
            <b>{staff.length}</b> Staff Members ({staff.filter(s => s.role !== 'Inactive').length} Active)
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          + Add Staff
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          ⚠️ {error}
          <button onClick={fetchStaff} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          Loading staff…
        </div>
      ) : (
        <div className="table-container mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Staff ID</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>
                    {error ? 'Could not load staff.' : 'No staff members found.'}
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <tr key={s.staffId || i}>
                  <td className="text-muted text-xs">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</td>
                  <td className="text-muted">{s.email}</td>
                  <td>
                    <span className={`status ${ROLE_BADGE[s.role] || 'info'}`}>
                      {s.role}
                    </span>
                  </td>
                  <td>{s.department}</td>
                  <td className="text-muted text-xs">{s.staffId}</td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm btn-outline" title="Edit" onClick={() => setEditing(s)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-sm btn-danger" title="Delete" onClick={() => setDeleting(s.staffId)}>
                      🗑️
                    </button>
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
      {deleting && createPortal(
        <div className="modal-overlay" onClick={() => setDeleting(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Staff</h2>
              <button className="modal-close" onClick={() => setDeleting(null)}>×</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Are you sure you want to delete this staff member? This action cannot be undone.
            </p>
            <div className="modal-footer" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleting)}>Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
