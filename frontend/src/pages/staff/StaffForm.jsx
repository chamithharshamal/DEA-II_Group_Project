// ─── Staff Form Modal ─────────────────────────────────────────────────────────
// Fields match backend StaffDTO: staffId, firstName, lastName, email, password, role, department

import { useState } from 'react';
import { createPortal } from 'react-dom';

const ROLES = ['Doctor', 'Nurse', 'Receptionist', 'Admin', 'Pharmacist', 'Lab Technician', 'Staff'];
const DEPARTMENTS = ['Emergency', 'Cardiology', 'Pediatrics', 'Radiology', 'Pharmacy', 'Laboratory', 'General Medicine', 'Outpatient'];

export default function StaffForm({ staff, onSave, onClose, saving }) {
  const isEdit = Boolean(staff);

  const [form, setForm] = useState({
    staffId: staff?.staffId ?? '',
    firstName: staff?.firstName ?? '',
    lastName: staff?.lastName ?? '',
    email: staff?.email ?? '',
    role: staff?.role ?? 'Staff',
    department: staff?.department ?? 'General Medicine',
    password: '',
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!isEdit && !form.password.trim()) e.password = 'Password is required for new staff';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const payload = {
      staffId: form.staffId || undefined,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      role: form.role,
      department: form.department,
    };
    // Only send password if provided (blank on edit = keep existing)
    if (form.password.trim()) payload.password = form.password;

    onSave(payload);
  }

  function field(key, label, type = 'text', opts = {}) {
    return (
      <div className="form-group">
        <label>{label}</label>
        <input
          className="form-control"
          style={errors[key] ? { borderColor: 'var(--danger)' } : {}}
          type={type}
          value={form[key]}
          placeholder={opts.placeholder}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          autoComplete={opts.autoComplete}
        />
        {errors[key] && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors[key]}</span>}
      </div>
    );
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <form onSubmit={handleSubmit} className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Edit Staff' : '+ Add Staff'}</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="grid-2">
            {field('firstName', 'First Name', 'text', { placeholder: 'John' })}
            {field('lastName', 'Last Name', 'text', { placeholder: 'Doe' })}
          </div>

          <div className="grid-2">
            {field('email', 'Email Address', 'email', { placeholder: 'john@hospital.lk', autoComplete: 'off' })}
            <div className="form-group">
              <label>Role</label>
              <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select className="form-control" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {field('password',
            isEdit ? 'New Password (leave blank to keep)' : 'Password *',
            'password',
            { autoComplete: 'new-password', placeholder: '••••••••' }
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Staff')}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
