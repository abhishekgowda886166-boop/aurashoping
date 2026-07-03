import React, { useState } from 'react';
import { Search, ShoppingCart, Star, Minus, Plus } from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Aura Watch Pro',
    price: 20499,
    discount: 15,
    image: '/smartwatch.png',
    category: 'Electronics',
    rating: 4.8,
    reviews: 124,
    description: 'Sleek round OLED display smartwatch featuring custom widgets, high-fidelity vitals logging, and elegant dark titanium build.'
  },
  {
    id: 2,
    name: 'Aura Sound Max',
    price: 24799,
    discount: 20,
    image: '/headphones.png',
    category: 'Electronics',
    rating: 4.9,
    reviews: 208,
    description: 'Premium active noise-cancelling headphones featuring leather memory-foam cushions and an immersive 3D spatial soundscape.'
  },
  {
    id: 3,
    name: 'Aura Phone Pro',
    price: 74599,
    discount: 10,
    image: '/phone.png',
    category: 'Electronics',
    rating: 4.9,
    reviews: 312,
    description: 'Flagship borderless smartphone featuring a dark titanium frame, liquid retina OLED display, and high-fidelity camera array.'
  },
  {
    id: 4,
    name: 'Aura Band Active',
    price: 6499,
    discount: 25,
    image: '/fitness_band.png',
    category: 'Electronics',
    rating: 4.6,
    reviews: 154,
    description: 'Ultra-slim smart fitness tracker band featuring a continuous heart rate sensor, active sleep logger, and a 10-day battery life.'
  },
  {
    id: 5,
    name: 'Aura Book Ultra',
    price: 124399,
    discount: 12,
    image: '/laptop.png',
    category: 'Electronics',
    rating: 4.9,
    reviews: 187,
    description: 'High-performance developer laptop built with a magnesium alloy chassis, silent fans, and an ultra-color-accurate screen.'
  },
  {
    id: 6,
    name: 'Aura Station X',
    price: 157599,
    discount: 15,
    image: '/desktop_pc.png',
    category: 'Electronics',
    rating: 4.8,
    reviews: 73,
    description: 'Futuristic gaming desktop PC featuring custom liquid-cooling tubes, glowing RGB internals, and top-tier processor specs.'
  },
  {
    id: 7,
    name: 'Aura View 34" Curved',
    price: 41399,
    discount: 18,
    image: '/monitor.png',
    category: 'Electronics',
    rating: 4.7,
    reviews: 114,
    description: 'Ultra-wide 1500R curved gaming monitor featuring a zero-bezel screen, 165Hz refresh rate, and dynamic contrast ratios.'
  },
  {
    id: 8,
    name: 'Aura Strike Mechanical',
    price: 14799,
    discount: 15,
    image: '/keyboard.png',
    category: 'Electronics',
    rating: 4.8,
    reviews: 95,
    description: 'Premium mechanical gaming keyboard featuring hot-swappable tactile switches and fully custom RGB lighting patterns.'
  },
  {
    id: 9,
    name: 'Aura Glide Elite Mouse',
    price: 7299,
    discount: 20,
    image: '/mouse.png',
    category: 'Electronics',
    rating: 4.8,
    reviews: 168,
    description: 'Ergonomic wireless gaming mouse featuring ultra-low latency tracking, glowing side RGB stripes, and modular grip shells.'
  },
  {
    id: 10,
    name: 'Nomad Pack Pro',
    price: 10699,
    discount: 10,
    image: '/backpack.png',
    category: 'Gear',
    rating: 4.7,
    reviews: 96,
    description: 'Minimalist water-resistant commuting pack with organized tech slots, magnetic quick-latches, and dual hidden accessory pockets.'
  },
  {
    id: 11,
    name: 'Aura Type mechanical',
    price: 13199,
    discount: 15,
    image: '/keyboard.png',
    category: 'Accessories',
    rating: 4.8,
    reviews: 84,
    description: 'Custom 75% tactile mechanical keyboard featuring hot-swappable keycaps, sound-damping foam, and vibrant dynamic backlighting.'
  },
  {
    id: 12,
    name: 'Aura Case Pro',
    price: 2399,
    discount: 30,
    image: '/phone_case.png',
    category: 'Accessories',
    rating: 4.7,
    reviews: 142,
    description: 'Ultra-thin drop-proof liquid silicone phone case featuring integrated magnetic alignment rings and a matte tactile surface.'
  },
  {
    id: 13,
    name: 'Aura Link Cable',
    price: 1599,
    discount: 35,
    image: '/charging_cable.png',
    category: 'Accessories',
    rating: 4.8,
    reviews: 215,
    description: 'Rugged braided USB-C to USB-C charging cord featuring reinforcing strain relief joints and a subtle active neon status LED.'
  },
  {
    id: 14,
    name: 'Aura Glide Travel',
    price: 3199,
    discount: 20,
    image: '/travel_mouse.png',
    category: 'Accessories',
    rating: 4.7,
    reviews: 88,
    description: 'Compact wireless travel mouse featuring pocketable flat ergonomics, silent switches, and long-lasting rechargeable batteries.'
  },
  {
    id: 15,
    name: 'Aura Hub 7-in-1',
    price: 3999,
    discount: 15,
    image: '/usb_hub.png',
    category: 'Accessories',
    rating: 4.8,
    reviews: 104,
    description: 'Unibody aluminum multiport hub adapter containing standard HDMI ports, USB-A slots, card readers, and USB-C pass-through ports.'
  },
  {
    id: 16,
    name: 'Aura Drive 128GB',
    price: 1999,
    discount: 40,
    image: '/flash_drive.png',
    category: 'Accessories',
    rating: 4.6,
    reviews: 198,
    description: 'Ultra-durable solid metal USB 3.2 flash drive featuring high-speed data read capabilities and an integrated lanyard loop.'
  },
  {
    id: 17,
    name: 'Aura Flash 256GB',
    price: 2799,
    discount: 30,
    image: '/microsd_card.png',
    category: 'Accessories',
    rating: 4.8,
    reviews: 127,
    description: 'High-performance Class 10 U3 microSD memory card optimized for 4K video recording, mobile gaming, and swift data backups.'
  },
  {
    id: 18,
    name: 'Aura Buds Wired',
    price: 2399,
    discount: 25,
    image: '/wired_earphones.png',
    category: 'Accessories',
    rating: 4.5,
    reviews: 164,
    description: 'Premium wired in-ear earphones featuring robust braided cabling, gold-plated audio jacks, and inline microphone modules.'
  },
  {
    id: 19,
    name: 'Aura Strike Mouse',
    price: 6499,
    discount: 15,
    image: '/mouse.png',
    category: 'Gear',
    rating: 4.8,
    reviews: 112,
    description: 'Ergonomic high-precision gaming mouse featuring low-latency wireless tracking, customizable side grip panels, and custom macro keys.'
  },
  {
    id: 20,
    name: 'Aura Strike Keyboard',
    price: 13999,
    discount: 12,
    image: '/keyboard.png',
    category: 'Gear',
    rating: 4.9,
    reviews: 145,
    description: 'Professional mechanical gaming keyboard featuring hot-swappable yellow switches, dampening layers, and custom glowing patterns.'
  },
  {
    id: 21,
    name: 'Aura Freeze Pad',
    price: 3699,
    discount: 20,
    image: '/laptop.png',
    category: 'Gear',
    rating: 4.7,
    reviews: 82,
    description: 'Magnesium-alloy laptop cooling station featuring adjustable tilt stand angles, integrated silent fans, and secondary USB docks.'
  },
  {
    id: 22,
    name: 'Aura Dock Station',
    price: 7299,
    discount: 15,
    image: '/usb_hub.png',
    category: 'Gear',
    rating: 4.8,
    reviews: 93,
    description: 'Premium aluminum desktop docking hub station featuring dual display outputs, ethernet slots, and rapid power-delivery ports.'
  },
  {
    id: 23,
    name: 'Aura Pods Active',
    price: 9799,
    discount: 22,
    image: '/headphones.png',
    category: 'Gear',
    rating: 4.8,
    reviews: 204,
    description: 'Premium active noise-cancelling wireless earbuds featuring custom spatial audio, sweat resistance, and compact charging cases.'
  },
  {
    id: 24,
    name: 'Aura Focus 50mm',
    price: 28999,
    discount: 10,
    image: '/smartwatch.png',
    category: 'Gear',
    rating: 4.9,
    reviews: 58,
    description: 'Ultra-sharp f/1.8 aperture portrait camera lens featuring multi-coated optical glass elements and swift silent focus motors.'
  },
  {
    id: 25,
    name: 'Aura Power 20K',
    price: 4899,
    discount: 25,
    image: '/phone_case.png',
    category: 'Gear',
    rating: 4.8,
    reviews: 134,
    description: 'Heavy-duty 20000mAh external battery power bank featuring multi-device charging support and robust travel casing.'
  },
  {
    id: 26,
    name: 'Aura Charge 65W GaN',
    price: 3199,
    discount: 20,
    image: '/charging_cable.png',
    category: 'Gear',
    rating: 4.8,
    reviews: 172,
    description: 'Ultra-compact GaN fast wall charger adapter block equipped with multi-port outputs and smart device power negotiation.'
  }
];

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Gear'];

