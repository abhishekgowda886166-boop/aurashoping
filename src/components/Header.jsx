import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Sun, Moon, Menu, X, LogOut, User } from 'lucide-react';

export default function Header({ 
  cartCount, 
  onCartToggle, 
  theme, 
  onThemeToggle, 
  activeSection,
  page,
  onNavigate,
  user,
  onLogout
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = page === 'home'
    ? [
        { id: 'home', label: 'Home' },
        { id: 'products', label: 'Products' }
      ]
    : [
        { id: 'home', label: 'Home' },
        { id: 'products', label: 'Products' },
        { id: 'services', label: 'Services' },
        { id: 'contact', label: 'Contact' }
      ];

  const handleNavClick = (id) => {
    setIsMobileMenuOpen(false);
    if (id === 'home' || id === 'products' || id === 'services' || id === 'contact') {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (page !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: isScrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        background: isScrolled ? 'var(--bg-surface)' : 'transparent',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'all var(--transition-normal)'
      }}
    >
      <div 
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}
      >
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ 
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontSize: '1.5rem',
            fontWeight: 800,
            userSelect: 'none'
          }}
        >
          {/* Custom Animated Brand Icon SVG */}
          <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg 
              width="36" 
              height="36" 
              viewBox="0 0 36 36" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.4))'
              }}
            >
              <defs>
                <linearGradient id="logo-grad-primary" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--accent-primary)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>

              {/* Main Core Hexagon Shape */}
              <polygon 
                points="18,3 32,11 32,25 18,33 4,25 4,11" 
                stroke="url(#logo-grad-primary)" 
                strokeWidth="2.5" 
                strokeLinejoin="round"
                fill="rgba(255, 255, 255, 0.03)"
              />
              
              {/* Inner Glowing Triangle representing AURA logo mark */}
              <path 
                d="M18 9 L26 24 L10 24 Z" 
                fill="url(#logo-grad-primary)" 
                style={{ opacity: 0.15 }}
              />
              
              <path 
                d="M18 9 L26 24 M18 9 L10 24" 
                stroke="url(#logo-grad-primary)" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <line 
                x1="13" 
                y1="19" 
                x2="23" 
                y2="19" 
                stroke="url(#logo-grad-primary)" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
              
              {/* Glowing core sphere */}
              <circle 
                cx="18" 
                cy="18" 
                r="3.5" 
                fill="#ffffff" 
                style={{
                  filter: 'drop-shadow(0 0 4px var(--accent-primary))'
                }}
              />
            </svg>
            
            {/* Spinning Aura Orbit Overlay */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '1px dashed var(--accent-secondary)',
                opacity: 0.5,
                animation: 'spin 12s linear infinite'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: '2px', alignItems: 'flex-start' }}>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.05em' }}>AURA</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.25em' }}>SHOP</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav 
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav-container"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeSection === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'color var(--transition-fast)',
                position: 'relative',
                padding: '6px 0'
              }}
            >
              {item.label}
              {activeSection === item.id && (
                <span 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'var(--accent-gradient)',
                    borderRadius: '2px'
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Toggle */}
          <button 
            onClick={onThemeToggle} 
            className="btn-icon"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart Icon Trigger */}
          <button 
            onClick={onCartToggle} 
            className="btn-icon"
            style={{ position: 'relative' }}
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span 
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile / Auth Button */}
          {user ? (
            <div ref={profileRef} style={{ position: 'relative' }}>
              {/* Avatar Button */}
              <button
                onClick={() => setShowProfile(prev => !prev)}
                aria-label="User Profile"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  border: '2px solid var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  boxShadow: showProfile ? '0 0 12px var(--accent-primary)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {user.charAt(0).toUpperCase()}
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '240px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-surface-solid)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                    zIndex: 200,
                    overflow: 'hidden',
                    animation: 'slideDown 0.2s ease-out'
                  }}
                >
                  {/* Avatar + Name Header */}
                  <div
                    style={{
                      padding: '20px',
                      background: 'var(--bg-surface-hover)',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: 'var(--accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        flexShrink: 0,
                        boxShadow: '0 0 10px rgba(34,211,238,0.3)'
                      }}
                    >
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {user}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        AuraShop Member
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem'
                      }}
                    >
                      <User size={15} style={{ color: 'var(--accent-primary)' }} />
                      <span>Signed in as <strong style={{ color: 'var(--text-primary)' }}>@{user}</strong></span>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfile(false);
                        onLogout();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px' }}
            >
              Login
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="btn-icon mobile-menu-toggle"
            style={{ display: 'none' }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '84px',
            left: '24px',
            right: '24px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 40,
            borderRadius: '16px',
            border: '1px solid var(--border-color)'
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeSection === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '1.1rem',
                fontWeight: 600,
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                backgroundColor: activeSection === item.id ? 'var(--bg-surface)' : 'transparent'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* CSS styling injections for Desktop responsive queries */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav-container {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
