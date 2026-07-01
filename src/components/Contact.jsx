import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact({ onBackToServices, onBackToHome }) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });

      // Reset success state after a few seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1800);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section 
      id="contact" 
      className="section-padding"
      style={{
        background: 'radial-gradient(ellipse at bottom, var(--bg-grid) 0%, var(--bg-base) 100%)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <div className="container">
        {/* Contact Page Sub-Navigation Bar */}
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
            onClick={onBackToServices}
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
            ← Back to Services
          </button>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
              onClick={onBackToServices}
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
              Services
            </button>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '4px', cursor: 'default' }}>
              Contact
            </span>
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
          <div className="badge badge-glow">Reach Out</div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>
            Contact <span className="gradient-text">Our Team</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px' }}>
            Have queries about an order or need assistance with selecting the perfect gear? Fill out the form below or reach us directly.
          </p>
        </div>

        {/* Contact Content Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            alignItems: 'start'
          }}
          className="contact-grid"
        >
          {/* Left Column: Contact Details */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '32px',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Get In Touch</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '440px' }}>
                We love hearing from our community! Our support specialists typically respond to all inquires within 12-24 hours.
              </p>
            </div>

            {/* Direct Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>

              {/* Channel 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
                <div 
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-secondary)'
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Email Support</span>
                  <a href="mailto:abhishekgowda886166@gmail.com" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>abhishekgowda886166@gmail.com</a>
                </div>
              </div>

              {/* Channel 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
                <div 
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)'
                  }}
                >
                  <Phone size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Call Helpline</span>
                  <a href="tel:7411971579" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>7411971579</a>
                </div>
              </div>

              {/* Channel 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
                <div 
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-secondary)'
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>HQ Showroom</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>Bengaluru, Karnataka, India - 560001</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px' }}>
            {isSubmitted ? (
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '30px 0',
                  gap: '16px',
                  textAlign: 'center'
                }}
              >
                <CheckCircle size={48} style={{ color: 'var(--accent-secondary)' }} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Thank You!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '300px' }}>
                  Your submission has been received. Our team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                  <label htmlFor="name" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name" 
                    className="input-field" 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                  <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com" 
                    className="input-field" 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                  <label htmlFor="message" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Your Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={handleInputChange}
                    placeholder="Describe how we can support you..." 
                    className="input-field"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    marginTop: '8px',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={16} />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr 1.2fr;
            gap: 80px;
          }
        }
      `}</style>
    </section >
  );
}
