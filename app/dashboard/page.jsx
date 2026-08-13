'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!currentUser) return;
      try {
        const { data } = await supabase
          .from('verification_history')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(10);
        setHistory(data || []);
      } catch (e) {
        console.warn("History load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [currentUser]);

  if (!currentUser) return null;

  const isAdmin = currentUser.email === 'brinoekanem@gmail.com' || currentUser.role === 'admin';
  const isAgent = currentUser.role === 'agent';

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: '0 0 0.25rem', color: 'var(--text-dark)', fontSize: '1.35rem', fontWeight: 800 }}>
            Welcome back, {currentUser.firstname || currentUser.full_name}! 👋
          </h2>
          <p style={{ margin: 0, color: 'var(--secondary)', fontSize: '0.875rem' }}>
            Identity Verification &amp; Portal Dashboard ({currentUser.email})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/fund" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-plus-circle"></i> Fund Wallet
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Wallet Balance Card */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Wallet Balance</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-dark)', marginTop: '0.25rem' }}>
                ₦{Number(currentUser.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ background: '#e0f2fe', color: '#0284c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.25rem' }}>
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
        </div>

        {/* Account Role Card */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Account Role</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isAdmin ? (
                  <span className="badge" style={{ background: 'linear-gradient(135deg,#7c3aed,#4c1d95)', color: '#fff', padding: '4px 12px', borderRadius: '12px' }}>
                    <i className="fa-solid fa-crown" style={{ color: '#fbbf24' }}></i> Super Admin
                  </span>
                ) : isAgent ? (
                  <span className="badge" style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)', color: '#fff', padding: '4px 12px', borderRadius: '12px' }}>
                    <i className="fa-solid fa-user-tie"></i> Verified Agent
                  </span>
                ) : (
                  <span className="badge" style={{ background: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '12px' }}>
                    <i className="fa-solid fa-user"></i> Standard Operator
                  </span>
                )}
              </div>
            </div>
            <div style={{ background: '#f3e8ff', color: '#7c3aed', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.25rem' }}>
              <i className="fa-solid fa-shield"></i>
            </div>
          </div>
        </div>

        {/* Services Status Card */}
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>API &amp; System Status</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-circle-check"></i> 100% Operational
              </div>
            </div>
            <div style={{ background: '#d1fae5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.25rem' }}>
              <i className="fa-solid fa-server"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Services Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>Identity Services &amp; Quick Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <Link href="/verify" className="card" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }}>
            <div style={{ background: '#e0f2fe', color: '#0284c7', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.25rem' }}>
              <i className="fa-solid fa-address-card"></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem' }}>NIN Verification</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>NIN, Phone &amp; Demography</div>
            </div>
          </Link>

          <Link href="/bvn" className="card" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }}>
            <div style={{ background: '#f3e8ff', color: '#7c3aed', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.25rem' }}>
              <i className="fa-solid fa-credit-card"></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem' }}>BVN Verification</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Basic, Plastic &amp; Regular Pro</div>
            </div>
          </Link>

          <Link href="/validation" className="card" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }}>
            <div style={{ background: '#d1fae5', color: '#059669', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.25rem' }}>
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem' }}>NIN Validation</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>No-Record &amp; SIM Validation</div>
            </div>
          </Link>

          <Link href="/personalization" className="card" style={{ padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s' }}>
            <div style={{ background: '#fef3c7', color: '#d97706', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.25rem' }}>
              <i className="fa-solid fa-id-card-clip"></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem' }}>Personalization</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>V1 &amp; V2 Slip Personalization</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ margin: 0, fontSize: '1.05rem' }}>Recent Verifications</h3>
          <Link href="/logs" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
        </div>
        <div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-circle-notch fa-spin"></i> Loading verification history...
            </div>
          ) : history.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No verification records found. Perform your first lookup above!
            </div>
          ) : (
            <div className="table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Target ID / Phone</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Date &amp; Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{(row.verification_type || 'NIN').toUpperCase()}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{row.nin_query || row.phone_query || '—'}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#0284c7', fontWeight: 700 }}>₦{row.amount_charged || 300}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{String(row.created_at || '').substring(0, 16).replace('T', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
