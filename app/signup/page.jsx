'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setSubmitting(true);
    setError('');

    const res = await signup(email.trim(), password, fullName.trim());
    if (res.success) {
      setSuccessMsg('Account created successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
    } else {
      setError(res.error || 'Failed to create account');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-gradient)', padding: '1.5rem 1rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <img src="/img/ofonitech_logo.jpg" alt="OFONITECH Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ margin: '0 0 0.5rem', color: 'var(--text-dark)', fontSize: '1.4rem', fontWeight: 800 }}>Create Portal Account</h2>
          <p style={{ margin: 0, color: 'var(--secondary)', fontSize: '0.875rem' }}>Sign up to perform instant NIN &amp; BVN identity verifications</p>
        </div>

        {error && (
          <div className="flash flash-danger" style={{ marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-triangle-exclamation"></i> {error}
          </div>
        )}

        {successMsg && (
          <div className="flash flash-success" style={{ marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-circle-check"></i> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. John Doe" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="e.g. user@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Minimum 6 characters" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              minLength={6}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 700 }}
          >
            {submitting ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Creating Account...</> : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}
