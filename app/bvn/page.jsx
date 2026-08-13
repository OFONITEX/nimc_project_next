'use client';

import Link from 'next/link';

export default function BVNSelectionPage() {
  return (
    <div className="bvn-selection-container">
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <i className="fa-solid fa-credit-card" style={{ color: '#7c3aed' }}></i>
          Bank Verification Number (BVN) Services
        </h2>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--secondary)', fontSize: '0.875rem' }}>
          Select a BVN slip type below to perform instant verification and download official slips.
        </p>
      </div>

      {/* 3-Card Selection Grid */}
      <div className="verify-options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Card 1: Basic Slip (200) */}
        <div className="card bvn-card" style={{ borderTop: '4px solid #0284c7', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem 1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ background: '#e0f2fe', color: '#0284c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.35rem' }}>
                <i className="fa-solid fa-file-invoice"></i>
              </div>
              <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', fontWeight: 800, fontSize: '0.85rem', padding: '4px 12px', borderRadius: '20px' }}>
                ₦200 / lookup
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)' }}>Basic Slip</h3>
            <p style={{ margin: 0, color: 'var(--secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Standard BVN printout slip containing essential customer identity details and digital verification summary.
            </p>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/bvn/basic" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg,#0284c7,#0369a1)' }}>
              Select Basic Slip <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* Card 2: Plastic Card (300) */}
        <div className="card bvn-card" style={{ borderTop: '4px solid #7c3aed', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem 1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ background: '#f3e8ff', color: '#7c3aed', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.35rem' }}>
                <i className="fa-solid fa-id-card"></i>
              </div>
              <span className="badge" style={{ background: '#f3e8ff', color: '#7c3aed', fontWeight: 800, fontSize: '0.85rem', padding: '4px 12px', borderRadius: '20px' }}>
                ₦300 / lookup
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)' }}>Plastic Card</h3>
            <p style={{ margin: 0, color: 'var(--secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Wallet-sized BVN Plastic Card layout ready for instant high-resolution laminated plastic card printing.
            </p>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/bvn/plastic" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg,#7c3aed,#4c1d95)' }}>
              Select Plastic Card <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        {/* Card 3: Regular Pro (300) */}
        <div className="card bvn-card" style={{ borderTop: '4px solid #059669', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.75rem 1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ background: '#d1fae5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.35rem' }}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <span className="badge" style={{ background: '#d1fae5', color: '#059669', fontWeight: 800, fontSize: '0.85rem', padding: '4px 12px', borderRadius: '20px' }}>
                ₦300 / lookup
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-dark)' }}>Regular Pro</h3>
            <p style={{ margin: 0, color: 'var(--secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Comprehensive Regular Pro BVN verification slip with complete demographic details, photo, and official security stamp.
            </p>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/bvn/regular-pro" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg,#059669,#047857)' }}>
              Select Regular Pro <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
