import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle, MapPin } from 'lucide-react';
import { GPayIcon, PhonePeIcon, PaytmIcon } from './PaymentLogos';


export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}) {
  const [checkoutStep, setCheckoutStep] = useState('idle'); // idle, address, confirm, processing, success
  const [paymentMethod, setPaymentMethod] = useState('mobile_banking');
  const [upiProvider, setUpiProvider] = useState('gpay');
  const [upiDetails, setUpiDetails] = useState('7411971579');

  // Delivery Address State
  const [addrName, setAddrName] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrError, setAddrError] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleStartCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      setCheckoutStep('address');
    }
  };

  const handleAddressSubmit = () => {
    if (!addrName || !addrLine || !addrCity || !addrState || !addrPin || !addrPhone) {
      setAddrError('Please fill in all address fields.');
      return;
    }
    if (addrPin.length < 5) {
      setAddrError('Please enter a valid PIN / ZIP code.');
      return;
    }
    if (addrPhone.length < 10) {
      setAddrError('Please enter a valid 10-digit phone number.');
      return;
    }
    setAddrError('');
    setCheckoutStep('confirm');
  };

  const handleConfirmPayment = () => {
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      setTimeout(() => {
        onClearCart();
        setCheckoutStep('idle');
        setPaymentMethod('mobile_banking');
        setUpiProvider('gpay');
        setUpiDetails('7411971579');
        setAddrName(''); setAddrLine(''); setAddrCity('');
        setAddrState(''); setAddrPin(''); setAddrPhone('');
        onClose();
      }, 3000);
    }, 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={checkoutStep === 'processing' ? null : onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.3s'
        }}
      />

      {/* Drawer Panel */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          zIndex: 110,
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: 'var(--bg-surface-solid)',
          boxShadow: 'var(--shadow-lg)',
          borderLeft: '1px solid var(--border-color)',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {checkoutStep === 'idle' && (
          <>
            {/* Drawer Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Cart</h3>
                <span
                  className="badge badge-glow"
                  style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                >
                  {cartItems.length} item{cartItems.length !== 1 && 's'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="btn-icon"
                style={{ width: '36px', height: '36px' }}
                aria-label="Close Cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cart Items List */}
            <div
              style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div
                    key={item.id}
                    className="glass-panel"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      borderRadius: '16px',
                      background: 'var(--bg-surface)'
                    }}
                  >
                    {/* Item Thumbnail */}
                    <div
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-color)',
                        padding: '4px'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    {/* Item Info */}
                    <div style={{ flexGrow: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="btn-icon"
                          style={{ width: '24px', height: '24px', borderRadius: '6px' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, width: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="btn-icon"
                          style={{ width: '24px', height: '24px', borderRadius: '6px' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Delete Trigger */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="btn-icon"
                      style={{
                        width: '32px',
                        height: '32px',
                        color: 'var(--text-muted)',
                        borderColor: 'transparent',
                        background: 'transparent'
                      }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '16px',
                    color: 'var(--text-muted)'
                  }}
                >
                  <ShoppingBag size={48} strokeWidth={1.5} />
                  <p style={{ fontSize: '1rem' }}>Your shopping cart is currently empty.</p>
                  <button
                    onClick={onClose}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.9rem', padding: '10px 24px', borderRadius: '10px' }}
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {cartItems.length > 0 && (
              <div
                style={{
                  padding: '24px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Subtotal</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={handleStartCheckout}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '1rem'
                  }}
                >
                  Checkout Now
                </button>
              </div>
            )}
          </>
        )}

        {checkoutStep === 'address' && (
          <>
            {/* Address Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Delivery Address</h3>
              </div>
              <button
                onClick={() => setCheckoutStep('idle')}
                className="btn-icon"
                style={{ width: '36px', height: '36px' }}
                aria-label="Back to Cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* Address Form */}
            <div
              style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {addrError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  {addrError}
                </div>
              )}

              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={addrName}
                  onChange={e => setAddrName(e.target.value)}
                  placeholder="Enter your full name"
                  className="input-field"
                  style={{ padding: '10px 14px' }}
                />
              </div>

              {/* Address Line */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Street / House / Flat
                </label>
                <input
                  type="text"
                  value={addrLine}
                  onChange={e => setAddrLine(e.target.value)}
                  placeholder="Flat no., Street, Area, Landmark"
                  className="input-field"
                  style={{ padding: '10px 14px' }}
                />
              </div>

              {/* City + State */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={e => setAddrCity(e.target.value)}
                    placeholder="City"
                    className="input-field"
                    style={{ padding: '10px 14px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={addrState}
                    onChange={e => setAddrState(e.target.value)}
                    placeholder="State"
                    className="input-field"
                    style={{ padding: '10px 14px' }}
                  />
                </div>
              </div>

              {/* PIN + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    PIN / ZIP
                  </label>
                  <input
                    type="text"
                    value={addrPin}
                    onChange={e => setAddrPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="560001"
                    className="input-field"
                    style={{ padding: '10px 14px' }}
                    maxLength={6}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={addrPhone}
                    onChange={e => setAddrPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className="input-field"
                    style={{ padding: '10px 14px' }}
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Delivery address summary preview */}
              {addrName && addrCity && (
                <div
                  className="glass-panel"
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'var(--bg-surface-hover)',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    marginTop: '4px'
                  }}
                >
                  <MapPin size={16} style={{ color: 'var(--accent-secondary)', marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, textAlign: 'left' }}>
                    {addrName}{addrLine ? `, ${addrLine}` : ''}{addrCity ? `, ${addrCity}` : ''}{addrState ? `, ${addrState}` : ''}{addrPin ? ` - ${addrPin}` : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleAddressSubmit}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '1rem' }}
              >
                Continue to Payment →
              </button>
              <button
                onClick={() => setCheckoutStep('idle')}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.9rem' }}
              >
                ← Back to Cart
              </button>
            </div>
          </>
        )}

        {checkoutStep === 'confirm' && (
          <>
            {/* Confirmation Header */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={20} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Confirm Order</h3>
              </div>
              <button
                onClick={() => setCheckoutStep('idle')}
                className="btn-icon"
                style={{ width: '36px', height: '36px' }}
                aria-label="Back to Cart"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Summary and Payment selection */}
            <div
              style={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                textAlign: 'left'
              }}
            >
              {/* Order Items Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Order Items
                </h4>
                <div
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: 'var(--bg-surface-hover)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {item.name} <strong style={{ color: 'var(--text-primary)' }}>x{item.quantity}</strong>
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--accent-secondary)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Payment Method
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Mobile Banking Options */}
                  <label
                    className="glass-panel"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: paymentMethod === 'mobile_banking' ? 'var(--accent-primary)' : 'var(--border-color)',
                      background: paymentMethod === 'mobile_banking' ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="mobile_banking"
                      checked={paymentMethod === 'mobile_banking'}
                      onChange={() => setPaymentMethod('mobile_banking')}
                      style={{ marginTop: '4px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        Mobile Banking / UPI (Recommended)
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Pay instantly using GPay, PhonePe, or Paytm app.
                      </span>
                    </div>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    className="glass-panel"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: paymentMethod === 'card' ? 'var(--accent-primary)' : 'var(--border-color)',
                      background: paymentMethod === 'card' ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      style={{ marginTop: '4px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        Credit or Debit Card
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Visa, MasterCard, RuPay, or American Express cards.
                      </span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className="glass-panel"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: paymentMethod === 'cod' ? 'var(--accent-primary)' : 'var(--border-color)',
                      background: paymentMethod === 'cod' ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ marginTop: '4px' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        Cash on Delivery (COD)
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Pay cash directly to our delivery executive at your doorstep.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sub-form details for Mobile Banking */}
              {paymentMethod === 'mobile_banking' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Select UPI Apps
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'gpay', label: 'GPay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm' }
                    ].map(prov => (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => setUpiProvider(prov.id)}
                        className="btn"
                        style={{
                          padding: '12px 6px',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: upiProvider === prov.id ? 'var(--accent-primary)' : 'var(--bg-surface)',
                          borderColor: upiProvider === prov.id ? 'var(--accent-primary)' : 'var(--border-color)',
                          color: upiProvider === prov.id ? '#ffffff' : 'var(--text-secondary)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {prov.id === 'gpay' && <GPayIcon size={18} color={upiProvider === 'gpay' ? '#ffffff' : 'var(--text-muted)'} />}
                        {prov.id === 'phonepe' && <PhonePeIcon size={18} color={upiProvider === 'phonepe' ? '#ffffff' : 'var(--text-muted)'} />}
                        {prov.id === 'paytm' && <PaytmIcon size={18} color={upiProvider === 'paytm' ? '#ffffff' : 'var(--text-muted)'} />}
                        <span>{prov.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* UPI / Phone Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Enter UPI ID / Mobile Number
                    </label>
                    <input
                      type="text"
                      value={upiDetails}
                      onChange={(e) => setUpiDetails(e.target.value)}
                      placeholder="e.g. 7411971579@ybl"
                      className="input-field"
                      style={{ padding: '10px 14px' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Confirm Footer */}
            <div
              style={{
                padding: '24px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <button
                onClick={handleConfirmPayment}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '1rem'
                }}
              >
                Confirm Order & Pay
              </button>
              <button
                onClick={() => setCheckoutStep('address')}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.9rem'
                }}
              >
                ← Edit Delivery Address
              </button>
            </div>
          </>
        )}

        {checkoutStep === 'processing' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '24px',
              padding: '24px'
            }}
          >
            <div className="checkout-spinner" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Processing Order</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', maxWidth: '280px' }}>
              Please wait while we secure your billing details and queue your items for packing...
            </p>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '20px',
              padding: '24px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                border: '2px solid var(--accent-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-secondary)'
              }}
            >
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">
              Order Confirmed!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', maxWidth: '300px', lineHeight: 1.6 }}>
              Thank you for shopping with AURA SHOP. A receipt with tracking details has been sent to your email.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .checkout-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--border-color);
          border-top: 4px solid var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
