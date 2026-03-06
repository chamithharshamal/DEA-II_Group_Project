import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCalendarDays, HiUserGroup, HiChatBubbleLeftRight, HiShieldCheck } from 'react-icons/hi2';
import { getDoctors } from '../../services/doctorService';
import AppointmentModal from '../../components/AppointmentModal';
import './landing.css';

const SERVICES = [
  { image: '/images/service_cardiology.png', title: 'Cardiology',     desc: 'Expert diagnosis and treatment for all heart and cardiovascular conditions.' },
  { image: '/images/service_neurology.png', title: 'Neurology',       desc: 'Advanced care for brain, spine and nervous system disorders.' },
  { image: '/images/service_orthopaedics.png', title: 'Orthopaedics',    desc: 'Bone, joint and muscle treatments including joint replacement surgery.' },
  { image: '/images/service_paediatrics.png', title: 'Paediatrics',     desc: 'Compassionate child healthcare from newborns to adolescents.' },
  { image: '/images/service_laboratory.png', title: 'Laboratory',      desc: 'State-of-the-art diagnostic testing with fast, accurate results.' },
  { image: '/images/service_emergency.png', title: 'Emergency',       desc: '24/7 trauma unit staffed by experienced emergency specialists.' },
  { image: '/images/service_pharmacy.png', title: 'Pharmacy',        desc: 'In-house pharmacy fully stocked with all prescribed medications.' },
  { image: '/images/service_radiology.png', title: 'Radiology',       desc: 'Advanced imaging — X-Ray, MRI, CT Scan and Ultrasound services.' },
];

const STEPS = [
  { n: '1', icon: <HiCalendarDays />, title: 'Book Appointment',    desc: 'Choose your specialist and preferred time slot online.' },
  { n: '2', icon: <HiUserGroup />,    title: 'Check In',            desc: 'Arrive at the hospital and check in effortlessly.' },
  { n: '3', icon: <HiChatBubbleLeftRight />, title: 'Consultation',  desc: 'Meet your doctor and get a personalised treatment plan.' },
  { n: '4', icon: <HiShieldCheck />,  title: 'Recovery',            desc: 'Get prescriptions and follow-up care for your recovery.' },
];

