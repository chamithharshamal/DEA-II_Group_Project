// ─── Patient Form Modal ───────────────────────────────────────────────────────
// Fields match backend PatientDTO: patientId, firstName, lastName, email, password,
// phone, address, dateOfBirth, gender, bloodGroup

import { useState } from 'react';

const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientForm({ patient, onSave, onClose, saving }) {
    const isEdit = Boolean(patient);

    const [form, setForm] = useState({
        patientId: patient?.patientId ?? '',
        firstName: patient?.firstName ?? '',
        lastName: patient?.lastName ?? '',
        email: patient?.email ?? '',
        phone: patient?.phone ?? '',
        address: patient?.address ?? '',
        dateOfBirth: patient?.dateOfBirth ?? '',
        gender: patient?.gender ?? 'Male',
        bloodGroup: patient?.bloodGroup ?? 'O+',
        password: '',
    });
    const [errors, setErrors] = useState({});

    function validate() {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'First name is required';
        if (!form.lastName.trim()) e.lastName = 'Last name is required';
        if (!form.email.includes('@')) e.email = 'Valid email required';
        if (!isEdit && !form.password.trim()) e.password = 'Password is required for new patient';
        if (!form.phone.trim()) e.phone = 'Phone number is required';
        return e;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        const payload = {
            patientId: form.patientId || undefined,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            dateOfBirth: form.dateOfBirth,
            gender: form.gender,
            bloodGroup: form.bloodGroup,
        };
        // Only send password if provided (blank on edit = keep existing)
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
                        style={errors[key] ? { borderColor: 'var(--color-danger)' } : {}}
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    >
                        {opts.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                ) : (
                    <input
                        className="form-control"
                        style={errors[key] ? { borderColor: 'var(--color-danger)' } : {}}
                        type={type}
                        value={form[key]}
                        placeholder={opts.placeholder}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        autoComplete={opts.autoComplete}
                    />
                )}
                {errors[key] && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}>{errors[key]}</span>}
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEdit ? '✏️ Edit Patient' : '+ Add Patient'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid-2">
                        {field('firstName', 'First Name', 'text', { placeholder: 'John' })}
                        {field('lastName', 'Last Name', 'text', { placeholder: 'Doe' })}
                    </div>

                    <div className="grid-2">
                        {field('email', 'Email Address', 'email', { placeholder: 'john@example.com', autoComplete: 'off' })}
                        {field('phone', 'Phone Number', 'tel', { placeholder: '+94 77 123 4567' })}
                    </div>

                    {field('address', 'Address', 'text', { placeholder: '123 Main Street, Colombo' })}

                    <div className="grid-3">
                        {field('dateOfBirth', 'Date of Birth', 'date')}
                        {field('gender', 'Gender', 'text', { options: GENDERS })}
                        {field('bloodGroup', 'Blood Group', 'text', { options: BLOOD_GROUPS })}
                    </div>

                    {field('password',
                        isEdit ? 'New Password (leave blank to keep)' : 'Password *',
                        'password',
                        { autoComplete: 'new-password', placeholder: '••••••••' }
                    )}

                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Patient')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
