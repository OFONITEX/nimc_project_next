'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AppShell({ children }) {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);

  if (!currentUser) return <>{children}</>;

  const isAdmin = currentUser.email === 'brinoekanem@gmail.com' || currentUser.role === 'admin';
  const isAgent = currentUser.role === 'agent';

  const initials = (currentUser.full_name || currentUser.email || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const formatMoney = (amount) => {
    return '₦' + Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 });
  };

  const closeSidebar = () => setShowSidebar(false);

  return (
    <div className={`app-shell ${showSidebar ? 'show-sidebar' : ''}`}>
      {/* Sidebar overlay for mobile */}
      <div 
        className="sidebar-overlay" 
        id="sidebarOverlay"
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside className="sidenav" id="sidebar">
        <div className="sidenav-inner">
          {/* Logo */}
          <div className="sidenav-header">
            <div className="sidenav-logo">
              <img src="/img/ofonitech_logo.jpg" alt="OFONiTech Logo" />
            </div>
            <div className="sidenav-brand">
              <span className="brand-main">OFONITECH SOLUTIONZ</span>
              <span className="brand-sub">myninverify.com</span>
            </div>
            <button 
              className="sidebar-close-btn" 
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="sidenav-menu">
            <div className="menu-category">MAIN NAVIGATION</div>

            <Link 
              href="/dashboard" 
              className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-house nav-icon"></i>
              <span>Dashboard</span>
            </Link>

            <div className="menu-category">IDENTITY SERVICES</div>

            <Link 
              href="/verify" 
              className={`nav-item ${pathname.startsWith('/verify') ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-address-card nav-icon"></i>
              <span>NIN Verification</span>
              <span className="badge badge-verify">LIVE</span>
            </Link>

            <Link 
              href="/validation" 
              className={`nav-item ${pathname.startsWith('/validation') ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-shield-halved nav-icon"></i>
              <span>NIN Validation</span>
              <span className="badge badge-verify">LIVE</span>
            </Link>

            <Link 
              href="/personalization" 
              className={`nav-item ${pathname.startsWith('/personalization') ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-id-card-clip nav-icon"></i>
              <span>NIN Personalization</span>
              <span className="badge badge-verify">LIVE</span>
            </Link>

            <Link 
              href="/bvn" 
              className={`nav-item ${pathname.startsWith('/bvn') ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-credit-card nav-icon"></i>
              <span>BVN Verification</span>
              <span className="badge badge-verify">LIVE</span>
            </Link>

            <Link 
              href="/ipe" 
              className={`nav-item ${pathname === '/ipe' ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-passport nav-icon"></i>
              <span>IPE Clearance</span>
            </Link>

            <div className="menu-category">PORTAL SERVICES</div>

            <Link 
              href="/jamb" 
              className={`nav-item ${pathname === '/jamb' ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-graduation-cap nav-icon"></i>
              <span>JAMB Services</span>
            </Link>

            <div className="menu-category">ACCOUNT &amp; WALLET</div>

            <Link 
              href="/fund" 
              className={`nav-item ${pathname === '/fund' ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-wallet nav-icon"></i>
              <span>Fund Wallet</span>
            </Link>

            <Link 
              href="/logs" 
              className={`nav-item ${pathname === '/logs' ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className="fa-solid fa-clock-rotate-left nav-icon"></i>
              <span>Verification Logs</span>
            </Link>

            {isAdmin && (
              <>
                <div className="menu-category">SYSTEM ADMINISTRATION</div>
                <Link 
                  href="/admin" 
                  className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}
                  onClick={closeSidebar}
                >
                  <i className="fa-solid fa-crown nav-icon" style={{ color: '#fbbf24' }}></i>
                  <span>Admin &amp; Agents</span>
                  <span className="badge" style={{ background: '#7c3aed', color: '#fff' }}>ADMIN</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content" id="mainContent">
        {/* Top Header Navbar */}
        <header className="topbar">
          <button 
            className="mobile-toggle-btn" 
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Toggle Navigation"
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          <div className="topbar-search">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" placeholder="Search services..." className="search-input" />
          </div>

          <div className="topbar-actions">
            {/* Wallet Widget */}
            <Link href="/fund" className="topbar-wallet-chip" style={{ textDecoration: 'none' }}>
              <i className="fa-solid fa-wallet" style={{ color: 'var(--primary)' }}></i>
              <div className="wallet-chip-details">
                <span className="wallet-chip-lbl">Balance</span>
                <span className="wallet-chip-val">{formatMoney(currentUser.wallet_balance)}</span>
              </div>
              <div className="wallet-chip-add">
                <i className="fa-solid fa-plus"></i>
              </div>
            </Link>

            {/* Profile Menu Dropdown */}
            <div className="profile-dropdown-container">
              <button className="profile-trigger">
                <div className="avatar avatar-sm avatar-gradient">{initials}</div>
                <div className="profile-info-text">
                  <span className="profile-name">
                    {currentUser.firstname || currentUser.full_name}
                    {isAdmin && (
                      <span className="badge" style={{ background: 'linear-gradient(135deg,#7c3aed,#4c1d95)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '8px', marginLeft: '4px' }}>
                        <i className="fa-solid fa-crown" style={{ color: '#fbbf24' }}></i> Admin
                      </span>
                    )}
                    {!isAdmin && isAgent && (
                      <span className="badge" style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '8px', marginLeft: '4px' }}>
                        <i className="fa-solid fa-user-tie"></i> Agent
                      </span>
                    )}
                  </span>
                  <span className="profile-role">{currentUser.email}</span>
                </div>
              </button>
            </div>

            {/* Logout Button */}
            <button 
              onClick={logout} 
              className="btn btn-outline" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              title="Log Out"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </header>

        {/* Page Body Mount */}
        <main className="page-body" id="page-content">
          {children}
        </main>
      </div>

      {/* Touch Mobile Navigation Bar (5 Touch Tabs) */}
      <nav className="mobile-bottom-nav">
        <Link 
          href="/dashboard" 
          className={`mobile-nav-item ${pathname === '/dashboard' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>
        <Link 
          href="/verify" 
          className={`mobile-nav-item ${pathname.startsWith('/verify') ? 'active' : ''}`}
        >
          <i className="fa-solid fa-address-card"></i>
          <span>NIN</span>
        </Link>
        <Link 
          href="/validation" 
          className={`mobile-nav-item ${pathname.startsWith('/validation') ? 'active' : ''}`}
        >
          <i className="fa-solid fa-shield-halved"></i>
          <span>Validate</span>
        </Link>
        <Link 
          href="/bvn" 
          className={`mobile-nav-item ${pathname.startsWith('/bvn') ? 'active' : ''}`}
        >
          <i className="fa-solid fa-credit-card"></i>
          <span>BVN</span>
        </Link>
        <Link 
          href="/fund" 
          className={`mobile-nav-item ${pathname === '/fund' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-wallet"></i>
          <span>Wallet</span>
        </Link>
      </nav>
    </div>
  );
}
