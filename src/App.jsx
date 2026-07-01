import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import Contact from './components/Contact';
import Login from './components/Login';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

export default function App() {
  const [page, setPage] = useState('home'); // 'home', 'products', 'services', 'contact', 'login'

  // Shared filter states
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange]       = useState('All');

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('aura_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme]           = useState('dark');
  const [activeSection, setActiveSection] = useState('home');

  // Auth state
  const [user, setUser] = useState(() => localStorage.getItem('aura_user') || null);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  // Theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
  }, [theme]);

  // Active section scroll detection (home page only)
  useEffect(() => {
    if (page !== 'home') {
      setActiveSection('products');
      return;
    }
    const handleScroll = () => {
      const sections = ['home', 'services', 'contact'];
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  /* ── Cart operations ── */
  const handleAddToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) { handleRemoveItem(id); return; }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const handleClearCart  = ()  => setCart([]);
  const handleThemeToggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  /* ── Auth ── */
  const handleLoginSuccess = (username) => {
    setUser(username);
    localStorage.setItem('aura_user', username);
    setPage('products');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aura_user');
    setPage('home');
  };

  /* ── Navigation ── */
  const handlePageNavigation = (targetPage) => {
    if (targetPage === 'products' && !user) {
      setPage('login');
      return;
    }
    setPage(targetPage);
  };

  /* ── Home search / filter bar ── */
  const handleHomeSearch = ({ category, priceRange: pr, searchQuery: sq }) => {
    setActiveCategory(category);
    setPriceRange(pr);
    setSearchQuery(sq);
    setPage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Ambient background */}
      <div className="bg-ambient">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
      </div>

      {/* Header */}
      <Header
        cartCount={totalCartCount}
        onCartToggle={() => setIsCartOpen(true)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        activeSection={activeSection}
        page={page}
        onNavigate={handlePageNavigation}
        user={user}
        onLogout={handleLogout}
      />

      {/* Pages */}
      <main>
        {page === 'home' && (
          <Hero onGetStarted={() => handlePageNavigation('products')} />
        )}
        {page === 'products' && (
          <Products
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            onBackToHome={() => handlePageNavigation('home')}
            onNavigateToServices={() => handlePageNavigation('services')}
          />
        )}
        {page === 'services' && (
          <Services
            onBackToProducts={() => handlePageNavigation('products')}
            onBackToHome={() => handlePageNavigation('home')}
            onNavigateToContact={() => handlePageNavigation('contact')}
          />
        )}
        {page === 'contact' && (
          <Contact
            onBackToServices={() => handlePageNavigation('services')}
            onBackToHome={() => handlePageNavigation('home')}
          />
        )}
        {page === 'login' && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={() => handlePageNavigation('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}