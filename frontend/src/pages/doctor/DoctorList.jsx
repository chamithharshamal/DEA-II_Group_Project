import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
    <div className="card">
      <div className="flex-between mb-4 mt-2">
        {/* Search */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search doctors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '250px', padding: '10px 14px', marginBottom: 0 }}
          />
          <div className="text-muted text-sm ml-2">
            <b>{doctors.length}</b> Doctors Total
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={() => setEditing('new')}>
          + Add Doctor
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
          ⚠️ {error}
          <button onClick={fetchDoctors} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#1a6fba', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          Loading doctors…
        </div>
      ) : (
        <div className="table-container mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Experience</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>
                    {error ? 'Could not load doctors.' : 'No doctors found.'}
                  </td>
                </tr>
              ) : filtered.map((d, i) => (
                <tr key={d.doctorId || i}>
                  <td className="text-muted text-xs">{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>Dr. {d.firstName} {d.lastName}</td>
                  <td><span className="status warning">{d.specialization}</span></td>
                  <td className="text-muted">{d.email}</td>
                  <td className="text-muted">{d.phone}</td>
                  <td>{d.experienceYears} yrs</td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm btn-outline" title="Edit" onClick={() => setEditing(d)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-sm btn-danger" title="Delete" onClick={() => setDeleting(d.doctorId)}>
                      🗑️
                    </button>
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
      {deleting && createPortal(
        <div className="modal-overlay" onClick={() => setDeleting(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Doctor</h2>
              <button className="modal-close" onClick={() => setDeleting(null)}>×</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Are you sure you want to delete this doctor? This action cannot be undone.
            </p>
            <div className="modal-footer" style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleting)}>Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
