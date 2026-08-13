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
            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '4px' }}></i> Client Portal
          </Link>
          <Link href="/signup" className="btn btn-outline" style={{ padding: '0.55rem 1.25rem', fontWeight: 600 }}>
            Create Account
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
            Get Started <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
          </Link>
          <Link href="/login" className="btn btn-outline btn-lg" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            <i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i> Access Client Portal
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
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>NIN Verification</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0284c7', margin: '0.75rem 0' }}>₦300 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ lookup</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Standard NIN, Phone &amp; Demographic verification lookups</p>
            </div>

            <div className="card text-center" style={{ padding: '2rem', borderTop: '4px solid #7c3aed' }}>
              <div style={{ fontSize: '1.25rem', fontWeight 800, color: 'var(--text-dark)' }}>BVN Basic Slip</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed', margin: '0.75rem 0' }}>₦200 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ lookup</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Basic BVN Verification &amp; PDF Slip Generation</p>
            </div>

            <div className="card text-center" style={{ padding: '2rem', borderTop: '4px solid #059669' }}>
              <div style={{ fontSize: '1.25rem', fontWeight 800, color: 'var(--text-dark)' }}>BVN Plastic / Regular Pro</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#059669', margin: '0.75rem 0' }}>₦300 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ lookup</span></div>
              <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>Plastic Card &amp; Premium Regular Pro BVN Slips</p>
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