export const MOCK_DOCTORS = [
  { doctorId: 'm1', name: 'Dr. Kasun Perera', specialization: 'Cardiology', contactNumber: '101', image: '/images/doctor_kasun.png' },
  { doctorId: 'm2', name: 'Dr. Ruwani Silva', specialization: 'Neurology', contactNumber: '102', image: '/images/doctor_ruwani.png' },
  { doctorId: 'm3', name: 'Dr. Nimal Jayawardena', specialization: 'Paediatrics', contactNumber: '103', image: '/images/doctor_nimal.png' },
  { doctorId: 'm4', name: 'Dr. Amali Fernando', specialization: 'Orthopaedics', contactNumber: '104', image: '/images/doctor_amali.png' },
  { doctorId: 'm5', name: 'Dr. Chamara Weerasinghe', specialization: 'Oncology', contactNumber: '105', image: '/images/doctor_chamara.png' },
  { doctorId: 'm6', name: 'Dr. Sandamali Rathnayake', specialization: 'Dermatology', contactNumber: '106', image: '/images/doctor_sandamali.png' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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

  // We will no longer filter on the landing page, we just show a preview
  const previewDoctors = displaySource.slice(0, 3);

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <a className="nav-logo" href="#">
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
          {['Services', 'Doctors', 'About', 'Contact'].map(l => (
            <a 
              key={l} 
              onClick={() => {
                go(l.toLowerCase());
                setMobileMenuOpen(false);
              }} 
              style={{cursor: 'pointer'}}
            >
              {l}
            </a>
          ))}
          
          {/* Duplicate actions inside dropdown for mobile */}
          <div className="nav-actions mobile-only" style={{marginTop: '20px'}}>
            <button className="btn btn-outline" onClick={() => go('contact')}>📞 Contact</button>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Staff Portal →</button>
          </div>
        </div>

        <div className="nav-actions desktop-only">
          <button className="btn btn-outline" onClick={() => go('contact')}>📞 Contact</button>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Staff Portal →
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <h1>Quality Care,<br /><span>Compassionate</span> Touch</h1>
          <p>
            HealthCare HMS delivers world-class medical care through experienced specialists,
            modern facilities, and a team that genuinely cares about your wellbeing — 24 hours a day.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => go('doctors')}>
              Book Appointment
            </button>
            <button className="btn btn-outline" onClick={() => go('services')}>
              Our Services
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/doctors_team.png" alt="Our Medical Team" loading="lazy" />
          <div className="floating-card top">
            <div className="floating-icon">✓</div>
            <div>
              <div style={{fontWeight: 700, color: 'var(--text-primary)'}}>500+</div>
              <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Specialists</div>
            </div>
          </div>
          <div className="floating-card bottom">
            <div className="floating-icon">🏥</div>
            <div>
              <div style={{fontWeight: 700, color: 'var(--text-primary)'}}>24/7</div>
              <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Emergency</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="services-section" id="services">
        <h2 className="section-title">Comprehensive Medical Services</h2>
        <p className="section-subtitle">
          From routine check-ups to complex surgeries — expert care under one roof,
          backed by cutting-edge technology.
        </p>
        <div className="services-grid">
          {SERVICES.map(s => (
            <div className="service-card" key={s.title}>
              <div className="service-image-header">
                <img src={s.image} alt={s.title} className="service-img" />
              </div>
              <div className="service-card-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ DOCTORS / SPECIALISTS ══ */}
      <section className="specialists-section" id="doctors">
        <div className="specialists-header">
          <h2 className="section-title">Meet Our Specialists</h2>
          <p className="section-subtitle">
            Our highly qualified doctors bring decades of combined experience and a
            deep commitment to every patient's wellbeing.
          </p>
        </div>

        <div className="doctors-grid">
          {previewDoctors.map(d => (
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

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '1.05rem', padding: '16px 32px' }}
            onClick={() => navigate('/our-doctors')}
          >
            See All Doctors →
          </button>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="how-it-works-section" id="about">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Getting the care you need is simplified into four seamless steps.</p>
        
        <div className="steps-container">
          <div className="journey-line"></div>
          {STEPS.map((s, idx) => (
            <div className="step-card" key={s.n} style={{"--delay": `${idx * 0.1}s`}}>
              <div className="step-number">{s.n}</div>
              <div className="step-icon-wrapper">
                {s.icon}
              </div>
              <div className="step-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-section" id="contact">
        <h2>Ready to Book an Appointment?</h2>
        <p>Our team is here to help. Contact us today or walk in anytime — we're open 24 hours a day, 7 days a week.</p>
        <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
          <button className="btn btn-secondary" onClick={() => go('doctors')}>
            📅 Book Appointment
          </button>
          <button className="btn btn-outline" style={{color: '#fff', borderColor: 'rgba(255,255,255,0.5)'}}>
            📞 +94 11 234 5678
          </button>
        </div>
        <p style={{ marginTop: 28, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
          Hospital staff? &nbsp;
          <span
            style={{ color:'#fff', cursor:'pointer', textDecoration:'underline', fontWeight: 600 }}
            onClick={() => navigate('/login')}
          >
            Login to the Staff Portal →
          </span>
        </p>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2><span className="icon">✚</span> HealthCare HMS</h2>
            <p>Delivering compassionate, high-quality healthcare since 2005. Your health is our mission.</p>
          </div>
          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              {['Cardiology','Neurology','Orthopaedics','Paediatrics','Emergency'].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {['About Us','Our Doctors','Book Appointment','Lab Results','Contact'].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>📍 123 Hospital Rd, Colombo</p>
            <p>📞 +94 11 234 5678</p>
            <p>✉️ info@healthcare.lk</p>
            <p>⏰ Open 24 / 7</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 HealthCare HMS · All rights reserved. · Reg. No. HC-2005-LK</p>
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
