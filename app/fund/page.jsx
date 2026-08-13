'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function FundWalletPage() {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  const handleFund = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 100) {
      alert('Minimum deposit amount is ₦100');
      return;
    }

    setLoading(true);

    if (window.MonnifySDK) {
      window.MonnifySDK.initialize({
        amount: parseFloat(amount),
        currency: "NGN",
        reference: "MNF_NEXT_" + Date.now(),
        customerName: currentUser.full_name || currentUser.email,
        customerEmail: currentUser.email,
        apiKey: "MK_PROD_BE6J2GKVL3",
        contractCode: "8206123490",
        paymentDescription: "Wallet Funding on myninverify.com",
        isTestMode: false,
        onComplete: function(response) {
          alert('Payment completed! Your wallet will update automatically.');
          window.location.href = '/dashboard';
        },
        onClose: function(data) {
          setLoading(false);
        }
      });
    } else {
      alert('Payment SDK loading... Please wait 2 seconds and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fund-wallet-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{ background: '#e0f2fe', color: '#0284c7', width: '54px', height: '54px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.4rem' }}>
          <i className="fa-solid fa-wallet"></i>
        </div>
        <h2 style={{ margin: '0 0 0.25rem', color: 'var(--text-dark)', fontSize: '1.35rem', fontWeight: 800 }}>Fund User Wallet</h2>
        <p style={{ margin: 0, color: 'var(--secondary)', fontSize: '0.875rem' }}>Instant automated deposit via Card, USSD, or Transfer</p>
      </div>

      <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
        <form onSubmit={handleFund}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', display: 'block' }}>Deposit Amount (₦)</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="e.g. 2000" 
              min={100} 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: 700, fontSize: '0.95rem' }}>
            {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</> : <><i className="fa-solid fa-credit-card"></i> Pay Now with Monnify</>}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-dark)', fontWeight: 700 }}>Direct Bank Transfer Support</h4>
          <p style={{ color: 'var(--secondary)', margin: '0 0 0.75rem' }}>For manual bank transfer funding, contact billing support:</p>
          <div style={{ background: 'var(--bg-muted)', padding: '0.85rem', borderRadius: '10px', fontWeight: 600, color: 'var(--text-dark)' }}>
            <i className="fa-solid fa-envelope" style={{ color: 'var(--primary)', marginRight: '6px' }}></i> brinoekanem@gmail.com
          </div>
        </div>
      </div>
    </div>
  );
}
