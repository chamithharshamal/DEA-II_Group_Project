// ─── Public Landing Page — Clean Blue & White ────────────────────────────────
import { useNavigate } from 'react-router-dom';
import './landing.css';

const SERVICES = [
  { icon: '❤️', title: 'Cardiology',     desc: 'Expert diagnosis and treatment for all heart and cardiovascular conditions.' },
  { icon: '🧠', title: 'Neurology',       desc: 'Advanced care for brain, spine and nervous system disorders.' },
  { icon: '🦴', title: 'Orthopaedics',    desc: 'Bone, joint and muscle treatments including joint replacement surgery.' },
  { icon: '👶', title: 'Paediatrics',     desc: 'Compassionate child healthcare from newborns to adolescents.' },
  { icon: '🔬', title: 'Laboratory',      desc: 'State-of-the-art diagnostic testing with fast, accurate results.' },
  { icon: '🚑', title: 'Emergency',       desc: '24/7 trauma unit staffed by experienced emergency specialists.' },
  { icon: '💊', title: 'Pharmacy',        desc: 'In-house pharmacy fully stocked with all prescribed medications.' },
  { icon: '🩻', title: 'Radiology',       desc: 'Advanced imaging — X-Ray, MRI, CT Scan and Ultrasound services.' },
];

const DOCTORS = [
  { emoji: '👨‍⚕️', name: 'Dr. Nimal Perera',     spec: 'Cardiologist · 18 yrs' },
  { emoji: '👩‍⚕️', name: 'Dr. Amara Silva',       spec: 'Neurologist · 14 yrs' },
  { emoji: '👨‍⚕️', name: 'Dr. Roshan Kumara',     spec: 'Emergency Med. · 10 yrs' },
  { emoji: '👩‍⚕️', name: 'Dr. Chathu De Saram',   spec: 'Paediatrician · 12 yrs' },
];

