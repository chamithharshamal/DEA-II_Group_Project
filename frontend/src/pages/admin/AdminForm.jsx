// ─── Admin Form Modal ─────────────────────────────────────────────────────────
// Fields match backend AdminDTO: adminId, name, email, password, role

import { useState } from 'react';
import { createPortal } from 'react-dom';

const ROLES = ['Super Admin', 'Admin', 'Moderator'];

export default function AdminForm({ admin, onSave, onClose, saving }) {
  const isEdit = Boolean(admin);

  const [form, setForm] = useState({
    adminId:  admin?.adminId  ?? '',
    name:     admin?.name     ?? '',
    email:    admin?.email    ?? '',
    role:     admin?.role     ?? 'Admin',
    password: '',
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim())               e.name     = 'Name is required';
    if (!form.email.includes('@'))       e.email    = 'Valid email required';
    if (!isEdit && !form.password.trim()) e.password = 'Password is required for new admin';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      adminId:  form.adminId  || undefined,
      name:     form.name,
      email:    form.email,
      role:     form.role,
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
          style={errors[key] ? { borderColor: 'var(--color-danger)' } : {}}
          type={type}
          value={form[key]}
          placeholder={opts.placeholder}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          autoComplete={opts.autoComplete}
        />
        {errors[key] && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors[key]}</span>}
      </div>
    );
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Edit Admin' : '+ Add Admin'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            {field('name',  'Full Name',      'text',  { placeholder: 'John Doe' })}
            {field('email', 'Email Address',  'email', { placeholder: 'john@hospital.lk', autoComplete: 'off' })}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select className="form-control" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          {field('password',
            isEdit ? 'New Password (leave blank to keep)' : 'Password *',
            'password',
            { autoComplete: 'new-password', placeholder: '••••••••' }
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Admin')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
