import React from 'react';
import { Truck, ShieldAlert, Headphones, RotateCcw } from 'lucide-react';

const SERVICES_DATA = [
  {
    id: 1,
    icon: <Truck size={32} style={{ color: 'var(--accent-secondary)' }} />,
    title: 'Free Express Delivery',
    description: 'Get your orders delivered to your doorstep within 2-3 business days absolutely free for orders over $99.'
  },
  {
    id: 2,
    icon: <ShieldAlert size={32} style={{ color: 'var(--accent-primary)' }} />,
    title: 'Secure Payments',
    description: 'Every transaction is encrypted and secured by banking-grade online checkout modules.'
  },
  {
    id: 3,
    icon: <Headphones size={32} style={{ color: 'var(--accent-secondary)' }} />,
    title: '24/7 Live Support',
    description: 'Our dedicated customer success representatives are always available to help solve any shopping issue.'
  },
  {
    id: 4,
    icon: <RotateCcw size={32} style={{ color: 'var(--accent-primary)' }} />,
    title: '30-Day Hassle Returns',
    description: 'No questions asked. Return your purchased item within 30 days for a quick, uncomplicated refund.'
  }
];

export default function Services({ onBackToProducts, onBackToHome, onNavigateToContact }) {
  return (
    <section 
      id="services" 
      className="section-padding"
      style={{
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div className="container">
        {/* Services Page Sub-Navigation Bar */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 24px', 
            borderRadius: '14px', 
            marginBottom: '40px',
            background: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-color)'
          }}
        >
          <button 
            onClick={onBackToProducts}
            className="btn btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Back to Products
          </button>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
              onClick={onBackToProducts}
              className="btn-link"
              style={{ 
                background: 'none', 
                border: 'none', 
                fontWeight: 500, 
                color: 'var(--text-secondary)', 
                cursor: 'pointer',
                fontSize: '0.95rem',
                padding: '0 4px',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Products
            </button>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '4px', cursor: 'default' }}>
              Services
            </span>
            <button 
              onClick={onNavigateToContact}
              className="btn-link"
              style={{ 
                background: 'none', 
                border: 'none', 
                fontWeight: 500, 
                color: 'var(--text-secondary)', 
                cursor: 'pointer',
                fontSize: '0.95rem',
                padding: '0 4px',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Contact →
            </button>
          </div>
        </div>

        {/* Header */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '56px',
            gap: '12px'
          }}
        >
          <div className="badge badge-glow">Experience</div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>
            Premium <span className="gradient-text">Services</span> We Offer
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px' }}>
            We prioritize quality and customer convenience. Discover why shoppers worldwide choose us for their luxury tech acquisitions.
          </p>
        </div>

        {/* Services Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}
        >
          {SERVICES_DATA.map(service => (
            <div 
              key={service.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '40px 32px',
                borderRadius: '20px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              {/* Icon Container */}
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--glass-shadow)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {service.icon}
              </div>

              {/* Title & Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {service.title}
                </h3>
                <p 
                  style={{ 
                    fontSize: '0.925rem', 
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6
                  }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
