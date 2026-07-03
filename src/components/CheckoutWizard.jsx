import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, CreditCard, CheckCircle, Package, Truck, Printer,
  ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Check,
  Smartphone, Wallet
} from 'lucide-react';
import { GPayIcon, PhonePeIcon, PaytmIcon } from './PaymentLogos';


export default function CheckoutWizard({ cartItems, onClearCart, onNavigate, onOrderPlaced }) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Receipt/Tracker
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Shipping Form State
  const [shippingData, setShippingData] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [shippingErrors, setShippingErrors] = useState({});
  const [isShippingShaking, setIsShippingShaking] = useState(false);

  // Card Payment Form State
  const [cardData, setCardData] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [cardErrors, setCardErrors] = useState({});
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardBrand, setCardBrand] = useState('default'); // default, visa, mastercard, amex, discover, rupay

  // Other Payment Methods State
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, mobile_banking, cod
  const [upiProvider, setUpiProvider] = useState('gpay');
  const [upiDetails, setUpiDetails] = useState('');
  const [upiError, setUpiError] = useState('');

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, label }

  // Order Tracker State
  const [trackerStage, setTrackerStage] = useState(0); // 0 to 4
  const autoSimTimer = useRef(null);

  // Generate random order ID on mount
  useEffect(() => {
    const randomId = 'AURA-' + Math.floor(1000000 + Math.random() * 9000000);
    setOrderId(randomId);
  }, []);

  // Sync card brand detection
  useEffect(() => {
    const rawNumber = cardData.number.replace(/\s/g, '');
    if (rawNumber.startsWith('4')) {
      setCardBrand('visa');
    } else if (/^5[1-5]/.test(rawNumber) || /^2[2-7]/.test(rawNumber)) {
      setCardBrand('mastercard');
    } else if (/^3[47]/.test(rawNumber)) {
      setCardBrand('amex');
    } else if (/^6011|^65|^64[4-9]/.test(rawNumber)) {
      setCardBrand('discover');
    } else if (/^60|^6521/.test(rawNumber) || /^8[12]/.test(rawNumber)) {
      setCardBrand('rupay');
    } else {
      setCardBrand('default');
    }
  }, [cardData.number]);

  // Calculate pricing summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let promoDiscountAmt = 0;
  if (appliedPromo) {
    if (appliedPromo.code === 'WATCH15') {
      const watchItem = cartItems.find(item => item.name.toLowerCase().includes('watch'));
      if (watchItem) {
        promoDiscountAmt = Math.round(watchItem.price * watchItem.quantity * 0.15);
      }
    } else if (appliedPromo.code === 'SOUND20') {
      const soundItem = cartItems.find(item => item.name.toLowerCase().includes('sound') || item.name.toLowerCase().includes('headphone'));
      if (soundItem) {
        promoDiscountAmt = Math.round(soundItem.price * soundItem.quantity * 0.20);
      }
    } else if (appliedPromo.code === 'PHONE10') {
      const phoneItem = cartItems.find(item => item.name.toLowerCase().includes('phone'));
      if (phoneItem) {
        promoDiscountAmt = Math.round(phoneItem.price * phoneItem.quantity * 0.10);
      }
    } else if (appliedPromo.code === 'AURA40') {
      const accItems = cartItems.filter(item => item.category === 'Accessories');
      const accSubtotal = accItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      promoDiscountAmt = Math.round(accSubtotal * 0.40);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - promoDiscountAmt);
  const shippingFee = discountedSubtotal > 8000 || subtotal === 0 ? 0 : 500;
  const estimatedTax = Math.round(discountedSubtotal * 0.18); // 18% GST
  const totalAmount = discountedSubtotal + shippingFee + estimatedTax;

  // Formatting inputs
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setShippingData(prev => ({ ...prev, phone: val }));
    if (shippingErrors.phone) {
      setShippingErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleZipChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setShippingData(prev => ({ ...prev, zipCode: val }));
    if (shippingErrors.zipCode) {
      setShippingErrors(prev => ({ ...prev, zipCode: '' }));
    }
  };

  const handleCardNumberChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    // Limit and format: groups of 4 digits
    let formattedVal = '';
    for (let i = 0; i < rawVal.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formattedVal += ' ';
      formattedVal += rawVal[i];
    }
    setCardData(prev => ({ ...prev, number: formattedVal }));
    if (cardErrors.number) {
      setCardErrors(prev => ({ ...prev, number: '' }));
    }
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2, 4);
    }
    setCardData(prev => ({ ...prev, expiry: val.slice(0, 5) }));
    if (cardErrors.expiry) {
      setCardErrors(prev => ({ ...prev, expiry: '' }));
    }
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardData(prev => ({ ...prev, cvv: val }));
    if (cardErrors.cvv) {
      setCardErrors(prev => ({ ...prev, cvv: '' }));
    }
  };

  const validateShippingForm = () => {
    const errors = {};
    if (!shippingData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!shippingData.addressLine.trim()) errors.addressLine = 'Street address is required';
    if (!shippingData.city.trim()) errors.city = 'City is required';
    if (!shippingData.state.trim()) errors.state = 'State is required';
    if (!shippingData.zipCode || shippingData.zipCode.length < 5) {
      errors.zipCode = 'Valid PIN/ZIP code is required';
    }
    if (!shippingData.phone || shippingData.phone.length < 10) {
      errors.phone = 'Valid 10-digit phone number is required';
    }

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCardForm = () => {
    const errors = {};
    const rawCard = cardData.number.replace(/\s/g, '');
    if (rawCard.length < 16) {
      errors.number = 'Please enter a valid 16-digit card number';
    }
    if (!cardData.holder.trim()) {
      errors.holder = 'Cardholder name is required';
    }
    if (!cardData.expiry || cardData.expiry.length < 5) {
      errors.expiry = 'Expiry date must be in MM/YY format';
    } else {
      const [month, year] = cardData.expiry.split('/');
      const m = parseInt(month, 10);
      if (m < 1 || m > 12) {
        errors.expiry = 'Invalid expiry month';
      }
    }
    const maxCvvLen = cardBrand === 'amex' ? 4 : 3;
    if (!cardData.cvv || cardData.cvv.length < maxCvvLen) {
      errors.cvv = `CVV must be ${maxCvvLen} digits`;
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUpiForm = () => {
    if (!upiDetails.trim()) {
      setUpiError('UPI ID or Mobile Number is required');
      return false;
    }
    if (upiDetails.includes('@') && upiDetails.length < 5) {
      setUpiError('Please enter a valid UPI ID (e.g., name@okaxis)');
      return false;
    }
    if (!upiDetails.includes('@') && upiDetails.length < 10) {
      setUpiError('Please enter a valid 10-digit mobile number or UPI ID');
      return false;
    }
    setUpiError('');
    return true;
  };

  const handleNextFromShipping = (e) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsShippingShaking(true);
      setTimeout(() => setIsShippingShaking(false), 600);
    }
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'WATCH15') {
      const hasWatch = cartItems.some(item => item.name.toLowerCase().includes('watch'));
      if (hasWatch) {
        setAppliedPromo({ code, label: '15% Extra Watch Discount' });
        setPromoError('');
      } else {
        setPromoError('Aura Watch Pro is required in the cart to apply this code!');
      }
    } else if (code === 'SOUND20') {
      const hasSound = cartItems.some(item => item.name.toLowerCase().includes('sound') || item.name.toLowerCase().includes('headphone'));
      if (hasSound) {
        setAppliedPromo({ code, label: '20% Extra Audio Discount' });
        setPromoError('');
      } else {
        setPromoError('Aura Sound Max is required in the cart to apply this code!');
      }
    } else if (code === 'PHONE10') {
      const hasPhone = cartItems.some(item => item.name.toLowerCase().includes('phone'));
      if (hasPhone) {
        setAppliedPromo({ code, label: '10% Extra Phone Discount' });
        setPromoError('');
      } else {
        setPromoError('Aura Phone Pro is required in the cart to apply this code!');
      }
    } else if (code === 'AURA40') {
      const hasAcc = cartItems.some(item => item.category === 'Accessories');
      if (hasAcc) {
        setAppliedPromo({ code, label: '40% Extra Accessories Discount' });
        setPromoError('');
      } else {
        setPromoError('At least one Accessory item is required to apply this code!');
      }
    } else {
      setPromoError('Invalid coupon code!');
    }
  };

  const handleNextFromPayment = (e) => {
    e.preventDefault();
    let isValid = false;
    if (paymentMethod === 'card') {
      isValid = validateCardForm();
    } else if (paymentMethod === 'mobile_banking') {
      isValid = validateUpiForm();
    } else if (paymentMethod === 'cod') {
      isValid = true;
    }

    if (isValid) {
      setIsProcessing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Simulate premium authorization
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
        
        if (onOrderPlaced) {
          const newOrder = {
            id: orderId,
            date: new Date().toLocaleDateString(),
            amount: totalAmount,
            status: 'Placed',
            items: cartItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image
            })),
            paymentMethod: paymentMethod,
            cardBrand: paymentMethod === 'card' ? cardBrand : undefined,
            cardLast4: paymentMethod === 'card' ? cardData.number.slice(-4) : undefined,
            upiProvider: paymentMethod === 'mobile_banking' ? upiProvider : undefined,
            upiDetails: paymentMethod === 'mobile_banking' ? upiDetails : undefined
          };
          onOrderPlaced(newOrder);
        }
        
        onClearCart(); // Cart is cleared now that purchase succeeded
      }, 2500);
    }
  };

  // Timeline statuses
  const trackerStagesInfo = [
    { label: 'Order Placed', desc: 'We have received your order.', time: 'Just now' },
    { label: 'Processing', desc: 'Items are being packed and sealed.', time: 'Expected in 1 hour' },
    { label: 'Shipped', desc: 'Package left sorting hub in Bangalore.', time: 'Expected tomorrow' },
    { label: 'Out for Delivery', desc: 'Courier agent is heading to your place.', time: 'Expected in 2 days' },
    { label: 'Delivered', desc: 'Package handed over and signed.', time: 'Arrived' }
  ];

  const advanceTracker = () => {
    setTrackerStage(prev => (prev < 4 ? prev + 1 : prev));
  };

  const resetTracker = () => {
    setTrackerStage(0);
  };

  const startAutoSimulation = () => {
    if (autoSimTimer.current) clearInterval(autoSimTimer.current);
    setTrackerStage(0);
    let stage = 0;
    autoSimTimer.current = setInterval(() => {
      stage += 1;
      setTrackerStage(stage);
      if (stage >= 4) {
        clearInterval(autoSimTimer.current);
      }
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (autoSimTimer.current) clearInterval(autoSimTimer.current);
    };
  }, []);

  const triggerPrint = () => {
    window.print();
  };

  // Card brand configurations
  const getCardStyle = () => {
    switch (cardBrand) {
      case 'visa':
        return {
          background: 'linear-gradient(135deg, #1e40af 0%, #0369a1 100%)',
          logo: 'Visa',
          logoStyle: { color: '#ffffff', fontStyle: 'italic', fontWeight: 800, fontSize: '1.4rem' }
        };
      case 'mastercard':
        return {
          background: 'linear-gradient(135deg, #1f2937 0%, #991b1b 100%)',
          logo: 'Mastercard',
          logoStyle: { color: '#ffffff', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px' }
        };
      case 'amex':
        return {
          background: 'linear-gradient(135deg, #854d0e 0%, #713f12 100%)',
          logo: 'Amex',
          logoStyle: { color: '#ffffff', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic' }
        };
      case 'discover':
        return {
          background: 'linear-gradient(135deg, #ea580c 0%, #b45309 100%)',
          logo: 'Discover',
          logoStyle: { color: '#ffffff', fontWeight: 800, letterSpacing: '1px' }
        };
      case 'rupay':
        return {
          background: 'linear-gradient(135deg, #065f46 0%, #0369a1 100%)',
          logo: 'RuPay',
          logoStyle: { color: '#ffffff', fontWeight: 900, fontSize: '1.3rem' }
        };
      default:
        return {
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          logo: 'AURA',
          logoStyle: { color: '#ffffff', fontWeight: 900, letterSpacing: '2px' }
        };
    }
  };

  const cardStyle = getCardStyle();

  return (
    <div className="checkout-wizard-container">
      {/* Dynamic Ambient Blur Orbs */}
      <div className="bg-ambient">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      <div className="container" style={{ paddingBottom: '80px', paddingTop: '40px' }}>

        {/* Stepper Header (Only when not processing and not success step) */}
        {!isProcessing && step < 3 && (
          <div className="stepper-wrapper glass-panel">
            <div className="stepper-step active">
              <div className={`step-circle ${step >= 1 ? 'checked' : ''}`}>
                {step > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
              </div>
              <span className="step-label">Shipping details</span>
            </div>
            <div className={`stepper-line ${step >= 2 ? 'filled' : ''}`} />
            <div className={`stepper-step ${step >= 2 ? 'active' : ''}`}>
              <div className={`step-circle ${step >= 2 ? 'checked' : ''}`}>
                {step > 2 ? <Check size={14} strokeWidth={3} /> : '2'}
              </div>
              <span className="step-label">Secure payment</span>
            </div>
            <div className={`stepper-line ${step >= 3 ? 'filled' : ''}`} />
            <div className={`stepper-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span className="step-label">Order Receipt</span>
            </div>
          </div>
        )}

        {/* PROCESSING SCREEN */}
        {isProcessing && (
          <div className="processing-container glass-panel">
            <div className="scanner-orb">
              <ShieldCheck size={48} className="shield-pulse" />
            </div>
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, margin: '20px 0 10px 0' }}>
              Securing Payment
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '380px', fontSize: '0.95rem' }}>
              We are connecting to your banking servers to authorize the transaction. Please do not refresh the page.
            </p>
            <div className="auth-spinner" />
          </div>
        )}

        {/* MAIN STEPS */}
        {!isProcessing && (
          <div className="step-body-grid">

            {/* LEFT COLUMN: Main Form Panels */}
            {step === 1 && (
              <div className={`form-column ${isShippingShaking ? 'shake-anim' : ''}`}>
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <MapPin size={24} style={{ color: 'var(--accent-secondary)' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Shipping Information</h2>
                  </div>

                  <form onSubmit={handleNextFromShipping} className="wizard-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={shippingData.fullName}
                        onChange={(e) => {
                          setShippingData(prev => ({ ...prev, fullName: e.target.value }));
                          if (shippingErrors.fullName) setShippingErrors(prev => ({ ...prev, fullName: '' }));
                        }}
                        placeholder="Enter full recipient name"
                        className={`wizard-input ${shippingErrors.fullName ? 'error' : ''}`}
                      />
                      {shippingErrors.fullName && <span className="input-error">{shippingErrors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        value={shippingData.addressLine}
                        onChange={(e) => {
                          setShippingData(prev => ({ ...prev, addressLine: e.target.value }));
                          if (shippingErrors.addressLine) setShippingErrors(prev => ({ ...prev, addressLine: '' }));
                        }}
                        placeholder="Flat / Apartment / Street Name"
                        className={`wizard-input ${shippingErrors.addressLine ? 'error' : ''}`}
                      />
                      {shippingErrors.addressLine && <span className="input-error">{shippingErrors.addressLine}</span>}
                    </div>

                    <div className="input-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={shippingData.city}
                          onChange={(e) => {
                            setShippingData(prev => ({ ...prev, city: e.target.value }));
                            if (shippingErrors.city) setShippingErrors(prev => ({ ...prev, city: '' }));
                          }}
                          placeholder="e.g. Bangalore"
                          className={`wizard-input ${shippingErrors.city ? 'error' : ''}`}
                        />
                        {shippingErrors.city && <span className="input-error">{shippingErrors.city}</span>}
                      </div>

                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          value={shippingData.state}
                          onChange={(e) => {
                            setShippingData(prev => ({ ...prev, state: e.target.value }));
                            if (shippingErrors.state) setShippingErrors(prev => ({ ...prev, state: '' }));
                          }}
                          placeholder="e.g. Karnataka"
                          className={`wizard-input ${shippingErrors.state ? 'error' : ''}`}
                        />
                        {shippingErrors.state && <span className="input-error">{shippingErrors.state}</span>}
                      </div>
                    </div>

                    <div className="input-row">
                      <div className="form-group">
                        <label>PIN / ZIP Code</label>
                        <input
                          type="text"
                          value={shippingData.zipCode}
                          onChange={handleZipChange}
                          placeholder="6-digit ZIP code"
                          maxLength={6}
                          className={`wizard-input ${shippingErrors.zipCode ? 'error' : ''}`}
                        />
                        {shippingErrors.zipCode && <span className="input-error">{shippingErrors.zipCode}</span>}
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          value={shippingData.phone}
                          onChange={handlePhoneChange}
                          placeholder="10-digit number"
                          maxLength={10}
                          className={`wizard-input ${shippingErrors.phone ? 'error' : ''}`}
                        />
                        {shippingErrors.phone && <span className="input-error">{shippingErrors.phone}</span>}
                      </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                      <button
                        type="button"
                        onClick={() => onNavigate('products')}
                        className="btn btn-secondary flex-center"
                        style={{ padding: '12px 20px', borderRadius: '12px', flexShrink: 0 }}
                      >
                        <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Return
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-center"
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600 }}
                      >
                        Continue to Payment <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-column">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <CreditCard size={24} style={{ color: 'var(--accent-secondary)' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Payment Details</h2>
                  </div>

                  {/* PAYMENT METHOD SELECTOR TABS */}
                  <div className="payment-method-tabs">
                    {[
                      { id: 'card', label: 'Credit Card', icon: <CreditCard size={16} /> },
                      { id: 'mobile_banking', label: 'UPI / Mobile', icon: <Smartphone size={16} /> },
                      { id: 'cod', label: 'Cash / COD', icon: <Wallet size={16} /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaymentMethod(tab.id)}
                        className={`payment-tab-btn ${paymentMethod === tab.id ? 'active' : ''}`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* 1. CREDIT/DEBIT CARD SIMULATOR AND FORM */}
                  {paymentMethod === 'card' && (
                    <>
                      {/* PREMIUM CREDIT CARD SIMULATOR */}
                      <div style={{ marginBottom: '32px' }}>
                        <div className={`card-container ${isCardFlipped ? 'flipped' : ''}`}>
                          <div className="card-inner">
                            {/* Card Front */}
                            <div className="card-front" style={{ background: cardStyle.background }}>
                              <div className="card-head">
                                <div className="card-metallic-chip" />
                                <span style={cardStyle.logoStyle}>{cardStyle.logo}</span>
                              </div>
                              <div className="card-number-display">
                                {cardData.number || '•••• •••• •••• ••••'}
                              </div>
                              <div className="card-foot">
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span className="card-label">Card Holder</span>
                                  <span className="card-value">{cardData.holder.toUpperCase() || 'CARDHOLDER NAME'}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                  <span className="card-label">Expires</span>
                                  <span className="card-value">{cardData.expiry || 'MM/YY'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Card Back */}
                            <div className="card-back" style={{ background: cardStyle.background }}>
                              <div className="card-mag-strip" />
                              <div className="card-signature-box">
                                <div className="sig-strip" />
                                <div className="cvv-display">{cardData.cvv || '•••'}</div>
                              </div>
                              <div className="card-back-foot">
                                <span style={{ fontSize: '0.65rem', opacity: 0.7, padding: '0 24px' }}>
                                  Aura Secured Network Checkout Simulator
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleNextFromPayment} className="wizard-form">
                        <div className="form-group">
                          <label>Cardholder Name</label>
                          <input
                            type="text"
                            value={cardData.holder}
                            onChange={(e) => {
                              setCardData(prev => ({ ...prev, holder: e.target.value }));
                              if (cardErrors.holder) setCardErrors(prev => ({ ...prev, holder: '' }));
                            }}
                            placeholder="e.g. John Doe"
                            onFocus={() => setIsCardFlipped(false)}
                            className={`wizard-input ${cardErrors.holder ? 'error' : ''}`}
                          />
                          {cardErrors.holder && <span className="input-error">{cardErrors.holder}</span>}
                        </div>

                        <div className="form-group">
                          <label>Card Number</label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={handleCardNumberChange}
                            placeholder="4111 2222 3333 4444"
                            onFocus={() => setIsCardFlipped(false)}
                            className={`wizard-input ${cardErrors.number ? 'error' : ''}`}
                          />
                          {cardErrors.number && <span className="input-error">{cardErrors.number}</span>}
                        </div>

                        <div className="input-row">
                          <div className="form-group">
                            <label>Expiry Date</label>
                            <input
                              type="text"
                              value={cardData.expiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              onFocus={() => setIsCardFlipped(false)}
                              className={`wizard-input ${cardErrors.expiry ? 'error' : ''}`}
                            />
                            {cardErrors.expiry && <span className="input-error">{cardErrors.expiry}</span>}
                          </div>

                          <div className="form-group">
                            <label>CVV / CVC</label>
                            <input
                              type="password"
                              value={cardData.cvv}
                              onChange={handleCvvChange}
                              placeholder="•••"
                              maxLength={cardBrand === 'amex' ? 4 : 3}
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              className={`wizard-input ${cardErrors.cvv ? 'error' : ''}`}
                            />
                            {cardErrors.cvv && <span className="input-error">{cardErrors.cvv}</span>}
                          </div>
                        </div>

                        <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="btn btn-secondary flex-center"
                            style={{ padding: '12px 20px', borderRadius: '12px', flexShrink: 0 }}
                          >
                            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Address
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary flex-center"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600 }}
                          >
                            Confirm & Pay ₹{totalAmount.toLocaleString('en-IN')}
                          </button>
                        </div>
                      </form>
                    </>
                  )}

                  {/* 2. MOBILE BANKING / UPI */}
                  {paymentMethod === 'mobile_banking' && (
                    <form onSubmit={handleNextFromPayment} className="wizard-form">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Select UPI App</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                          {[
                            { id: 'gpay', name: 'GPay' },
                            { id: 'phonepe', name: 'PhonePe' },
                            { id: 'paytm', name: 'Paytm' },
                            { id: 'bhim', name: 'BHIM' }
                          ].map(provider => (
                            <button
                              key={provider.id}
                              type="button"
                              onClick={() => {
                                setUpiProvider(provider.id);
                                setUpiError('');
                              }}
                              className={`payment-tab-btn ${upiProvider === provider.id ? 'active' : ''}`}
                              style={{
                                padding: '14px 6px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: upiProvider === provider.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                              }}>
                                {provider.id === 'gpay' && <GPayIcon size={20} color={upiProvider === 'gpay' ? '#ffffff' : 'var(--text-muted)'} />}
                                {provider.id === 'phonepe' && <PhonePeIcon size={20} color={upiProvider === 'phonepe' ? '#a966ff' : 'var(--text-muted)'} />}
                                {provider.id === 'paytm' && <PaytmIcon size={20} color={upiProvider === 'paytm' ? '#00baf2' : 'var(--text-muted)'} />}
                                {provider.id === 'bhim' && (
                                  <span style={{ 
                                    fontWeight: 800, 
                                    fontSize: '0.85rem', 
                                    color: upiProvider === 'bhim' ? '#ff9933' : 'var(--text-muted)' 
                                  }}>B</span>
                                )}
                              </div>
                              <span>{provider.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Enter UPI ID or Mobile Number</label>
                        <input
                          type="text"
                          value={upiDetails}
                          onChange={(e) => {
                            setUpiDetails(e.target.value);
                            if (upiError) setUpiError('');
                          }}
                          placeholder={upiProvider === 'gpay' || upiProvider === 'phonepe' ? "e.g. 9876543210@ybl" : "e.g. name@paytm"}
                          className={`wizard-input ${upiError ? 'error' : ''}`}
                        />
                        {upiError && <span className="input-error">{upiError}</span>}
                      </div>

                      <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Smartphone size={20} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          Upon clicking pay, we will send a simulated payment request to your selected UPI app.
                        </span>
                      </div>

                      <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="btn btn-secondary flex-center"
                          style={{ padding: '12px 20px', borderRadius: '12px', flexShrink: 0 }}
                        >
                          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Address
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary flex-center"
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600 }}
                        >
                          Send Request & Pay ₹{totalAmount.toLocaleString('en-IN')}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* 3. CASH ON DELIVERY (COD) */}
                  {paymentMethod === 'cod' && (
                    <form onSubmit={handleNextFromPayment} className="wizard-form">
                      <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'var(--accent-glow)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-secondary)'
                        }}>
                          <Wallet size={28} />
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 800, marginBottom: '6px' }}>Doorstep Cash / Card Handover</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '320px' }}>
                            You can pay using Cash, Card, or UPI directly to our delivery executive when your package arrives.
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'left', paddingLeft: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={12} style={{ color: 'var(--accent-secondary)' }} />
                            <span>Contactless doorstep delivery available</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Check size={12} style={{ color: 'var(--accent-secondary)' }} />
                            <span>Exact change is highly appreciated</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="btn btn-secondary flex-center"
                          style={{ padding: '12px 20px', borderRadius: '12px', flexShrink: 0 }}
                        >
                          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Address
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary flex-center"
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 600 }}
                        >
                          Place Order (COD) - ₹{totalAmount.toLocaleString('en-IN')}
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              </div>
            )}

            {/* ORDER SUCCESS, RECEIPT & LIVE TRACKER (STEP 3) */}
            {step === 3 && (
              <div className="receipt-column">

                {/* SUCCESS BURST HEADER */}
                <div className="success-banner glass-panel">
                  <div className="success-icon-badge">
                    <CheckCircle size={36} />
                  </div>
                  <h2 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: '14px 0 6px 0' }}>
                    Thank You For Your Order!
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Your transaction was processed successfully. Order tracking is initialized.
                  </p>
                </div>

                {/* TRACKER TIMELINE */}
                <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Truck size={22} style={{ color: 'var(--accent-secondary)' }} />
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Live Delivery Tracker</h3>
                    </div>
                    <span className="badge badge-glow" style={{ fontSize: '0.8rem', padding: '3px 10px' }}>
                      Live Status
                    </span>
                  </div>

                  {/* Visual Tracker Graphic */}
                  <div className="tracker-timeline-visual">
                    <div className="tracker-trail">
                      <div className="tracker-trail-fill" style={{ width: `${(trackerStage / 4) * 100}%` }} />
                    </div>

                    <div className="tracker-milestones">
                      {[
                        { icon: <ShoppingBag size={14} />, label: 'Placed' },
                        { icon: <Package size={14} />, label: 'Processing' },
                        { icon: <Truck size={14} />, label: 'Shipped' },
                        { icon: <Truck size={14} className="flip-h" />, label: 'On Way' },
                        { icon: <CheckCircle size={14} />, label: 'Delivered' }
                      ].map((milestone, idx) => (
                        <div key={idx} className={`milestone-node ${idx <= trackerStage ? 'active' : ''}`}>
                          <div className="milestone-bubble">{milestone.icon}</div>
                          <span className="milestone-lbl">{milestone.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Status Display Box */}
                  <div className="tracker-current-status-box">
                    <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {trackerStagesInfo[trackerStage].label}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {trackerStagesInfo[trackerStage].desc}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                      Timing: {trackerStagesInfo[trackerStage].time}
                    </span>
                  </div>

                  {/* Interactive Simulation Controls */}
                  <div className="tracker-simulation-controls">
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={12} style={{ color: 'var(--accent-secondary)' }} />
                      <span>Simulator Panel: Test the timeline animations & status update loops</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button
                        onClick={advanceTracker}
                        disabled={trackerStage >= 4}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px' }}
                      >
                        Simulate Next Stage
                      </button>
                      <button
                        onClick={startAutoSimulation}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                      >
                        Auto-play Tracking Loop
                      </button>
                      <button
                        onClick={resetTracker}
                        className="btn"
                        style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* DETAILED PRINTABLE ORDER RECEIPT */}
                <div id="printable-receipt" className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polygon points="18,3 32,11 32,25 18,33 4,25 4,11" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
                          <path d="M18 9 L26 24 L10 24 Z" fill="var(--accent-primary)" style={{ opacity: 0.3 }} />
                        </svg>
                        AURA SHOP
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Bangalore, KA, India</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="receipt-tag">OFFICIAL RECEIPT</span>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>Order: {orderId}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="receipt-address-details">
                    <div className="address-block">
                      <h5>Shipping Destination</h5>
                      <p style={{ fontWeight: 600 }}>{shippingData.fullName}</p>
                      <p>{shippingData.addressLine}</p>
                      <p>{shippingData.city}, {shippingData.state} - {shippingData.zipCode}</p>
                      <p>Phone: +91 {shippingData.phone}</p>
                    </div>
                    <div className="address-block" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
                      <h5>Payment Statement</h5>
                      {paymentMethod === 'card' && (
                        <>
                          <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CreditCard size={14} /> Card Details
                          </p>
                          <p>{cardStyle.logo} Card Network</p>
                          <p>Number: •••• •••• •••• {cardData.number.slice(-4)}</p>
                          <p>Authorization: APPROVED</p>
                        </>
                      )}
                      {paymentMethod === 'mobile_banking' && (
                        <>
                          <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Smartphone size={14} /> UPI Payment
                          </p>
                          <p>Provider: {upiProvider.toUpperCase()}</p>
                          <p>Details: {upiDetails}</p>
                          <p>Authorization: APPROVED</p>
                        </>
                      )}
                      {paymentMethod === 'cod' && (
                        <>
                          <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Wallet size={14} /> Cash on Delivery
                          </p>
                          <p>Doorstep Handover</p>
                          <p>Due: ₹{totalAmount.toLocaleString('en-IN')}</p>
                          <p>Status: PENDING HANDOVER</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Items Table */}
                  <div style={{ marginTop: '24px' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                      Purchased Products
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {cartItems.map((item) => (
                        <div key={item.id} className="receipt-item-row">
                          <span style={{ fontWeight: 600 }}>
                            {item.name} <strong style={{ color: 'var(--accent-secondary)' }}>x{item.quantity}</strong>
                          </span>
                          <span style={{ fontWeight: 700 }}>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Breakdown */}
                  <div className="receipt-breakdown">
                    <div className="breakdown-row">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {promoDiscountAmt > 0 && (
                      <div className="breakdown-row" style={{ color: '#22c55e', fontWeight: 600 }}>
                        <span>Promo Discount ({appliedPromo?.code})</span>
                        <span>-₹{promoDiscountAmt.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="breakdown-row">
                      <span>Estimated GST (18%)</span>
                      <span>₹{estimatedTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Shipping Fee</span>
                      <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
                    </div>
                    <div className="breakdown-row grand-total">
                      <span>Grand Total</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Final Wizard Controls */}
                <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={triggerPrint}
                    className="btn btn-secondary flex-center"
                    style={{ padding: '12px 24px', borderRadius: '12px' }}
                  >
                    <Printer size={16} style={{ marginRight: '8px' }} /> Print / Save PDF
                  </button>
                  <button
                    onClick={() => onNavigate('products')}
                    className="btn btn-primary flex-center"
                    style={{ padding: '12px 28px', borderRadius: '12px', fontWeight: 600 }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

            {/* RIGHT COLUMN: Order Cart Summary (Only in step 1 and 2) */}
            {step < 3 && (
              <div className="summary-column">
                <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={18} style={{ color: 'var(--accent-primary)' }} /> Order Summary
                  </h3>

                  {/* Summary list */}
                  <div className="summary-list">
                    {cartItems.map((item) => (
                      <div key={item.id} className="summary-item">
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <img src={item.image} alt={item.name} className="summary-item-img" />
                          <div>
                            <p className="summary-item-name">{item.name}</p>
                            <p className="summary-item-qty">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="summary-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="summary-breakdown">
                    <div className="breakdown-row">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {promoDiscountAmt > 0 && (
                      <div className="breakdown-row" style={{ color: '#22c55e', fontWeight: 600 }}>
                        <span>Promo Discount ({appliedPromo?.code})</span>
                        <span>-₹{promoDiscountAmt.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="breakdown-row">
                      <span>Estimated GST (18%)</span>
                      <span>₹{estimatedTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Shipping</span>
                      <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
                    </div>
                    <div className="breakdown-row total-row">
                      <span>Estimated Total</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Promo Code Input Block */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px', textAlign: 'left' }}>
                      Apply Promo Code
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text"
                        placeholder="e.g. WATCH15"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        disabled={appliedPromo !== null}
                        className="input-field"
                        style={{ padding: '8px 12px', fontSize: '0.85rem', flexGrow: 1, textTransform: 'uppercase', background: 'var(--bg-surface-solid)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '10px' }}
                      />
                      {appliedPromo ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedPromo(null);
                            setPromoInput('');
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem' }}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem' }}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {promoError && (
                      <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px', textAlign: 'left', fontWeight: 600 }}>{promoError}</p>
                    )}
                    {appliedPromo && (
                      <p style={{ color: '#22c55e', fontSize: '0.75rem', marginTop: '6px', textAlign: 'left', fontWeight: 600 }}>✓ Code {appliedPromo.code} applied! Saved: ₹{promoDiscountAmt.toLocaleString('en-IN')}</p>
                    )}
                  </div>

                  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--accent-secondary)' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Secured Checkout Connection SSL</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      <style>{`
        .checkout-wizard-container {
          position: relative;
          min-height: 80vh;
          z-index: 1;
        }

        /* Payment Tabs Styles */
        .payment-method-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        .payment-tab-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          padding: 12px;
          border-radius: 12px;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all var(--transition-fast);
        }
        .payment-tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border-color: var(--border-hover);
        }
        .payment-tab-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: 0 0 12px var(--accent-glow);
        }

        /* Stepper Styles */
        .stepper-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          margin-bottom: 40px;
          gap: 16px;
        }
        .stepper-step {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          transition: all var(--transition-normal);
        }
        .stepper-step.active {
          color: var(--text-primary);
        }
        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all var(--transition-normal);
          background: rgba(0, 0, 0, 0.2);
        }
        .stepper-step.active .step-circle {
          border-color: var(--accent-primary);
          color: #ffffff;
          box-shadow: 0 0 12px var(--accent-glow);
          background: var(--accent-primary);
        }
        .step-circle.checked {
          border-color: var(--accent-secondary) !important;
          background: var(--accent-secondary) !important;
          color: #ffffff !important;
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.3) !important;
        }
        .step-label {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .stepper-line {
          flex-grow: 1;
          height: 2px;
          background: var(--border-color);
          transition: all var(--transition-slow);
        }
        .stepper-line.filled {
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        }

        /* Form Columns & Grid Layout */
        .step-body-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media(min-width: 1024px) {
          .step-body-grid {
            grid-template-columns: 1.6fr 1fr;
          }
          .receipt-column {
            grid-column: span 2;
          }
        }

        /* Standard Forms styling */
        .wizard-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .wizard-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 14px 16px;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          outline: none;
          transition: all var(--transition-fast);
        }
        .wizard-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 8px var(--accent-glow);
          background: rgba(255, 255, 255, 0.06);
        }
        .wizard-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.15);
        }
        .input-error {
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 4px;
        }
        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        /* Shake Animation */
        .shake-anim {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        /* Card Simulator Styles */
        .card-container {
          perspective: 1000px;
          width: 100%;
          max-width: 360px;
          height: 220px;
          margin: 0 auto;
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .card-container.flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: var(--shadow-lg), 0 0 30px rgba(0,0,0,0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          text-align: left;
          color: #ffffff;
        }
        .card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-metallic-chip {
          width: 44px;
          height: 32px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 6px;
          position: relative;
          box-shadow: inset 1px 1px 2px rgba(255,255,255,0.4);
        }
        .card-metallic-chip::after {
          content: '';
          position: absolute;
          top: 6px;
          left: 10px;
          width: 24px;
          height: 20px;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 4px;
        }
        .card-number-display {
          font-family: 'Courier New', Courier, monospace;
          font-size: 1.4rem;
          letter-spacing: 2px;
          word-spacing: 4px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.6);
          margin: 16px 0;
          color: #ffffff;
        }
        .card-foot {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .card-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.7;
          margin-bottom: 2px;
        }
        .card-value {
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
        }
        
        /* Card Back Styling */
        .card-back {
          transform: rotateY(180deg);
          padding: 20px 0;
          justify-content: space-between;
        }
        .card-mag-strip {
          height: 48px;
          background: #111827;
          width: 100%;
          margin-top: 10px;
        }
        .card-signature-box {
          margin: 0 20px;
          height: 40px;
          display: flex;
          align-items: center;
        }
        .sig-strip {
          flex-grow: 1;
          height: 100%;
          background: rgba(255, 255, 255, 0.85);
          border-radius: 4px 0 0 4px;
        }
        .cvv-display {
          width: 50px;
          height: 100%;
          background: #ffffff;
          border-radius: 0 4px 4px 0;
          color: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-family: 'Courier New', Courier, monospace;
          border-left: 1px solid #d1d5db;
        }
        .card-back-foot {
          text-align: center;
        }

        /* Order Cart Summary Panel */
        .summary-column {
          display: flex;
          flex-direction: column;
        }
        .summary-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 20px;
          text-align: left;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .summary-item-img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          background: rgba(0,0,0,0.15);
          border: 1px solid var(--border-color);
          object-fit: contain;
          padding: 4px;
        }
        .summary-item-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .summary-item-qty {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .summary-item-price {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .summary-breakdown {
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
          text-align: left;
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .total-row {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 6px;
        }

        /* Success & Tracker Details */
        .success-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          margin-bottom: 24px;
        }
        .success-icon-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(34, 211, 238, 0.1);
          border: 2px solid var(--accent-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-secondary);
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Timeline Tracker Graphic */
        .tracker-timeline-visual {
          position: relative;
          padding: 20px 0 40px 0;
          margin-bottom: 20px;
        }
        .tracker-trail {
          position: absolute;
          top: 36px;
          left: 4%;
          width: 92%;
          height: 4px;
          background: var(--border-color);
          z-index: 0;
        }
        .tracker-trail-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
          box-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
          transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tracker-milestones {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }
        .milestone-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          width: 80px;
        }
        .milestone-bubble {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-surface-solid);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all var(--transition-normal);
        }
        .milestone-lbl {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: all var(--transition-normal);
        }
        .milestone-node.active .milestone-bubble {
          border-color: var(--accent-secondary);
          color: var(--accent-secondary);
          box-shadow: 0 0 12px var(--accent-glow);
          background: var(--bg-surface-hover);
        }
        .milestone-node.active .milestone-lbl {
          color: var(--text-primary);
        }

        .tracker-current-status-box {
          background: var(--bg-surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          text-align: left;
        }

        .tracker-simulation-controls {
          border-top: 1px dashed var(--border-color);
          padding-top: 20px;
          text-align: left;
        }

        .flip-h {
          transform: scaleX(-1);
        }

        /* Printable Receipt styles */
        .receipt-tag {
          font-size: 0.7rem;
          font-weight: 800;
          background: var(--accent-glow);
          color: var(--accent-secondary);
          border: 1px solid var(--accent-secondary);
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }
        .receipt-address-details {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        @media(min-width: 640px) {
          .receipt-address-details {
            grid-template-columns: 1fr 1fr;
          }
        }
        .address-block h5 {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .address-block p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .receipt-item-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          font-size: 0.9rem;
        }
        .receipt-breakdown {
          border-top: 1px solid var(--border-color);
          margin-top: 20px;
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .grand-total {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--accent-secondary);
          border-top: 1px dashed var(--border-color);
          padding-top: 12px;
          margin-top: 4px;
        }

        /* Secure Payment spinner */
        .auth-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.05);
          border-top: 3px solid var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-top: 24px;
        }
        .scanner-orb {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--accent-glow);
          border: 2px solid var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
        }
        .shield-pulse {
          animation: shieldPulse 1.5s ease-in-out infinite;
        }
        @keyframes shieldPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .processing-container {
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Print Override styles */
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible !important;
          }
          #printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #printable-receipt * {
            color: #000000 !important;
            border-color: #e5e7eb !important;
            background: transparent !important;
            box-shadow: none !important;
          }
          .receipt-tag {
            border-color: #000000 !important;
            color: #000000 !important;
          }
          .grand-total {
            color: #000000 !important;
          }
        }
      `}</style>

    </div>
  );
}
