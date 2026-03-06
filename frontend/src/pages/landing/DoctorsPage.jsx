import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors } from '../../services/doctorService';
import AppointmentModal from '../../components/AppointmentModal';
import './landing.css';
import { MOCK_DOCTORS } from './LandingPage';

export default function DoctorsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    getDoctors()
      .then(res => setDoctors(res))
      .catch(err => console.error('Failed to load doctors:', err));
  }, []);

  const normalizeDoctor = (d) => {
    // If it's a mock doctor with an image already, keep it
    if (d.image && d.doctorId?.startsWith('m')) return d;
    
    let fullName = d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Specialist';
    if (!fullName.startsWith('Dr.')) fullName = `Dr. ${fullName}`;

    // Map image by name keyword for backend data consistency
    const nameLower = fullName.toLowerCase();
    let img = '/images/doctor_default.png';
    
    // Check for sandamali/sadamali before amali to avoid substring overlap
    if (nameLower.includes('sandamali') || nameLower.includes('sadamali')) img = '/images/doctor_sandamali.png';
    else if (nameLower.includes('kasun')) img = '/images/doctor_kasun.png';
    else if (nameLower.includes('ruwani')) img = '/images/doctor_ruwani.png';
    else if (nameLower.includes('nimal')) img = '/images/doctor_nimal.png';
    else if (nameLower.includes('amali')) img = '/images/doctor_amali.png';
    else if (nameLower.includes('chamara')) img = '/images/doctor_chamara.png';
    else {
      // Fallback to specialization if name doesn't match
      const spec = (d.specialization || '').toLowerCase();
      if (spec.includes('neuro')) img = '/images/doctor_ruwani.png';
      else if (spec.includes('ortho')) img = '/images/doctor_amali.png';
      else if (spec.includes('paed')) img = '/images/doctor_nimal.png';
      else if (spec.includes('cardio')) img = '/images/doctor_kasun.png';
      else if (spec.includes('onco')) img = '/images/doctor_chamara.png';
      else if (spec.includes('derm')) img = '/images/doctor_sandamali.png';
    }

    return {
      ...d,
      name: fullName,
      specialization: d.specialization || 'General Practice',
      image: img
    };
  };

  const displaySource = (doctors.length > 0 ? doctors : MOCK_DOCTORS).map(normalizeDoctor);

  const filteredDoctors = displaySource.filter(d => {
    const searchLower = search.toLowerCase();
    const nameLower = d.name.toLowerCase();
    const specLower = d.specialization.toLowerCase();
    return nameLower.includes(searchLower) || specLower.includes(searchLower);
  });

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <a className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2><span className="icon">✚</span> HealthCare HMS</h2>
        </a>

        {/* Mobile Toggle */}
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Home</a>
          
          <div className="nav-actions mobile-only" style={{marginTop: '20px'}}>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Staff Portal →</button>
          </div>
        </div>

        <div className="nav-actions desktop-only">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Staff Portal →
          </button>
        </div>
      </nav>

      <section className="specialists-section" id="doctors" style={{ minHeight: '80vh' }}>
        <div className="specialists-header">
          <h2 className="section-title">Our Medical Specialists</h2>
          <p className="section-subtitle">
            Find the right doctor for your needs and book an appointment instantly.
          </p>
          
          <div className="search-bar-container" style={{ marginTop: '32px' }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search doctors by name or specialization..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="doctors-grid">
          {filteredDoctors.length === 0 && (
            <div className="no-results">
              <p>No doctors found matching "{search}".</p>
            </div>
          )}
          {filteredDoctors.map(d => (
            <div className="doctor-card" key={d.doctorId}>
              <div className="doctor-image">
                {d.image ? (
                  <img src={d.image} alt={d.name} className="doctor-img" />
                ) : (
                  <span className="fallback-icon">👨‍⚕️</span>
                )}
              </div>
              <div className="doctor-info">
                <h3>{d.name}</h3>
                <div className="specialty">{d.specialization}</div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setBookingDoctor(d)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2><span className="icon">✚</span> HealthCare HMS</h2>
            <p>Delivering compassionate, high-quality healthcare since 2005.</p>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>📍 123 Hospital Rd, Colombo</p>
            <p>📞 +94 11 234 5678</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 HealthCare HMS · All rights reserved.</p>
        </div>
      </footer>

      {bookingDoctor && (
        <AppointmentModal 
          doctor={bookingDoctor} 
          onClose={() => setBookingDoctor(null)} 
        />
      )}
    </div>
  );
}
