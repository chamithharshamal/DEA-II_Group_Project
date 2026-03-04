import { useState, useEffect } from 'react';

export default function DoctorForm({ doctor, onSave, onClose, saving }) {
  const isEdit = !!doctor;

  const [formData, setFormData] = useState({
    doctorId:        '',
    firstName:       '',
    lastName:        '',
    email:           '',
    password:        '',
    phone:           '',
    address:         '',
    specialization:  '',
    qualifications:  '',
    experienceYears: 0,
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        doctorId:        doctor.doctorId || '',
        firstName:       doctor.firstName || '',
        lastName:        doctor.lastName || '',
        email:           doctor.email || '',
        password:        '', // Intentionally blank for security
        phone:           doctor.phone || '',
        address:         doctor.address || '',
        specialization:  doctor.specialization || '',
        qualifications:  doctor.qualifications || '',
        experienceYears: doctor.experienceYears || 0,
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Doctor' : 'Add New Doctor'}</h2>
          <button className="modal-close" onClick={onClose} disabled={saving}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>First Name</label>
              <input required name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input required name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>{isEdit ? 'Password (leave blank to keep current)' : 'Password'}</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required={!isEdit} minLength={6} />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Years of Experience</label>
              <input required type="number" min="0" name="experienceYears" value={formData.experienceYears} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Specialization</label>
              <select required name="specialization" value={formData.specialization} onChange={handleChange}>
                <option value="">-- Select Specialization --</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Practice">General Practice</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Psychiatry">Psychiatry</option>
              </select>
            </div>

            <div className="form-group">
              <label>Qualifications</label>
              <input required placeholder="e.g. MBBS, MD" name="qualifications" value={formData.qualifications} onChange={handleChange} />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Address</label>
              <textarea required rows={2} name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: '24px', padding: 0 }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
