// ─── Admin List — connected to admin-service ──────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import AdminForm from './AdminForm';
import * as adminService from '../../services/adminService';

const STATUS_BADGE = { Active: 'badge-success', Inactive: 'badge-warning' };
const ROLE_BADGE   = { 'Super Admin': 'badge-danger', Admin: 'badge-info', Moderator: 'badge-warning' };

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
      {/* Error Banner */}
      {error && (
        <div style={{
          background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16, color: '#991b1b',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem',
        }}>
          ⚠️ {error}
          <button onClick={fetchAdmins} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="search-bar" style={{ width: 300 }}>
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search admins…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          + Add Admin
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3 mb-4">
        <span className="badge badge-info">{admins.length} Total</span>
        <span className="badge badge-success">{admins.filter(a => a.role !== 'Inactive').length} Active</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-muted)' }}>
          ⏳ Loading admins…
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
                <th>Admin ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 32 }}>
                  {error ? 'Could not load admins.' : 'No admins found.'}
                </td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.adminId || i}>
                  <td className="text-muted text-xs">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td className="text-muted">{a.email}</td>
                  <td><span className={`badge ${ROLE_BADGE[a.role] || 'badge-info'}`}>{a.role}</span></td>
                  <td className="text-muted text-xs">{a.adminId}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm btn-icon" title="Edit" onClick={() => setEditing(a)}>✏️</button>
                      <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDeleting(a.adminId)}>🗑️</button>
                    </div>
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
      {deleting && (
        <div className="modal-overlay" onClick={() => setDeleting(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Admin</h2>
              <button className="modal-close" onClick={() => setDeleting(null)}>×</button>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
              Are you sure you want to delete this admin? This action cannot be undone.
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
