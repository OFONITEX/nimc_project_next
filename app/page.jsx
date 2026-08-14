'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <Link href="/" className="landing-brand">
          <div className="brand-icon">
            <img src="/img/ofonitech_logo.jpg" alt="OFONiTech Logo" />
          </div>
          <div className="brand-titles">
            <span className="brand-main">OFONITECH SOLUTIONZ</span>
            <span className="brand-sub">myninverify.com</span>
          </div>
        </Link>

        <ul className="landing-nav-links">
          <li><Link href="/">Home</Link></li>
          <li><a href="#about-section">About</a></li>
          <li><a href="#services-section">Services</a></li>
          <li><a href="#pricing-section">Pricing</a></li>
          <li><a href="#contact-section">KYC &amp; Contact</a></li>
        </ul>

        <div className="landing-header-actions">
          <Link href="/login" className="btn btn-primary" style={{ padding: '0.55rem 1.25rem', fontWeight: 600 }}>
            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '4px' }}></i> Login
          </Link>
          <Link href="/signup" className="btn btn-outline" style={{ padding: '0.55rem 1.25rem', fontWeight: 600 }}>
            SignUp
          </Link>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="landing-hero">
        <div className="hero-pill">
          <i className="fa-solid fa-shield-halved"></i> Digital Identity &amp; Software Infrastructure
        </div>
        <h1 className="hero-title">
          Enterprise Identity Verification &amp; <span>Software Infrastructure</span>
        </h1>
        <p className="hero-desc">
          OFONITECH SOLUTIONZ powers fast, secure NIN/BVN verification services, educational portal tools, custom website development, and high-availability identity APIs for businesses and agents across Nigeria.
        </p>

        <div className="hero-ctas">
          <Link href="/signup" className="btn btn-primary btn-lg" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            SignUp <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
          </Link>
          <Link href="/login" className="btn btn-outline btn-lg" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '6px' }}></i> Login
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-val">99.9%</div>
            <div className="stat-lbl">API &amp; Portal Uptime</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">&lt; 1 sec</div>
            <div className="stat-lbl">Verification Response Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">9+</div>
            <div className="stat-lbl">Identity &amp; Tech Services</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">24/7</div>
            <div className="stat-lbl">Dedicated Support</div>
          </div>
        </div>
      </section>

      {/* Featured Services Slip Boxes Section */}
      <section className="landing-section" id="services-section" style={{ background: 'var(--bg-muted)', padding: '4rem 1.5rem' }}>
        <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="section-tag" style={{ display: 'inline-block', background: '#e0f2fe', color: '#0284c7', fontWeight: 700, fontSize: '0.8rem', padding: '4px 12px', borderRadius: '12px', marginBottom: '0.5rem' }}>What We Offer</div>
            <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)' }}>NIN Verification &amp; Official Slip Services</h2>
            <p className="section-sub" style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>Click any slip card below to register and generate official NIN verification slips instantly.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {/* Box 1: Standard NIN Slip (Left) */}
            <Link href="/signup" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem 1.5rem', borderTop: '4px solid #059669', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <div>
                  <div style={{ background: '#d1fae5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem' }}>
                    <i className="fa-solid fa-file-pdf"></i>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>Standard NIN Slip</h3>
                  <p style={{ margin: '0 0 1rem', color: 'var(--secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>One-click standard PDF NIN slip generation ready for instant printing and official usage.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span className="badge" style={{ background: '#d1fae5', color: '#059669', fontWeight: 700, fontSize: '0.75rem' }}>Standard Slip</span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.75rem' }}>PDF Download</span>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', background: '#fff', padding: '4px' }}>
                  <img src="/img/sample_standard_white.jpg" alt="Standard NIN Slip Sample" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px', objectFit: 'contain' }} />
                </div>
              </div>
            </Link>

            {/* Box 2: Premium NIN Slip (Center) */}
            <Link href="/signup" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem 1.5rem', borderTop: '4px solid #0284c7', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <div>
                  <div style={{ background: '#e0f2fe', color: '#0284c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem' }}>
                    <i className="fa-solid fa-address-card"></i>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>NIN Premium Slip</h3>
                  <p style={{ margin: '0 0 1rem', color: 'var(--secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>High-resolution, plastic card format NIN Premium Slip design with enhanced security features.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', fontWeight: 700, fontSize: '0.75rem' }}>Premium HD</span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.75rem' }}>Card Format</span>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', background: '#fff', padding: '4px' }}>
                  <img src="/img/sample_premium_green.jpg" alt="Premium NIN Slip Sample" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px', objectFit: 'contain' }} />
                </div>
              </div>
            </Link>

            {/* Box 3: Regular NIN Slip (Right) */}
            <Link href="/signup" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem 1.5rem', borderTop: '4px solid #7c3aed', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <div>
                  <div style={{ background: '#f3e8ff', color: '#7c3aed', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem' }}>
                    <i className="fa-solid fa-id-card"></i>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>Regular NIN Slip</h3>
                  <p style={{ margin: '0 0 1rem', color: 'var(--secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>Official NIMC National Identification Number landscape slip format with complete demographic verification details.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span className="badge" style={{ background: '#f3e8ff', color: '#7c3aed', fontWeight: 700, fontSize: '0.75rem' }}>Real-Time</span>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.75rem' }}>Instant Result</span>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', background: '#fff', padding: '4px' }}>
                  <img src="/img/sample_regular_long.png" alt="Regular NIN Slip Sample" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px', objectFit: 'contain' }} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="landing-section" id="pricing-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Verification Rates</div>
            <h2 className="section-title">Transparent &amp; Affordable Pricing</h2>
            <p className="section-sub">Zero hidden charges. Pay per verification with instant automated wallet funding.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="card text-center" style={{ padding: '2rem', borderTop: '4px solid #0284c7' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>Identity Verification</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0284c7', margin: '0.75rem 0' }}>₦200 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ lookup</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Standard NIN &amp; BVN Verification lookups. FREE slip downloads (0 extra charges)!</p>
            </div>

            <div className="card text-center" style={{ padding: '2rem', borderTop: '4px solid #7c3aed' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>NIN Validation</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed', margin: '0.75rem 0' }}>₦1,500 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ request</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Fixed ₦1,500 rate for No Record, SIM, Photo Error &amp; Modification Validation</p>
            </div>

            <div className="card text-center" style={{ padding: '2rem', borderTop: '4px solid #059669' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>NIN Personalization</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', margin: '0.75rem 0' }}>₦1,000 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ slip</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Personalized NIN slip generation using NIMC Enrollment Tracking ID</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-bottom">
          <div>&copy; 2026 OFONITECH SOLUTIONZ (myninverify.com). All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
