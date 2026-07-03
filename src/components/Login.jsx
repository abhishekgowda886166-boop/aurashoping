import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, LogIn, UserPlus, ShieldCheck, RefreshCw } from 'lucide-react';

// Generates a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export default function Login({ onLoginSuccess, onBackToHome }) {
  /* ──────── STEP STATE ──────── */
  // 'form' | 'otp' | 'success'
  const [step, setStep] = useState('form');
  const [isSignUp, setIsSignUp] = useState(false);

  /* ──────── FORM FIELDS ──────── */
  const [showPassword, setShowPassword] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [signUpName, setSignUpName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  /* ──────── OTP STATE ──────── */
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [pendingUsername, setPendingUsername] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef([]);

  /* ──────── GLOBAL ──────── */
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ──── Countdown timer for resend ──── */
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  /* ──── Load saved user login input if Remember Me was checked ──── */
  useEffect(() => {
    const savedRemember = localStorage.getItem('aura_remember_me') === 'true';
    if (savedRemember) {
      setRememberMe(true);
      const savedInput = localStorage.getItem('aura_remember_login_input');
      if (savedInput) {
        setLoginInput(savedInput);
      }
    }
  }, []);

  /* ──── Helpers ──── */
  const launchOtp = (username) => {
    const otp = generateOTP();
    setGeneratedOtp(otp);
    setPendingUsername(username);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setResendCountdown(30);
    setStep('otp');
    // Auto-focus first box
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  /* ──── Form Submit handlers ──── */
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!loginInput || !loginPassword) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const username = loginInput.split('@')[0];
      launchOtp(username);
    }, 800);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!signUpName || !signUpUsername || !signUpEmail || !signUpPhone || !signUpPassword) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      launchOtp(signUpUsername);
    }, 800);
  };

  /* ──── OTP digit change with auto-advance ──── */
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    setOtpError('');
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    // Allow paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) return;
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) updated[i] = pasted[i] || '';
    setOtpDigits(updated);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOtp = () => {
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter the complete 6-digit OTP.');
      return;
    }
    if (entered !== generatedOtp) {
      setOtpError('Incorrect OTP. Please try again.');
      // Shake the boxes
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
      return;
    }
    if (!isSignUp) {
      if (rememberMe) {
        localStorage.setItem('aura_remember_me', 'true');
        localStorage.setItem('aura_remember_login_input', loginInput);
      } else {
        localStorage.removeItem('aura_remember_me');
        localStorage.removeItem('aura_remember_login_input');
      }
    }
    setStep('success');
    setTimeout(() => onLoginSuccess(pendingUsername), 1500);
  };

  const handleResend = () => {
    const otp = generateOTP();
    setGeneratedOtp(otp);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setResendCountdown(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <section
      style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(34,211,238,0.06) 0%, var(--bg-base) 70%)'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px 28px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: 'var(--glass-shadow)',
          background: 'var(--bg-surface-solid)',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}
      >

        {/* ══════ STEP: OTP ══════ */}
        {step === 'otp' && (
          <>
            {/* Icon */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(34,211,238,0.12)', border: '2px solid var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldCheck size={26} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                  Verify <span className="gradient-text">OTP</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
                  A 6-digit code has been sent to confirm your account.
                </p>
              </div>
            </div>

            {/* Demo OTP Banner */}
            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(34,211,238,0.07)',
              border: '1px dashed var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <ShieldCheck size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
                Demo OTP: <strong style={{ color: 'var(--accent-secondary)', letterSpacing: '0.2em', fontSize: '1rem' }}>{generatedOtp}</strong>
              </span>
            </div>

            {/* OTP Error */}
            {otpError && (
              <div style={{
                padding: '8px 12px', borderRadius: '8px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', fontSize: '0.82rem', fontWeight: 500, textAlign: 'left'
              }}>
                {otpError}
              </div>
            )}

            {/* 6 Digit Boxes */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  onPaste={i === 0 ? handleOtpPaste : undefined}
                  style={{
                    width: '48px',
                    height: '56px',
                    borderRadius: '12px',
                    border: `2px solid ${digit ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    background: digit ? 'rgba(34,211,238,0.08)' : 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.15s',
                    boxShadow: digit ? '0 0 8px rgba(34,211,238,0.2)' : 'none'
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600 }}
            >
              <ShieldCheck size={16} />
              Verify & Continue
            </button>

            {/* Resend */}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {resendCountdown > 0 ? (
                <span>Resend OTP in <strong style={{ color: 'var(--accent-primary)' }}>{resendCountdown}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--accent-primary)', fontWeight: 600,
                    cursor: 'pointer', padding: 0,
                    display: 'inline-flex', alignItems: 'center', gap: '5px'
                  }}
                >
                  <RefreshCw size={13} /> Resend OTP
                </button>
              )}
            </div>

            {/* Back link */}
            <button
              type="button"
              onClick={() => setStep('form')}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                textDecoration: 'underline', padding: 0, fontSize: '0.82rem'
              }}
            >
              ← Back to {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </>
        )}

        {/* ══════ STEP: SUCCESS ══════ */}
        {step === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '12px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(34,211,238,0.12)', border: '2px solid var(--accent-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShieldCheck size={32} style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">
              Verified!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Account confirmed. Signing you in...
            </p>
            {/* Spinner */}
            <div style={{
              width: '28px', height: '28px',
              border: '3px solid var(--border-color)',
              borderTop: '3px solid var(--accent-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        )}

        {/* ══════ STEP: FORM ══════ */}
        {step === 'form' && (
          <>
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                {isSignUp ? 'Create ' : 'Sign '}
                <span className="gradient-text">{isSignUp ? 'Account' : 'In'}</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {isSignUp
                  ? 'Join AuraShop. An OTP will be sent to confirm your account.'
                  : 'Welcome back! Verification OTP will be sent after login.'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444', fontSize: '0.85rem', fontWeight: 500, textAlign: 'left'
              }}>
                {error}
              </div>
            )}

            {/* ── Login Form ── */}
            {!isSignUp ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                {/* Username / Email / Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Username, Email or Phone
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={loginInput}
                      onChange={e => setLoginInput(e.target.value)}
                      placeholder="Enter username, email or phone"
                      className="input-field"
                      style={{ paddingLeft: '40px' }}
                      disabled={loading}
                    />
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input-field"
                      style={{ paddingLeft: '40px', paddingRight: '40px' }}
                      disabled={loading}
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    disabled={loading}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      accentColor: 'var(--accent-primary)',
                      cursor: 'pointer'
                    }}
                  />
                  <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                    Remember me on this device
                  </label>
                </div>

                <button type="submit" className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : <><LogIn size={16} /> Sign In & Get OTP</>}
                </button>
              </form>
            ) : (
              /* ── Sign Up Form ── */
              <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                {[
                  { label: 'Full Name', value: signUpName, setter: setSignUpName, type: 'text', placeholder: 'Your full name', Icon: User },
                  { label: 'Username', value: signUpUsername, setter: setSignUpUsername, type: 'text', placeholder: 'Choose a username', Icon: User },
                  { label: 'Email Address', value: signUpEmail, setter: setSignUpEmail, type: 'email', placeholder: 'Enter email address', Icon: Mail },
                  { label: 'Phone Number', value: signUpPhone, setter: setSignUpPhone, type: 'tel', placeholder: 'Enter phone number', Icon: Phone },
                ].map(({ label, value, setter, type, placeholder, Icon }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      {label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={type}
                        value={value}
                        onChange={e => setter(e.target.value)}
                        placeholder={placeholder}
                        className="input-field"
                        style={{ paddingLeft: '40px' }}
                        disabled={loading}
                      />
                      <Icon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                ))}

                {/* Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={e => setSignUpPassword(e.target.value)}
                      placeholder="Choose a password"
                      className="input-field"
                      style={{ paddingLeft: '40px', paddingRight: '40px' }}
                      disabled={loading}
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : <><UserPlus size={16} /> Create Account & Get OTP</>}
                </button>
              </form>
            )}

            {/* Footer Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button type="button"
                  onClick={() => { setError(''); setIsSignUp(!isSignUp); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  disabled={loading}
                >
                  {isSignUp ? 'Sign In' : 'Create New Account'}
                </button>
              </span>

              <button type="button" onClick={onBackToHome}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', padding: 0, alignSelf: 'center', marginTop: '4px' }}
                disabled={loading}
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </section>
  );
}
