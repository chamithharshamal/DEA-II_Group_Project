import { useState, useEffect, useCallback } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
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
      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px', marginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--off-white)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '2.5rem', background: 'var(--blue-lt)', padding: '12px', borderRadius: '16px' }}>🏢</div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Departments</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{depts.length}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--off-white)', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '2.5rem', background: 'var(--success-bg)', padding: '12px', borderRadius: '16px' }}>✅</div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Active</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{depts.length}</div>
          </div>
        </div>
      </div>

      <div className="flex-between mb-4 mt-2">
        {/* Search */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search departments…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '250px' }}
          />
        </div>
        
        <button className="btn btn-primary" onClick={openNew}>
          + Add Department
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          ⚠️ {error}
          <button onClick={fetchDepts} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          Loading departments…
        </div>
      ) : (
        <div className="table-container mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Department Name</th>
                <th>Description</th>
                <th>Department ID</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>
                    {error ? 'Could not load departments.' : 'No departments found.'}
                  </td>
                </tr>
              ) : filtered.map((d, i) => (
                <tr key={d.departmentId || i}>
                  <td className="text-muted text-xs">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{d.departmentName}</td>
                  <td className="text-muted">{d.description || '—'}</td>
                  <td className="text-muted text-xs">{d.departmentId}</td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm btn-outline" title="Edit" onClick={() => openEdit(d)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-sm btn-danger" title="Delete" onClick={() => setDeleting(d.departmentId)}>
                      🗑️
                    </button>
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
          <form onSubmit={handleSave} className="modal" style={{ maxWidth: 450 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modal === 'new' ? '+ Add Department' : '✏️ Edit Department'}</h2>
              <button type="button" className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Department Name *</label>
                <input
                  className="form-control" 
                  required
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
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : (modal === 'new' ? 'Create Department' : 'Save Changes')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm */}
      {deleting && (
        <ConfirmModal 
          title="Delete Department"
          message="Are you sure you want to delete this department? This might affect staff assignments and patient records associated with this unit."
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
          confirmText="Delete Department"
        />
      )}
    </>
  );
}
