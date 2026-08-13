'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function VerifyNINPage() {
  const { currentUser, refreshUser } = useAuth();
  const [tab, setTab] = useState('nin'); // 'nin', 'phone', 'demo'
  const [ninInput, setNinInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!currentUser) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    let payload = { verification_type: tab };
    if (tab === 'nin') payload.nin = ninInput.trim();
    else if (tab === 'phone') payload.phone_number = phoneInput.trim();
    else if (tab === 'demo') {
      payload.firstname = fname.trim();
      payload.lastname = lname.trim();
      payload.dob = dob;
      payload.gender = gender;
    }

    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Verification lookup failed');
      } else {
        setResult(data.data);
        await refreshUser();
      }
    } catch (err) {
      setError('Network connection error performing verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <i className="fa-solid fa-address-card" style={{ color: 'var(--primary)' }}></i>
          National Identity Number (NIN) Verification
        </h2>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--secondary)', fontSize: '0.875rem' }}>
          Perform instant NIMC verification by NIN Number, Registered Phone Number, or Customer Demographics.
        </p>
      </div>

      {/* Verification Tabs */}
      <div className="tab-buttons" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
        <button 
          className={`btn ${tab === 'nin' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setTab('nin'); setError(''); setResult(null); }}
          style={{ fontSize: '0.85rem' }}
        >
          <i className="fa-solid fa-hashtag"></i> Verify by NIN
        </button>
        <button 
          className={`btn ${tab === 'phone' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setTab('phone'); setError(''); setResult(null); }}
          style={{ fontSize: '0.85rem' }}
        >
          <i className="fa-solid fa-phone"></i> Verify by Phone Number
        </button>
        <button 
          className={`btn ${tab === 'demo' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => { setTab('demo'); setError(''); setResult(null); }}
          style={{ fontSize: '0.85rem' }}
        >
          <i className="fa-solid fa-user-tag"></i> Verify by Demographics
        </button>
      </div>

      {/* Verification Form Card */}
      <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--primary)' }}>
        <form onSubmit={handleVerify}>
          {tab === 'nin' && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>11-Digit NIN Number</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. 12345678901" 
                maxLength={11} 
                value={ninInput} 
                onChange={(e) => setNinInput(e.target.value)} 
                required 
              />
            </div>
          )}

          {tab === 'phone' && (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>11-Digit Registered Phone Number</label>
              <input 
                type="tel" 
                className="form-control" 
                placeholder="e.g. 08012345678" 
                maxLength={11} 
                value={phoneInput} 
                onChange={(e) => setPhoneInput(e.target.value)} 
                required 
              />
            </div>
          )}

          {tab === 'demo' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>First Name</label>
                <input type="text" className="form-control" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Last Name / Surname</label>
                <input type="text" className="form-control" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Date of Birth</label>
                <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Gender</label>
                <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          )}

          {error && (
            <div className="flash flash-danger" style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Lookup Fee: <strong style={{ color: 'var(--primary)' }}>₦300</strong>
            </span>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontWeight: 700 }}>
              {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Verifying...</> : <><i className="fa-solid fa-magnifying-glass"></i> Perform Verification</>}
            </button>
          </div>
        </form>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="card" style={{ borderTop: '4px solid var(--success)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ background: '#d1fae5', color: '#059669', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.15rem', fontWeight: 800 }}>Verification Result</h3>
              <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>NIMC Record Successfully Retrieved</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</span><div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>{result.firstname || result.first_name} {result.surname || result.last_name}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>NIN Number</span><div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{result.nin || '—'}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Date of Birth</span><div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{result.birthdate || result.dob || '—'}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number</span><div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{result.telephoneno || result.phone_number || '—'}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Gender</span><div style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'capitalize' }}>{result.gender || '—'}</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
