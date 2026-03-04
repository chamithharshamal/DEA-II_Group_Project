import { useState, useEffect, useCallback } from 'react';
import DoctorForm from './DoctorForm';
import * as doctorService from '../../services/doctorService';

export default function DoctorList() {
  const [doctors,    setDoctors]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [editing,    setEditing]    = useState(null);   // null | 'new' | doctor obj
  const [deleting,   setDeleting]   = useState(null);   // doctor id
  const [saving,     setSaving]     = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDoctors = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (e) {
      setError(
        e.code === 'ERR_NETWORK'
          ? 'Cannot reach the doctor service. Make sure it is running on port 8084.'
          : (e.response?.data?.error || e.message)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  // ── Save (create / update) ─────────────────────────────────────────────────
  async function handleSave(formData) {
    setSaving(true);
    try {
      const dto = {
        firstName:       formData.firstName,
        lastName:        formData.lastName,
        email:           formData.email,
        password:        formData.password,
        phone:           formData.phone,
        address:         formData.address,
        specialization:  formData.specialization,
        qualifications:  formData.qualifications,
        experienceYears: Number(formData.experienceYears) || 0,
      };
      if (formData.doctorId) {
        await doctorService.updateDoctor(formData.doctorId, dto);
      } else {
        await doctorService.createDoctor(dto);
      }
      setEditing(null);
      await fetchDoctors();
    } catch (e) {
      alert('Error saving doctor: ' + (e.response?.data?.error || e.message));
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete(id) {
    try {
      await doctorService.deleteDoctor(id);
      setDeleting(null);
      await fetchDoctors();
    } catch (e) {
      alert('Error deleting doctor: ' + (e.response?.data?.error || e.message));
    }
  }

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = doctors.filter(d =>
    [d.firstName, d.lastName, d.email, d.specialization].some(field =>
      (field || '').toLowerCase().includes(search.toLowerCase())
    )
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ margin: 0 }}>Doctor Management</h1>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10,
          padding: '12px 16px', marginBottom: 16, color: '#991b1b',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem',
        }}>
          ⚠️ {error}
          <button onClick={fetchDoctors} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="search-bar" style={{ width: 300 }}>
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search doctors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          + Add Doctor
        </button>
      </div>

      {/* Summary */}
      <div className="flex gap-3 mb-4">
        <span className="badge badge-info">{doctors.length} Total Doctors</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-muted)' }}>
          ⏳ Loading doctors…
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 32 }}>
                  {error ? 'Could not load doctors.' : 'No doctors found.'}
                </td></tr>
              ) : filtered.map((d, i) => (
                <tr key={d.doctorId || i}>
                  <td className="text-muted text-xs">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>Dr. {d.firstName} {d.lastName}</td>
                  <td><span className="badge badge-warning">{d.specialization}</span></td>
                  <td className="text-muted">{d.email}</td>
                  <td className="text-muted">{d.phone}</td>
                  <td>{d.experienceYears} yrs</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm btn-icon" title="Edit" onClick={() => setEditing(d)}>✏️</button>
                      <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => setDeleting(d.doctorId)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Doctor Form Modal */}
      {editing && (
        <DoctorForm
          doctor={editing === 'new' ? null : editing}
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
              <h2>Delete Doctor</h2>
              <button className="modal-close" onClick={() => setDeleting(null)}>×</button>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
              Are you sure you want to delete this doctor? This action cannot be undone.
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
