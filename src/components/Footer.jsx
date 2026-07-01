import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-surface-solid)',
        padding: '40px 0',
        width: '100%'
      }}
    >
      <div 
        className="container footer-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand info */}
        <div 
          onClick={scrollToTop}
          style={{ 
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '1.25rem',
            fontWeight: 800
          }}
        >
          <ShoppingBag style={{ color: 'var(--accent-primary)' }} size={22} />
          <span className="gradient-text">AURA</span>
          <span style={{ fontWeight: 400 }}>SHOP</span>
        </div>

        {/* Links & Copyright */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} AuraShop. All rights reserved. Crafted for visual excellence.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color var(--transition-fast)' }} className="footer-link">Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color var(--transition-fast)' }} className="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-content {
          display: flex;
          flex-direction: column;
          alignItems: center;
          gap: 20px;
        }
        @media (min-width: 769px) {
          .footer-content {
            flex-direction: row !important;
            justify-content: space-between !important;
          }
        }
        .footer-link:hover {
          color: var(--accent-primary) !important;
        }
      `}</style>
    </footer>
  );
}
