import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Edit3, Save, Award, Calendar,
  ShoppingBag, CheckCircle, Gift, ArrowRight, ShieldCheck,
  Clock, Compass, Sparkles, RefreshCw, X, ChevronRight, Download, Printer
} from 'lucide-react';

export default function UserProfile({ user, orderHistory, loyaltyPoints, setLoyaltyPoints, onNavigate, profilePic, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders, loyalty
  const [isEditing, setIsEditing] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = localStorage.getItem('aura_user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      return { profilePic: null, ...parsed };
    }
    return {
      fullName: user || 'Aura Guest Member',
      email: 'member@aurashop.com',
      phone: '9876543210',
      addressLine: '123 Cosmic Residency, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      profilePic: null
    };
  });

  const [editForm, setEditForm] = useState({ ...profileData });
  const [formErrors, setFormErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setEditForm(prev => ({ ...prev, profilePic: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setEditForm(prev => ({ ...prev, profilePic: null }));
  };

  // Spin Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [wheelAngle, setWheelAngle] = useState(0);

  // Daily Checkin state
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // Redemptions State
  const [redeemedVouchers, setRedeemedVouchers] = useState(() => {
    const savedVouchers = localStorage.getItem('aura_redeemed_vouchers');
    return savedVouchers ? JSON.parse(savedVouchers) : [];
  });

  // Receipt popup state
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isFullscreenPicOpen, setIsFullscreenPicOpen] = useState(false);

  // Save profile edits
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const errors = {};
    if (!editForm.fullName.trim()) errors.fullName = 'Name is required';
    if (!editForm.email.includes('@')) errors.email = 'Valid email is required';
    if (editForm.phone.length < 10) errors.phone = 'Valid phone is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setProfileData(editForm);
    localStorage.setItem('aura_user_profile', JSON.stringify(editForm));
    setIsEditing(false);
    setFormErrors({});
    if (onProfileUpdate) {
      onProfileUpdate(editForm);
    }
  };

  // Sync redeemed vouchers to local storage
  useEffect(() => {
    localStorage.setItem('aura_redeemed_vouchers', JSON.stringify(redeemedVouchers));
  }, [redeemedVouchers]);

  // Points Hub calculations
  const getPointsTier = () => {
    if (loyaltyPoints >= 1500) return { name: 'Gold Elite', class: 'tier-gold', discount: '15% Off Storewide' };
    if (loyaltyPoints >= 500) return { name: 'Silver Member', class: 'tier-silver', discount: '10% Off Storewide' };
    return { name: 'Bronze Explorer', class: 'tier-bronze', discount: '5% Off Storewide' };
  };

  const currentTier = getPointsTier();
  const nextTierPoints = loyaltyPoints >= 1500 ? 1500 : loyaltyPoints >= 500 ? 1500 : 500;
  const progressPercent = Math.min((loyaltyPoints / nextTierPoints) * 100, 100);

  // Lucky Points spin execution
  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const sectors = [50, 100, 75, 150, 50, 200, 100, 120];
    const targetSectorIdx = Math.floor(Math.random() * sectors.length);
    const addedPoints = sectors[targetSectorIdx];

    // Calculate angle: 360 degrees / sectors length = 45 degrees per sector.
    // Add extra spins (e.g. 5 full rotations = 1800 degrees) to simulate spinning momentum
    const newAngle = wheelAngle + 1800 + (360 - (targetSectorIdx * 45));
    setWheelAngle(newAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(addedPoints);
      setLoyaltyPoints(p => p + addedPoints);
    }, 4000);
  };

  const handleDailyCheckIn = () => {
    if (hasCheckedIn) return;
    setHasCheckedIn(true);
    setLoyaltyPoints(p => p + 50);
  };

  // Redeem vouchers
  const redeemVoucher = (cost, label, codePrefix) => {
    if (loyaltyPoints < cost) return;
    setLoyaltyPoints(p => p - cost);
    const generatedCode = codePrefix + '-' + Math.floor(1000 + Math.random() * 9000);
    const newVoucher = {
      code: generatedCode,
      reward: label,
      date: new Date().toLocaleDateString()
    };
    setRedeemedVouchers(prev => [newVoucher, ...prev]);
  };

  return (
    <div className="profile-dashboard-container">
      {/* Background orbs */}
      <div className="bg-ambient">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      <div className="container" style={{ paddingBottom: '80px', paddingTop: '40px' }}>

        {/* Dashboard Title Header */}
        <div className="dashboard-header glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div 
              className={`avatar-badge ${currentTier.class}`}
              onClick={() => { if (profilePic) setIsFullscreenPicOpen(true); }}
              title={profilePic ? "Click to view full screen" : undefined}
              style={{
                background: profilePic ? `url(${profilePic}) center/cover no-repeat` : undefined,
                overflow: 'hidden',
                cursor: profilePic ? 'pointer' : 'default',
                transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
              }}
              onMouseEnter={e => { if (profilePic) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)'; } }}
              onMouseLeave={e => { if (profilePic) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; } }}
            >
              {!profilePic && profileData.fullName.charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <h1 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                {profileData.fullName}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Award size={15} style={{ color: 'var(--accent-secondary)' }} />
                <span>Loyalty Tier: <strong className={currentTier.class}>{currentTier.name}</strong></span>
              </p>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="stepper-wrapper dashboard-tabs" style={{ padding: '4px', margin: 0, gap: '6px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(0,0,0,0.1)' }}>
            {[
              { id: 'profile', label: 'My Profile', icon: <User size={15} /> },
              { id: 'orders', label: 'Order History', icon: <ShoppingBag size={15} /> },
              { id: 'loyalty', label: 'Loyalty Hub', icon: <Award size={15} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`dashboard-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="step-body-grid">

            {/* Left Box: Information Summary Card */}
            <div className="form-column">
              <div className="glass-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account Specifications</h3>
                  {!isEditing && (
                    <button
                      onClick={() => {
                        setEditForm({ ...profileData, profilePic });
                        setIsEditing(true);
                      }}
                      className="btn btn-secondary flex-center"
                      style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '8px', display: 'flex', gap: '6px' }}
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="profile-detail-rows" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="detail-item">
                      <div className="detail-icon"><User size={16} /></div>
                      <div className="detail-lbl-val">
                        <span className="lbl">Full Name</span>
                        <span className="val">{profileData.fullName}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-icon"><Mail size={16} /></div>
                      <div className="detail-lbl-val">
                        <span className="lbl">Email Address</span>
                        <span className="val">{profileData.email}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-icon"><Phone size={16} /></div>
                      <div className="detail-lbl-val">
                        <span className="lbl">Phone Number</span>
                        <span className="val">+91 {profileData.phone}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-icon"><MapPin size={16} /></div>
                      <div className="detail-lbl-val">
                        <span className="lbl">Default Delivery Destination</span>
                        <span className="val">
                          {profileData.addressLine}, {profileData.city}, {profileData.state} - {profileData.zipCode}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="wizard-form">
                    {/* PROFILE PICTURE PICKER GROUP */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                      <div 
                        className={`avatar-badge ${currentTier.class}`}
                        style={{
                          background: editForm.profilePic ? `url(${editForm.profilePic}) center/cover no-repeat` : undefined,
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {!editForm.profilePic && editForm.fullName.charAt(0).toUpperCase()}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Profile Photo</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <label 
                            htmlFor="profile-pic-uploader"
                            className="btn btn-secondary flex-center"
                            style={{ 
                              padding: '6px 12px', 
                              borderRadius: '8px', 
                              fontSize: '0.75rem', 
                              cursor: 'pointer',
                              display: 'inline-flex',
                              gap: '6px',
                              fontWeight: 600,
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            Upload Photo
                          </label>
                          <input 
                            type="file"
                            id="profile-pic-uploader"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                          />
                          {editForm.profilePic && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="btn flex-center"
                              style={{ 
                                padding: '6px 12px', 
                                borderRadius: '8px', 
                                fontSize: '0.75rem', 
                                color: '#ef4444',
                                background: 'transparent',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                fontWeight: 600
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                        className={`wizard-input ${formErrors.fullName ? 'error' : ''}`}
                      />
                      {formErrors.fullName && <span className="input-error">{formErrors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        className={`wizard-input ${formErrors.email ? 'error' : ''}`}
                      />
                      {formErrors.email && <span className="input-error">{formErrors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className={`wizard-input ${formErrors.phone ? 'error' : ''}`}
                        maxLength={10}
                      />
                      {formErrors.phone && <span className="input-error">{formErrors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        value={editForm.addressLine}
                        onChange={e => setEditForm({ ...editForm, addressLine: e.target.value })}
                        className="wizard-input"
                      />
                    </div>

                    <div className="input-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                          className="wizard-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          value={editForm.state}
                          onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                          className="wizard-input"
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ width: '50%' }}>
                      <label>ZIP / PIN Code</label>
                      <input
                        type="text"
                        value={editForm.zipCode}
                        onChange={e => setEditForm({ ...editForm, zipCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                        className="wizard-input"
                        maxLength={6}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn btn-secondary"
                        style={{ padding: '10px 20px', borderRadius: '10px' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-center"
                        style={{ padding: '10px 24px', borderRadius: '10px', display: 'flex', gap: '6px' }}
                      >
                        <Save size={14} /> Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Box: Tier specs & Rewards preview */}
            <div className="summary-column">
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>Aura Club Privileges</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Exclusive rewards linked to your tier status</p>
                </div>

                <div className={`glass-panel tier-privilege-card ${currentTier.class}`} style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <Award size={32} style={{ flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontWeight: 800 }}>{currentTier.name} Perks</h4>
                    <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>✓ Access to {currentTier.discount} store voucher</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>✓ 1x Points multiplier on every purchase</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>✓ Priority packaging on orders</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Account Status</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Loyalty Tier Status</span>
                      <strong className={currentTier.class}>{currentTier.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>AURA Point Balance</span>
                      <strong style={{ color: 'var(--accent-secondary)' }}>{loyaltyPoints} Points</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Joined Aura Date</span>
                      <strong>{new Date().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('loyalty')}
                  className="btn btn-primary flex-center"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '0.9rem' }}
                >
                  Explore Points & Rewards <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ORDER HISTORY TAB */}
        {activeTab === 'orders' && (
          <div className="receipt-column">
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                <ShoppingBag size={22} style={{ color: 'var(--accent-secondary)' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Your Purchases History</h3>
              </div>

              {orderHistory.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} strokeWidth={1.5} style={{ marginBottom: '16px' }} />
                  <p style={{ fontSize: '1rem', marginBottom: '12px' }}>You haven't placed any orders yet.</p>
                  <button
                    onClick={() => onNavigate('products')}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', borderRadius: '10px', fontSize: '0.9rem' }}
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="order-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orderHistory.map((order, idx) => (
                    <div key={order.id || idx} className="glass-panel order-history-card">
                      <div className="order-card-header">
                        <div className="header-meta">
                          <span className="order-id">{order.id}</span>
                          <span className="order-date"><Calendar size={12} /> {order.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span className="badge badge-glow" style={{ fontSize: '0.75rem', padding: '2px 8px', background: order.status === 'Delivered' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(99, 102, 241, 0.1)', color: order.status === 'Delivered' ? 'var(--accent-secondary)' : 'var(--accent-primary)', border: order.status === 'Delivered' ? '1px solid rgba(34, 211, 238, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)' }}>
                            {order.status}
                          </span>
                          <span className="order-price">₹{order.amount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="order-card-body">
                        {/* Items preview */}
                        <div className="order-items-grid">
                          {order.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="order-item-chip">
                              <img src={item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150'} alt={item.name} className="item-chip-img" />
                              <div style={{ textAlign: 'left' }}>
                                <p className="item-name">{item.name}</p>
                                 <p className="item-qty">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order action triggers */}
                        <div className="order-card-actions">
                          <button
                            onClick={() => setSelectedReceipt(order)}
                            className="btn btn-secondary flex-center"
                            style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px', display: 'flex', gap: '6px' }}
                          >
                            <Download size={13} /> View Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOYALTY POINTS PROGRAM TAB */}
        {activeTab === 'loyalty' && (
          <div className="step-body-grid">

            {/* Left Box: Points Spinner & daily claims */}
            <div className="form-column">

              {/* POINTS GRAPHIC STATUS */}
              <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Aura Loyalty Point Statement</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Check back daily and spin to collect points</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-secondary)' }}>{loyaltyPoints}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total points balance</span>
                  </div>
                </div>

                {/* Progress bar to next level */}
                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span>Progress to next tier (Target: {nextTierPoints} pts)</span>
                    <span>{progressPercent.toFixed(0)}%</span>
                  </div>
                  <div className="tracker-trail" style={{ position: 'relative', top: 0, left: 0, width: '100%', height: '8px', borderRadius: '4px', background: 'var(--border-color)', overflow: 'hidden' }}>
                    <div className="tracker-trail-fill" style={{ width: `${progressPercent}%`, height: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    <span>Bronze Explorer (0 pts)</span>
                    <span>Silver Member (500 pts)</span>
                    <span>Gold Elite (1500+ pts)</span>
                  </div>
                </div>

                {/* Dynamic rewards boost statement */}
                <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '12px', marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Award size={20} className={currentTier.class} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    You are in the <strong className={currentTier.class}>{currentTier.name}</strong> tier. You receive a simulated <strong style={{ color: 'var(--text-primary)' }}>{currentTier.discount}</strong> storewide benefit!
                  </span>
                </div>
              </div>

              {/* POINTS EARNER WORKSHOPS */}
              <div className="glass-panel" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', textAlign: 'left' }}>Collect Free Points</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

                  {/* Earn Option 1: Daily Checkin */}
                  <div className="glass-panel flex-center" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', textAlign: 'left' }}>
                      <Calendar size={24} style={{ color: 'var(--accent-primary)' }} />
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Daily Attendance Claim</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Get +50 Points instantly once per day</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDailyCheckIn}
                      disabled={hasCheckedIn}
                      className={`btn ${hasCheckedIn ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ fontSize: '0.8rem', padding: '10px 20px', borderRadius: '8px' }}
                    >
                      {hasCheckedIn ? 'Claimed ✓' : 'Claim points'}
                    </button>
                  </div>

                  {/* Earn Option 2: Lucky Wheel spinner */}
                  <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', textAlign: 'center' }}>
                    <div style={{ textAlign: 'left', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <Compass size={22} style={{ color: 'var(--accent-secondary)' }} />
                      <div>
                        <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>Interactive Lucky Aura Wheel</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Spin the radial wheel to win random points rewards (50 - 200 pts)</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', margin: '20px 0' }}>
                      {/* CSS Spinning Wheel */}
                      <div className="wheel-holder">
                        <div
                          className="wheel-spinner"
                          style={{
                            transform: `rotate(${wheelAngle}deg)`,
                            transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0.8, 0.25, 1)' : 'none'
                          }}
                        >
                          <div className="wheel-segment border-1"><span>50</span></div>
                          <div className="wheel-segment border-2"><span>100</span></div>
                          <div className="wheel-segment border-3"><span>75</span></div>
                          <div className="wheel-segment border-4"><span>150</span></div>
                          <div className="wheel-segment border-5"><span>50</span></div>
                          <div className="wheel-segment border-6"><span>200</span></div>
                          <div className="wheel-segment border-7"><span>100</span></div>
                          <div className="wheel-segment border-8"><span>120</span></div>
                          <div className="wheel-center-pin" />
                        </div>
                        <div className="wheel-arrow-indicator" />
                      </div>

                      <div style={{ minHeight: '32px' }}>
                        {isSpinning && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)', fontSize: '0.85rem' }}>
                            <RefreshCw className="spin-h" size={14} />
                            <span>Wheeling... Selecting point multipliers...</span>
                          </div>
                        )}
                        {spinResult !== null && (
                          <div className="shake-anim" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                            🎉 Congratulations! You won +{spinResult} Aura Points!
                          </div>
                        )}
                      </div>

                      <button
                        onClick={spinWheel}
                        disabled={isSpinning}
                        className="btn btn-primary"
                        style={{ padding: '10px 24px', borderRadius: '10px', fontSize: '0.9rem', width: '100%', maxWidth: '200px' }}
                      >
                        Spin Aura Wheel
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Box: Redemption Voucher store */}
            <div className="summary-column">
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Gift size={18} style={{ color: 'var(--accent-primary)' }} /> Redeems Rewards Center
                </h3>

                {/* Redeem Items list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
                  {[
                    { cost: 200, label: '₹500 Shop Voucher', desc: 'Valid on all orders', prefix: 'AURA-DISC5' },
                    { cost: 150, label: 'Free Shipping Coupon', desc: 'Saves shipping costs', prefix: 'AURA-SHIP' },
                    { cost: 600, label: 'Aura Premium Gift Box', desc: 'Mystery elite surprise', prefix: 'AURA-BOX' }
                  ].map((reward, rewardIdx) => (
                    <div key={rewardIdx} className="glass-panel flex-center" style={{ padding: '14px', background: 'var(--bg-surface-hover)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800 }}>{reward.label}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{reward.desc}</p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600, display: 'block', marginTop: '4px' }}>
                          Cost: {reward.cost} pts
                        </span>
                      </div>
                      <button
                        onClick={() => redeemVoucher(reward.cost, reward.label, reward.prefix)}
                        disabled={loyaltyPoints < reward.cost}
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '6px' }}
                      >
                        Redeem
                      </button>
                    </div>
                  ))}
                </div>

                {/* List of Redeemed vouchers */}
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Your Claimed Coupons ({redeemedVouchers.length})
                  </h4>
                  {redeemedVouchers.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No vouchers redeemed yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                      {redeemedVouchers.map((voucher, vIdx) => (
                        <div key={vIdx} className="glass-panel" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', background: 'rgba(255,255,255,0.01)' }}>
                          <div>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{voucher.reward}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Claimed {voucher.date}</span>
                          </div>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, background: 'var(--accent-glow)', color: 'var(--accent-secondary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(34,211,238,0.2)' }}>
                            {voucher.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* DETAIL RECEIPT / INVOICE INLINE DIALOG POPUP */}
      {selectedReceipt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          {/* Backdrop */}
          <div onClick={() => setSelectedReceipt(null)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />

          {/* Box Panel */}
          <div className="glass-panel scrollbar-styled" style={{ position: 'relative', zIndex: 1010, width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-surface-solid)', padding: '28px', border: '1px solid var(--border-color)', borderRadius: '20px' }}>

            {/* Close Button */}
            <button
              onClick={() => setSelectedReceipt(null)}
              className="btn-icon"
              style={{ position: 'absolute', top: '16px', right: '16px', width: '30px', height: '30px' }}
            >
              <X size={14} />
            </button>

            {/* Receipt Content */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="18,3 32,11 32,25 18,33 4,25 4,11" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
                      <path d="M18 9 L26 24 L10 24 Z" fill="var(--accent-primary)" style={{ opacity: 0.3 }} />
                    </svg>
                    AURA SHOP
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transaction Invoice Statement</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="receipt-tag">PAID RECEIPT</span>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '4px' }}>{selectedReceipt.id}</p>
                </div>
              </div>

              {/* Order Meta details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '4px' }}>Recipient Account</p>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{profileData.fullName}</p>
                  <p>{profileData.addressLine}</p>
                  <p>{profileData.city}, {profileData.state} - {profileData.zipCode}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '4px' }}>Billing Method</p>
                  {selectedReceipt.paymentMethod === 'card' && (
                    <p>Card Network: {selectedReceipt.cardBrand?.toUpperCase() || 'VISA'} (Ending {selectedReceipt.cardLast4 || '4242'})</p>
                  )}
                  {selectedReceipt.paymentMethod === 'mobile_banking' && (
                    <p>UPI Transfer: {selectedReceipt.upiProvider?.toUpperCase() || 'GPAY'} ({selectedReceipt.upiDetails || 'alex@upi'})</p>
                  )}
                  {selectedReceipt.paymentMethod === 'cod' && (
                    <p>Cash on Delivery (Pending Handover)</p>
                  )}
                  <p>Date: {selectedReceipt.date}</p>
                </div>
              </div>

              {/* Items row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '4px' }}>Purchased Items</p>
                {selectedReceipt.items.map((item, itemIdx) => (
                  <div key={itemIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span>{item.name} <strong style={{ color: 'var(--accent-secondary)' }}>×{item.quantity}</strong></span>
                    <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '20px', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Invoice Subtotal</span>
                  <span>₹{selectedReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: 'var(--accent-secondary)', borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                  <span>Grand Total Paid</span>
                  <span>₹{selectedReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary flex-center"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', gap: '6px' }}
                >
                  <Printer size={14} /> Print Invoice Receipt
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN PROFILE PICTURE DIALOG POPUP */}
      {isFullscreenPicOpen && profilePic && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          {/* Backdrop */}
          <div onClick={() => setIsFullscreenPicOpen(false)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} />
          
          {/* Image Container */}
          <div style={{ position: 'relative', zIndex: 1010, maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Close Button */}
            <button 
              onClick={() => setIsFullscreenPicOpen(false)}
              className="btn-icon" 
              style={{ 
                position: 'absolute', 
                top: '-48px', 
                right: '0px', 
                width: '36px', 
                height: '36px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                color: '#fff', 
                borderRadius: '50%', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <X size={18} />
            </button>

            <img 
              src={profilePic} 
              alt="Profile Pic Fullscreen" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh', 
                borderRadius: '16px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)', 
                border: '3px solid rgba(255,255,255,0.1)',
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>
      )}

      {/* STYLING RULES */}
      <style>{`
        .profile-dashboard-container {
          position: relative;
          min-height: 80vh;
          z-index: 1;
        }

        /* Avatar styles */
        .avatar-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          fontWeight: 800;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .avatar-badge.tier-gold {
          background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
          border: 2px solid #fbbf24;
          text-shadow: 0 2px 4px rgba(180,83,9,0.5);
        }
        .avatar-badge.tier-silver {
          background: linear-gradient(135deg, #94a3b8 0%, #475569 100%);
          border: 2px solid #cbd5e1;
        }
        .avatar-badge.tier-bronze {
          background: linear-gradient(135deg, #b45309 0%, #7c2d12 100%);
          border: 2px solid #ea580c;
        }

        .dashboard-header {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px 32px;
          margin-bottom: 40px;
          align-items: flex-start;
        }
        @media(min-width: 768px) {
          .dashboard-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .dashboard-tab-btn {
          background: none;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all var(--transition-fast);
        }
        .dashboard-tab-btn:hover {
          color: var(--text-primary);
        }
        .dashboard-tab-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          box-shadow: 0 2px 8px var(--accent-glow);
        }

        /* Profile Detail list rules */
        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .detail-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--bg-surface-hover);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-secondary);
          flex-shrink: 0;
        }
        .detail-lbl-val {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .detail-lbl-val .lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .detail-lbl-val .val {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Tier card styles */
        .tier-privilege-card {
          border: 1px solid transparent;
        }
        .tier-privilege-card.tier-gold {
          background: linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(180,83,9,0.02) 100%);
          border-color: rgba(245,158,11,0.25);
          color: #f59e0b;
        }
        .tier-privilege-card.tier-silver {
          background: linear-gradient(135deg, rgba(148,163,184,0.08) 0%, rgba(71,85,105,0.02) 100%);
          border-color: rgba(148,163,184,0.25);
          color: #cbd5e1;
        }
        .tier-privilege-card.tier-bronze {
          background: linear-gradient(135deg, rgba(180,83,9,0.08) 0%, rgba(124,45,18,0.02) 100%);
          border-color: rgba(180,83,9,0.25);
          color: #ea580c;
        }

        .tier-gold { color: #fbbf24; }
        .tier-silver { color: #94a3b8; }
        .tier-bronze { color: #ea580c; }

        /* Order History card styling */
        .order-history-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
        }
        .header-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .order-id {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .order-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .order-price {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--accent-secondary);
        }
        .order-card-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media(min-width: 768px) {
          .order-card-body {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        .order-items-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .order-item-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 6px 12px;
          max-width: 240px;
        }
        .item-chip-img {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          object-fit: contain;
          background: rgba(0,0,0,0.1);
        }
        .item-name {
          font-size: 0.75rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140px;
        }
        .item-qty {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        /* Spin Wheel Visuals */
        .wheel-holder {
          position: relative;
          width: 200px;
          height: 200px;
        }
        .wheel-spinner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 6px solid var(--border-color);
          position: relative;
          overflow: hidden;
          background: var(--bg-surface-solid);
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
        }
        .wheel-segment {
          position: absolute;
          width: 50%;
          height: 50%;
          left: 50%;
          top: 0;
          transform-origin: 0% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wheel-segment span {
          position: absolute;
          left: 12px;
          top: 30px;
          font-weight: 800;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .border-1 { transform: rotate(0deg) skewY(-45deg); background: rgba(99,102,241,0.06); }
        .border-2 { transform: rotate(45deg) skewY(-45deg); background: rgba(34,211,238,0.06); }
        .border-3 { transform: rotate(90deg) skewY(-45deg); background: rgba(99,102,241,0.06); }
        .border-4 { transform: rotate(135deg) skewY(-45deg); background: rgba(34,211,238,0.06); }
        .border-5 { transform: rotate(180deg) skewY(-45deg); background: rgba(99,102,241,0.06); }
        .border-6 { transform: rotate(225deg) skewY(-45deg); background: rgba(34,211,238,0.06); }
        .border-7 { transform: rotate(270deg) skewY(-45deg); background: rgba(99,102,241,0.06); }
        .border-8 { transform: rotate(315deg) skewY(-45deg); background: rgba(34,211,238,0.06); }

        .wheel-center-pin {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-gradient);
          border: 3px solid var(--border-color);
          z-index: 10;
        }
        .wheel-arrow-indicator {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 18px solid var(--accent-secondary);
          z-index: 20;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .spin-h {
          animation: spin 1s linear infinite;
        }

        .scrollbar-styled::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-styled::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
