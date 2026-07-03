import React, { useState } from 'react';
import { Search, SlidersHorizontal, Tag } from 'lucide-react';

export default function HomeFilterBar({ onSearch }) {
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ category, priceRange, searchQuery });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    onSearch({ category: val, priceRange, searchQuery });
  };

  const handlePriceChange = (val) => {
    setPriceRange(val);
    onSearch({ category, priceRange: val, searchQuery });
  };

  return (
    <div 
      className="container"
      style={{
        marginTop: '-40px',
        marginBottom: '60px',
        position: 'relative',
        zIndex: 10
      }}
    >
      <form 
        onSubmit={handleSearchSubmit}
        className="glass-panel filter-bar-grid"
        style={{
          padding: '24px 32px',
          borderRadius: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          alignItems: 'center',
          background: 'var(--bg-surface-hover)',
          border: '1px solid var(--border-hover)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Dropdown Select Column */}
        {/* Dropdown Select Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
          <label 
            style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Tag size={12} style={{ color: 'var(--accent-secondary)' }} />
            Category
          </label>
          <select 
            value={category} 
            onChange={handleCategoryChange}
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
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Gear">Gear</option>
          </select>
        </div>

        {/* Radio Buttons Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
          <label 
            style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <SlidersHorizontal size={12} style={{ color: 'var(--accent-primary)' }} />
            Price Range
          </label>
          <div 
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              height: '46px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
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
                  name="home-price-range"
                  value={range.id}
                  checked={priceRange === range.id}
                  onChange={() => handlePriceChange(range.id)}
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

        {/* Search Bar Input & Search Button Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
          <label 
            style={{ 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              visibility: 'hidden', /* hidden placeholder to align grid elements */
              display: 'none',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            className="search-label"
          >
            Search catalog
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
              type="submit" 
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
      </form>

      <style>{`
        .filter-bar-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        .custom-radio:checked::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
        }
        .custom-radio:focus-visible {
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        @media (min-width: 992px) {
          .filter-bar-grid {
            grid-template-columns: 1fr 1.3fr 1.5fr !important;
          }
          .search-label {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