const STEPS = [
  { n: '1', title: 'Book Appointment',    desc: 'Choose your specialist and preferred time slot online or by phone.' },
  { n: '2', title: 'Check In',            desc: 'Arrive at the hospital and check in effortlessly at our front desk.' },
  { n: '3', title: 'Consultation',        desc: 'Meet your doctor, get an accurate diagnosis and personalised treatment plan.' },
  { n: '4', title: 'Recovery & Follow-up', desc: 'Collect prescriptions, book follow-ups, and recover with our ongoing support.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="lp">

      {/* ══ NAVBAR ══ */}
      <nav className="lp-nav">
        <a className="lp-brand" href="#">
          <div className="lp-brand-icon">✚</div>
          <div>
            <div className="lp-brand-text">HealthCare HMS</div>
            <div className="lp-brand-sub">Colombo, Sri Lanka</div>
          </div>
        </a>

        <div className="lp-links">
          {['Services', 'About', 'Doctors', 'Contact'].map(l => (
            <a key={l} onClick={() => go(l.toLowerCase())}>{l}</a>
          ))}
        </div>

        <div className="lp-nav-actions">
          <button className="btn-lp btn-lp-ghost" onClick={() => go('contact')}>📞 Contact</button>
          <button className="btn-lp btn-lp-primary" onClick={() => navigate('/app/admin')}>
            Staff Portal →
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="lp-hero" id="home">
        <div className="lp-hero-img" />
        <div className="lp-hero-inner">
          <div className="lp-hero-tag">
            <span className="dot" /> Accepting New Patients
          </div>
          <h1 className="lp-hero-h1">
            Quality Care,<br /><em>Compassionate</em> Touch
          </h1>
          <p className="lp-hero-p">
            HealthCare HMS delivers world-class medical care through experienced specialists,
            modern facilities, and a team that genuinely cares about your wellbeing — 24 hours a day.
          </p>
          <div className="lp-hero-btns">
            <button className="btn-lp btn-lp-white btn-lp-lg" onClick={() => go('services')}>
              Our Services
            </button>
            <button
              className="btn-lp btn-lp-lg"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}
              onClick={() => go('doctors')}
            >
              Meet Our Doctors
            </button>
          </div>
          <div className="lp-hero-stats">
            {[
              { val: '500+', lbl: 'Specialists' },
              { val: '50K+', lbl: 'Patients' },
              { val: '30',   lbl: 'Departments' },
              { val: '24/7', lbl: 'Emergency' },
            ].map(s => (
              <div className="lp-hero-stat" key={s.lbl}>
                <div className="lp-stat-val">{s.val}</div>
                <div className="lp-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NUMBERS BAR ══ */}
      <div className="nums-bar">
        {[
          { val: '500+', lbl: 'Qualified Doctors' },
          { val: '50K+', lbl: 'Patients Served' },
          { val: '24/7', lbl: 'Emergency Services' },
          { val: '99%',  lbl: 'Patient Satisfaction' },
          { val: '30+',  lbl: 'Departments' },
          { val: '2005', lbl: 'Established' },
        ].map(n => (
          <div className="num-item" key={n.lbl}>
            <div className="num-val">{n.val}</div>
            <div className="num-lbl">{n.lbl}</div>
          </div>
        ))}
      </div>

      {/* ══ SERVICES ══ */}
      <section className="lp-section" id="services">
        <div className="lp-section-head">
          <div className="lp-pill">Our Specialties</div>
          <h2 className="lp-h2">Comprehensive Medical Services</h2>
          <p className="lp-sub">
            From routine check-ups to complex surgeries — expert care under one roof,
            backed by cutting-edge technology.
          </p>
        </div>
        <div className="svc-grid">
          {SERVICES.map(s => (
            <div className="svc-card" key={s.title}>
              <div className="svc-icon">{s.icon}</div>
              <div className="svc-title">{s.title}</div>
              <div className="svc-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ DOCTORS (with photo) ══ */}
      <section className="lp-section bg-off" id="doctors">
        <div className="doctors-split">
          <div className="doctors-img">
            <img src="/doctors_team.png" alt="Our Medical Team" loading="lazy" />
          </div>
          <div className="doctors-content">
            <div className="lp-pill">Our Team</div>
            <h2 className="lp-h2">Meet Our Specialists</h2>
            <p className="lp-sub">
              Our highly qualified doctors bring decades of combined experience and a
              deep commitment to every patient's wellbeing.
            </p>
            <div className="doc-list">
              {DOCTORS.map(d => (
                <div className="doc-item" key={d.name}>
                  <div className="doc-ava">{d.emoji}</div>
                  <div>
                    <div className="doc-name">{d.name}</div>
                    <div className="doc-spec">{d.spec}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-lp btn-lp-primary" onClick={() => go('contact')}>
              Book a Consultation →
            </button>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="lp-section" id="about">
        <div className="lp-section-head">
          <div className="lp-pill">Patient Journey</div>
          <h2 className="lp-h2">How It Works</h2>
          <p className="lp-sub">Getting the care you need is simple — just four easy steps.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map(s => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="lp-cta" id="contact">
        <h2>Ready to Book an Appointment?</h2>
        <p>Our team is here to help. Contact us today or walk in anytime — we're open 24 hours a day, 7 days a week.</p>
        <div className="lp-cta-btns">
          <button className="btn-lp btn-lp-white btn-lp-lg">📅 Book Appointment</button>
          <button
            className="btn-lp btn-lp-lg"
            style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.35)' }}
          >
            📞 +94 11 234 5678
          </button>
        </div>
        <p style={{ marginTop: 28, fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)' }}>
          Hospital staff? &nbsp;
          <span
            style={{ color:'#93c5fd', cursor:'pointer', textDecoration:'underline' }}
            onClick={() => navigate('/app/admin')}
          >
            Login to the Staff Portal →
          </span>
        </p>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <div className="name"><span>✚</span> HealthCare HMS</div>
            <p>Delivering compassionate, high-quality healthcare since 2005. Your health is our mission.</p>
          </div>
          {[
            { h: 'Services',    links: ['Cardiology','Neurology','Orthopaedics','Paediatrics','Emergency'] },
            { h: 'Quick Links', links: ['About Us','Our Doctors','Book Appointment','Lab Results','Contact'] },
            { h: 'Contact',     links: ['📍 123 Hospital Rd, Colombo','📞 +94 11 234 5678','✉️ info@healthcare.lk','⏰ Open 24 / 7'] },
          ].map(col => (
            <div className="lp-footer-col" key={col.h}>
              <h4>{col.h}</h4>
              <ul>{col.links.map(l => <li key={l}><a>{l}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="lp-footer-bottom">
          <span>© 2025 HealthCare HMS · All rights reserved.</span>
          <span>123 Hospital Road, Colombo, Sri Lanka · Reg. No. HC-2005-LK</span>
        </div>
      </footer>

    </div>
  );
}
