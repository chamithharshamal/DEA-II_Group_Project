// ─── Department List — connected to admin-service ────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../../services/adminService';

const EMPTY_FORM = { departmentName: '', description: '' };

export default function DepartmentList() {
  const [depts,    setDepts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null);   // null | 'new' | dept obj
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [deleting, setDeleting] = useState(null);
  const [saving,   setSaving]   = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDepts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await adminService.getDepartments();
      setDepts(data);
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

  useEffect(() => { fetchDepts(); }, [fetchDepts]);

  function openNew()   { setForm(EMPTY_FORM); setModal('new'); }
  function openEdit(d) { setForm({ departmentName: d.departmentName, description: d.description || '' }); setModal(d); }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    if (!form.departmentName.trim()) return;
    setSaving(true);
    try {
      if (modal === 'new') {
        await adminService.createDepartment(form);
      } else {
        await adminService.updateDepartment(modal.departmentId, form);
      }
      setModal(null);
      await fetchDepts();
    } catch (err) {
      alert('Error saving department: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    try {
      await adminService.deleteDepartment(id);
      setDeleting(null);
      await fetchDepts();
    } catch (err) {
      alert('Error deleting department: ' + (err.response?.data?.error || err.message));
    }
  }

  const filtered = depts.filter(d =>
    (d.departmentName || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.description    || '').toLowerCase().includes(search.toLowerCase())
  );

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
          <button onClick={fetchDepts} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* Summary stat row */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="stat-card" style={{ flex: '1 1 140px', padding: '14px 18px', gap: 4 }}>
          <span className="stat-icon">🏢</span>
          <span className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--color-primary)' }}>{depts.length}</span>
          <span className="stat-label">Departments</span>
        </div>
        <div className="stat-card" style={{ flex: '1 1 140px', padding: '14px 18px', gap: 4 }}>
          <span className="stat-icon">✅</span>
          <span className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--color-success)' }}>
            {depts.length}
          </span>
          <span className="stat-label">Active</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="search-bar" style={{ width: 300 }}>
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search departments…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Add Department</button>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-muted)' }}>
          ⏳ Loading departments…
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Department ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 32 }}>
                  {error ? 'Could not load departments.' : 'No departments found.'}
                </td></tr>
              ) : filtered.map((d, i) => (
                <tr key={d.departmentId || i}>
                  <td className="text-muted text-xs">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{d.departmentName}</td>
                  <td className="text-muted">{d.description || '—'}</td>
                  <td className="text-muted text-xs">{d.departmentId}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(d)}>✏️</button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleting(d.departmentId)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal !== null && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'new' ? '+ Add Department' : '✏️ Edit Department'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Department Name *</label>
                <input
                  className="form-control" required
                  placeholder="e.g. Cardiology"
                  value={form.departmentName}
                  onChange={e => setForm(f => ({ ...f, departmentName: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Brief description of this department"
                  style={{ resize: 'vertical' }}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : (modal === 'new' ? 'Create' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <div className="modal-overlay" onClick={() => setDeleting(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Department</h2>
              <button className="modal-close" onClick={() => setDeleting(null)}>×</button>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
              Are you sure you want to delete this department? All associated data may be affected.
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
