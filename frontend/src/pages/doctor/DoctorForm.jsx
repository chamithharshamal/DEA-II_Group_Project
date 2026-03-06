import { useState } from 'react';
import { createPortal } from 'react-dom';

const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'General Practice', 'Dermatology', 'Psychiatry'
];

export default function DoctorForm({ doctor, onSave, onClose, saving }) {
  const isEdit = Boolean(doctor);

  const [form, setForm] = useState({
    doctorId:        doctor?.doctorId || '',
    firstName:       doctor?.firstName || '',
    lastName:        doctor?.lastName || '',
    email:           doctor?.email || '',
    phone:           doctor?.phone || '',
    address:         doctor?.address || '',
    specialization:  doctor?.specialization || 'General Practice',
    qualifications:  doctor?.qualifications || '',
    experienceYears: doctor?.experienceYears || 0,
    password:        '',
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!isEdit && !form.password.trim()) e.password = 'Password is required for new doctor';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      doctorId:        form.doctorId || undefined,
      firstName:       form.firstName,
      lastName:        form.lastName,
      email:           form.email,
      phone:           form.phone,
      address:         form.address,
      specialization:  form.specialization,
      qualifications:  form.qualifications,
      experienceYears: Number(form.experienceYears),
    };
    if (form.password.trim()) payload.password = form.password;

    onSave(payload);
  }

  function field(key, label, type = 'text', opts = {}) {
    return (
      <div className="form-group">
        <label>{label}</label>
        {opts.options ? (
          <select
            className="form-control"
            style={errors[key] ? { borderColor: 'var(--danger)' } : {}}
            value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          >
            {opts.options.map(o => <option key={o}>{o}</option>)}
          </select>
        ) : opts.multiline ? (
          <textarea
            className="form-control"
            rows={2}
            style={errors[key] ? { borderColor: 'var(--danger)' } : { resize: 'vertical' }}
            value={form[key]}
            placeholder={opts.placeholder}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          />
        ) : (
          <input
            className="form-control"
            style={errors[key] ? { borderColor: 'var(--danger)' } : {}}
            type={type}
            value={form[key]}
            placeholder={opts.placeholder}
            min={opts.min}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            autoComplete={opts.autoComplete}
          />
        )}
        {errors[key] && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{errors[key]}</span>}
      </div>
    );
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <form onSubmit={handleSubmit} className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Edit Doctor' : '+ Add Doctor'}</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="grid-2">
            {field('firstName', 'First Name', 'text', { placeholder: 'Jane' })}
            {field('lastName',  'Last Name',  'text', { placeholder: 'Smith' })}
          </div>

          <div className="grid-2">
            {field('email', 'Email Address', 'email', { placeholder: 'dr.smith@hospital.lk', autoComplete: 'off' })}
            {field('phone', 'Phone Number',  'tel',   { placeholder: '+94 77 123 4567' })}
          </div>

          <div className="grid-3">
            {field('specialization', 'Specialization', 'text', { options: SPECIALIZATIONS })}
            {field('experienceYears', 'Experience (Yrs)', 'number', { min: 0 })}
            {field('qualifications', 'Qualifications', 'text', { placeholder: 'e.g. MBBS, MD' })}
          </div>

          {field('address', 'Address', 'text', { multiline: true, placeholder: '123 Main Street, Colombo' })}

          {field('password',
            isEdit ? 'New Password (leave blank to keep)' : 'Password *',
            'password',
            { autoComplete: 'new-password', placeholder: '••••••••' }
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Doctor')}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