export default function Products({
  onAddToCart,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  onBackToHome,
  onNavigateToServices
}) {
  const [localQuantities, setLocalQuantities] = useState({});
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const handleUpdateLocalQuantity = (productId, val) => {
    setLocalQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + val)
    }));
  };

  const toggleProductSelection = (id) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddSelectedToCart = () => {
    selectedProductIds.forEach(id => {
      const prod = INITIAL_PRODUCTS.find(p => p.id === id);
      if (prod) {
        const discountedPrice = Math.round(prod.price * (1 - (prod.discount || 0) / 100));
        onAddToCart({
          ...prod,
          price: discountedPrice,
          originalPrice: prod.price
        }, localQuantities[id] || 1);
      }
    });
    setSelectedProductIds([]);
  };

  const filteredProducts = INITIAL_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

    let matchesPrice = true;
    if (priceRange === 'under-150') {
      matchesPrice = product.price < 10000;
    } else if (priceRange === 'above-150') {
      matchesPrice = product.price >= 10000;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          fill={i <= floorRating ? 'var(--accent-secondary)' : 'none'}
          stroke={i <= floorRating ? 'var(--accent-secondary)' : 'var(--text-muted)'}
          style={{ marginRight: '2px' }}
        />
      );
    }
    return stars;
  };

  return (
    <section
      id="products"
      className="section-padding"
      style={{
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        background: 'radial-gradient(ellipse at center, var(--bg-grid) 0%, var(--bg-base) 100%)'
      }}
    >
      <div className="container">
        {/* Products Page Sub-Navigation Bar */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            borderRadius: '14px',
            marginBottom: '24px',
            background: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            onClick={onBackToHome}
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
            ← Back to Home
          </button>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '4px', cursor: 'default' }}>
              Products
            </span>
            <button
              onClick={onNavigateToServices}
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
              Services →
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '48px',
            gap: '12px'
          }}
        >
          <div className="badge badge-glow">Catalog</div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800 }}>
            Our Featured <span className="gradient-text">Products</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '580px' }}>
            Check out our modern collection of high-performance tools and gear tailored to integrate seamlessly with your modern workflows.
          </p>
        </div>

        {/* Filter Controls (Select + Radios + Search Button) */}
        <div
          className="glass-panel products-filter-bar"
          style={{
            padding: '24px',
            borderRadius: '20px',
            marginBottom: '40px',
            background: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-color)'
          }}
        >
          {/* Dropdown Select Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Category
            </label>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="input-field"
              style={{
                cursor: 'pointer',
                background: 'var(--bg-surface-solid)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center'
              }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {/* Radio Buttons Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Price Range
            </label>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', height: '46px', alignItems: 'center', justifyContent: 'center' }}>
              {[
                { id: 'All', label: 'All Prices' },
                { id: 'under-150', label: 'Under ₹10,000' },
                { id: 'above-150', label: 'Over ₹10,000' }
              ].map((range) => (
                <label
                  key={range.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: priceRange === range.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    transition: 'color var(--transition-fast)'
                  }}
                >
                  <input
                    type="radio"
                    name="products-price-range"
                    value={range.id}
                    checked={priceRange === range.id}
                    onChange={() => setPriceRange(range.id)}
                    style={{
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '2px solid var(--border-color)',
                      background: priceRange === range.id ? 'var(--accent-gradient)' : 'var(--bg-surface-solid)',
                      outline: 'none',
                      transition: 'all var(--transition-fast)',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    className="custom-radio"
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          {/* Search Box Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'none', justifyContent: 'center', alignItems: 'center' }} className="search-label">
              Search Products
            </label>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '44px' }}
                />
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '0.95rem'
                }}
              >
                Search
              </button>
            </div>
          </div>

          {/* CSS styling injection */}
          <style>{`
            .products-filter-bar {
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
            }
            @media (min-width: 992px) {
              .products-filter-bar {
                grid-template-columns: 1fr 1.3fr 1.5fr !important;
              }
              .search-label {
                display: block !important;
              }
            }
          `}</style>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '32px'
            }}
          >
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="glass-panel glass-panel-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '100%'
                }}
              >
                {/* Product Image Holder */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1.1/1',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    borderBottom: '1px solid var(--border-color)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Absolute Selection Button Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProductSelection(product.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      border: '2px solid',
                      borderColor: selectedProductIds.includes(product.id) ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.4)',
                      background: selectedProductIds.includes(product.id) ? 'var(--accent-secondary)' : 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: selectedProductIds.includes(product.id) ? '0 0 10px var(--accent-secondary)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                    aria-label="Select product"
                  >
                    {selectedProductIds.includes(product.id) && (
                      <span style={{ color: '#000000', fontSize: '0.85rem', fontWeight: 900 }}>✓</span>
                    )}
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '85%',
                      height: '85%',
                      objectFit: 'contain',
                      transition: 'transform var(--transition-slow)'
                    }}
                    className="product-card-img"
                  />
                  <div
                    className="badge badge-glow"
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      fontSize: '0.65rem'
                    }}
                  >
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <div
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    gap: '12px',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                      {product.name}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      {product.discount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>
                            {product.discount}% OFF
                          </span>
                        </div>
                      )}
                      <span
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: 'var(--accent-secondary)'
                        }}
                      >
                        ₹{Math.round(product.price * (1 - (product.discount || 0) / 100)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex' }}>
                      {renderStars(product.rating)}
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      flexGrow: 1
                    }}
                  >
                    {product.description}
                  </p>

                  {/* Quantity Selection Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '12px',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateLocalQuantity(product.id, -1)}
                        className="btn-icon"
                        style={{ width: '28px', height: '28px', borderRadius: '6px', minWidth: 'auto', padding: 0 }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                        {localQuantities[product.id] || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateLocalQuantity(product.id, 1)}
                        className="btn-icon"
                        style={{ width: '28px', height: '28px', borderRadius: '6px', minWidth: 'auto', padding: 0 }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      const discountedPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
                      onAddToCart({
                        ...product,
                        price: discountedPrice,
                        originalPrice: product.price
                      }, localQuantities[product.id] || 1);
                    }}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.95rem',
                      borderRadius: '12px',
                      marginTop: '8px'
                    }}
                  >
                    <ShoppingCart size={16} />
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="glass-panel"
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              borderRadius: '20px'
            }}
          >
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              No products found matching your filter criteria. Try searching for something else!
            </p>
          </div>
        )}
      </div>

      {/* Floating Bulk Selection Action Bar */}
      {selectedProductIds.length > 0 && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            width: '90%',
            maxWidth: '560px',
            padding: '16px 24px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--accent-secondary)',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {selectedProductIds.length}
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
              item{selectedProductIds.length !== 1 && 's'} selected
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setSelectedProductIds([])}
              className="btn btn-secondary"
              style={{ padding: '10px 22px', fontSize: '0.80rem', borderRadius: '12px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddSelectedToCart}
              className="btn btn-primary"
              style={{
                padding: '10px 22px',
                fontSize: '0.80rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShoppingCart size={14} />
              Add Selected
            </button>
          </div>
        </div>
      )}

      <style>{`
        .product-card-img:hover {
          transform: scale(1.1);
        }
        @media (min-width: 769px) {
          .filters-row {
            flex-direction: row !important;
          }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 40px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
