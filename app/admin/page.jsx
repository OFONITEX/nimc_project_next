'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [agentEmail, setAgentEmail] = useState('');
  const [agentRole, setAgentRole] = useState('agent');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  const isAdmin = currentUser && (currentUser.email === 'brinoekanem@gmail.com' || currentUser.role === 'admin');

  const loadUsersTable = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id,email,full_name,wallet_balance,role,agent_nin_price,agent_bvn_price,created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error("Network error loading roster:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsersTable();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '550px', margin: '2rem auto' }}>
        <div style={{ background: '#fee2e2', color: '#dc2626', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.75rem' }}>
          <i className="fa-solid fa-lock"></i>
        </div>
        <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-dark)', fontWeight: 700 }}>Access Restricted</h3>
        <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          This Admin &amp; Agent Management Portal is reserved exclusively for the primary administrator (<strong>brinoekanem@gmail.com</strong>).
        </p>
        <Link href="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <i className="fa-solid fa-house"></i> Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleAddAgent = async (e) => {
    e.preventDefault();
    if (!agentEmail.trim()) return;

    setSaving(true);
    setStatusMsg({ text: 'Updating user role in Supabase...', type: 'info' });

    try {
      const { data: userRec } = await supabase
        .from('users')
        .select('id')
        .eq('email', agentEmail.trim().toLowerCase())
        .single();

      if (!userRec) {
        setStatusMsg({ text: `No user account found with email "${agentEmail}". User must sign up first.`, type: 'danger' });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('users')
        .update({ role: agentRole })
        .eq('id', userRec.id);

      if (error) {
        setStatusMsg({ text: 'Error updating role: ' + error.message, type: 'danger' });
      } else {
        setStatusMsg({ text: `Successfully assigned role "${agentRole.toUpperCase()}" to ${agentEmail}!`, type: 'success' });
        setAgentEmail('');
        loadUsersTable();
      }
    } catch (err) {
      setStatusMsg({ text: 'Network error updating user role.', type: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  const setRoleDirect = async (email, role) => {
    try {
      const { error } = await supabase.from('users').update({ role }).eq('email', email);
      if (error) alert('Error: ' + error.message);
      else loadUsersTable();
    } catch (e) {
      alert('Failed: ' + e.message);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg,#7c3aed,#4c1d95)', width: '54px', height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>
            <i className="fa-solid fa-crown" style={{ color: '#fbbf24', fontSize: '1.5rem' }}></i>
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Admin &amp; Agent Dashboard
              <span style={{ background: '#f3e8ff', color: '#7c3aed', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>brinoekanem@gmail.com</span>
            </h2>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--secondary)', fontSize: '0.875rem' }}>Designate Agents by email and manage system user permissions</p>
          </div>
        </div>
      </div>

      {/* 1. Add / Update Agent Form */}
      <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid #7c3aed' }}>
        <div className="card-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <i className="fa-solid fa-user-plus" style={{ color: '#7c3aed', fontSize: '1.1rem' }}></i>
          <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem' }}>Add or Designate Agent</h3>
        </div>
        <div className="card-body" style={{ paddingTop: '1.25rem' }}>
          <form onSubmit={handleAddAgent}>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Agent Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="e.g. agent@example.com" 
                  value={agentEmail} 
                  onChange={(e) => setAgentEmail(e.target.value)} 
                  required
                />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Role Designation</label>
                <select 
                  className="form-control"
                  value={agentRole}
                  onChange={(e) => setAgentRole(e.target.value)}
                >
                  <option value="agent">Agent (Standard Operator Rates)</option>
                  <option value="operator">Operator (Standard Rates)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: statusMsg.type === 'success' ? 'var(--success)' : (statusMsg.type === 'danger' ? 'var(--danger)' : 'var(--info)') }}>
                {statusMsg.text}
              </div>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ background: 'linear-gradient(135deg,#7c3aed,#4c1d95)', padding: '0.65rem 1.5rem' }}>
                <i className="fa-solid fa-check"></i> {saving ? 'Saving...' : 'Save / Add Agent'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Roster Table of All Users & Agents */}
      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-users" style={{ color: 'var(--primary)' }}></i> User &amp; Agent Roster
            </h3>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Click actions below to change user role or designate agents</p>
          </div>
          <button onClick={loadUsersTable} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            <i className="fa-solid fa-rotate-right"></i> Refresh Roster
          </button>
        </div>

        <div>
          {loadingUsers ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '1.5rem' }}></i> Loading user profiles...
            </div>
          ) : (
            <div className="table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>User Profile / Email</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Role Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>NIN Fee</th>
                    <th style={{ padding: '0.75rem 1rem' }}>BVN Fee</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Wallet Balance</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Role Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const isUserAdmin = (u.email === 'brinoekanem@gmail.com') || (u.role === 'admin');
                    const isUserAgent = (u.role === 'agent');

                    let badgeStyle = { background: '#f1f5f9', color: '#475569' };
                    let badgeLabel = <><i className="fa-solid fa-user"></i> Operator</>;
                    if (isUserAdmin) {
                      badgeStyle = { background: 'linear-gradient(135deg,#7c3aed,#4c1d95)', color: '#fff' };
                      badgeLabel = <><i className="fa-solid fa-crown" style={{ color: '#fbbf24' }}></i> Admin</>;
                    } else if (isUserAgent) {
                      badgeStyle = { background: 'linear-gradient(135deg,#0284c7,#0369a1)', color: '#fff' };
                      badgeLabel = <><i className="fa-solid fa-user-tie"></i> Agent</>;
                    }

                    const ninFee = isUserAdmin ? '₦100' : '₦300';
                    const bvnFee = isUserAdmin ? '₦100' : '₦200 / ₦300';
                    const balStr = '₦' + Number(u.wallet_balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 });

                    return (
                      <tr key={u.id || u.email} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{u.full_name || u.email.split('@')[0]}</div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ ...badgeStyle, fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {badgeLabel}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0284c7' }}>{ninFee}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#7c3aed' }}>{bvnFee}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{balStr}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          {isUserAdmin ? (
                            <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Super Admin</span>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                              {!isUserAgent ? (
                                <button onClick={() => setRoleDirect(u.email, 'agent')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#0284c7', borderColor: '#0284c7' }}>
                                  <i className="fa-solid fa-user-tie"></i> Make Agent
                                </button>
                              ) : (
                                <button onClick={() => setRoleDirect(u.email, 'operator')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: 'var(--text-muted)' }}>
                                  Demote
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
