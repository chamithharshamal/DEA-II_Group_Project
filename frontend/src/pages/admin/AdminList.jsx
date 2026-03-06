// ─── Admin List ──────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import AdminForm from './AdminForm';
import * as adminService from '../../services/adminService';

// Fallback status styles if 'status' class is used
const ROLE_BADGE = { 'Super Admin': 'danger', Admin: 'info', Moderator: 'warning' };

export default function AdminList() {
  const [admins,   setAdmins]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');
  const [editing,  setEditing]  = useState(null);   // null | 'new' | admin obj
  const [deleting, setDeleting] = useState(null);   // admin id
  const [saving,   setSaving]   = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAdmins = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (e) {
      setError(
        e.code === 'ERR_NETWORK'
          ? 'Cannot reach the admin service. Make sure it is running on port 8082.'
          : (e.response?.data?.error || e.message)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  // ── Save (create / update) ─────────────────────────────────────────────────
  async function handleSave(formData) {
    setSaving(true);
    try {
      const dto = {
        name:     formData.name,
        email:    formData.email,
        password: formData.password,
        role:     formData.role,
      };
      if (formData.adminId) {
        await adminService.updateAdmin(formData.adminId, dto);
      } else {
        await adminService.createAdmin(dto);
      }
      setEditing(null);
      await fetchAdmins();
    } catch (e) {
      alert('Error saving admin: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    try {
      await adminService.deleteAdmin(id);
      setDeleting(null);
      await fetchAdmins();
    } catch (e) {
      alert('Error deleting admin: ' + (e.response?.data?.error || e.message));
    }
  }

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = admins.filter(a =>
    (a.name  || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.role  || '').toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search admins…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '250px', padding: '10px 14px', marginBottom: 0 }}
          />
          <div className="text-muted text-sm ml-2">
            <b>{admins.length}</b> Admins ({admins.filter(a => a.role !== 'Inactive').length} Active)
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          + Add Admin
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          ⚠️ {error}
          <button onClick={fetchAdmins} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          Loading admins…
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
                <th>Admin ID</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>
                    {error ? 'Could not load admins.' : 'No admins found.'}
                  </td>
                </tr>
              ) : filtered.map((a, i) => (
                <tr key={a.adminId || i}>
                  <td className="text-muted text-xs">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td className="text-muted">{a.email}</td>
                  <td>
                    <span className={`status ${ROLE_BADGE[a.role] || 'info'}`}>
                      {a.role}
                    </span>
                  </td>
                  <td className="text-muted text-xs">{a.adminId}</td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm btn-outline" title="Edit" onClick={() => setEditing(a)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-sm btn-danger" title="Delete" onClick={() => setDeleting(a.adminId)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Form Modal */}
      {editing && (
        <AdminForm
          admin={editing === 'new' ? null : editing}
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
              <h2>Delete Admin</h2>
              <button className="modal-close" onClick={() => setDeleting(null)}>×</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Are you sure you want to delete this admin? This action cannot be undone.
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
