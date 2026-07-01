import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero({ onGetStarted }) {
  const handleGetStartedClick = () => {
    onGetStarted();
  };

  return (
    <section 
      id="home" 
      className="container flex-center hero-section"
      style={{
        minHeight: 'calc(100vh - 80px)',
        padding: '60px 0 80px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px'
      }}
    >
      {/* Centered Content */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '24px'
        }}
      >
        {/* Glow Badge */}
        <div 
          className="badge badge-glow"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            animation: 'pulse 3s infinite'
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
          <span>New Collection 2026</span>
        </div>

        {/* Hero Title */}
        <h1 
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em'
          }}
        >
          Welcome to <span className="gradient-text">Aura Shop</span>
        </h1>

        {/* Hero Description */}
        <p 
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            lineHeight: 1.6
          }}
        >
          Next-Gen Style For Your Lifestyle. Explore our handpicked curation of ultra-premium electronics, accessories, and gear designed to power your everyday life with style and efficiency.
        </p>

        {/* Hero Actions */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            width: '100%',
            marginTop: '8px'
          }}
        >
          <button 
            onClick={handleGetStartedClick}
            className="btn btn-primary"
            style={{ fontSize: '1.05rem', padding: '14px 32px' }}
          >
            Get Started
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Highlights */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            marginTop: '16px',
            flexWrap: 'wrap',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-secondary)' }} />
            <span>2-Year Warranty</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-secondary)' }} />
            <span>Free Express Delivery</span>
          </div>
        </div>
      </div>

      {/* Premium Asset Preview below the text */}
      <div 
        className="flex-center"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          minHeight: '320px'
        }}
      >
        {/* Ambient background glow orb behind the image */}
        <div 
          style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            background: 'var(--accent-gradient)',
            filter: 'blur(80px)',
            opacity: 0.25,
            zIndex: 1,
            borderRadius: '50%'
          }}
        />

        {/* Floating Glassmorphic Image Container */}
        <div 
          className="glass-panel animate-float"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            aspectRatio: '1/1',
            padding: '24px',
            overflow: 'hidden',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img 
            src="/smartwatch.png" 
            alt="Flagship Smartwatch" 
            style={{
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              borderRadius: '16px',
              transition: 'transform var(--transition-slow)'
            }}
            className="hero-image"
          />
          
          {/* Quick Floating Badge */}
          <div 
            className="glass-panel"
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              padding: '10px 16px',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              border: '1px solid var(--border-color)',
              gap: '2px'
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Aura Watch Pro</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>$249.00</span>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding: 60px 24px;
        }
        .hero-image:hover {
          transform: scale(1.08) rotate(3deg);
        }
      `}</style>
    </section>
  );
}
