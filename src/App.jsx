import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Services from './components/Services';
import Contact from './components/Contact';
import Login from './components/Login';
import CheckoutWizard from './components/CheckoutWizard';
import UserProfile from './components/UserProfile';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

export default function App() {
  const [page, setPage] = useState('home'); // 'home', 'products', 'services', 'contact', 'login', 'checkout', 'profile'

  // Shared filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('aura_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('home');

  // Auth state
  const [user, setUser] = useState(() => localStorage.getItem('aura_user') || null);

  // Order History & Loyalty Points states
  const [orderHistory, setOrderHistory] = useState(() => {
    const savedHistory = localStorage.getItem('aura_order_history');
    if (savedHistory) return JSON.parse(savedHistory);
    return [
      {
        id: 'AURA-5829104',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        amount: 89.98,
        status: 'Delivered',
        items: [
          { name: 'Aurora Glass Cup', quantity: 2, price: 19.99, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=60' },
          { name: 'Cosmic Tea Leaves', quantity: 1, price: 49.99, image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=150&auto=format&fit=crop&q=60' }
        ],
        paymentMethod: 'card',
        cardBrand: 'visa',
        cardLast4: '4242'
      },
      {
        id: 'AURA-2194857',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        amount: 129.99,
        status: 'Delivered',
        items: [
          { name: 'Nebula Coffee Beans', quantity: 1, price: 129.99, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=150&auto=format&fit=crop&q=60' }
        ],
        paymentMethod: 'mobile_banking',
        upiProvider: 'gpay',
        upiDetails: 'alex@upi'
      }
    ];
  });

  const [loyaltyPoints, setLoyaltyPoints] = useState(() => {
    const savedPoints = localStorage.getItem('aura_loyalty_points');
    return savedPoints ? parseInt(savedPoints, 10) : 750;
  });

  const [profilePic, setProfilePic] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user_profile');
      return saved ? JSON.parse(saved).profilePic || null : null;
    } catch {
      return null;
    }
  });

  // Sync states to localStorage
  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_order_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('aura_loyalty_points', loyaltyPoints.toString());
  }, [loyaltyPoints]);

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
  const handleClearCart = () => setCart([]);
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
    if ((targetPage === 'products' || targetPage === 'profile' || targetPage === 'checkout') && !user) {
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
        profilePic={profilePic}
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
        {page === 'checkout' && (
          <CheckoutWizard
            cartItems={cart}
            onClearCart={handleClearCart}
            onNavigate={handlePageNavigation}
            onOrderPlaced={(order) => {
              setOrderHistory(prev => [order, ...prev]);
              setLoyaltyPoints(p => p + Math.round(order.amount));
            }}
          />
        )}
        {page === 'profile' && (
          <UserProfile
            user={user}
            orderHistory={orderHistory}
            loyaltyPoints={loyaltyPoints}
            setLoyaltyPoints={setLoyaltyPoints}
            onNavigate={handlePageNavigation}
            profilePic={profilePic}
            onProfileUpdate={(newProfile) => {
              setProfilePic(newProfile.profilePic || null);
            }}
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
        onCheckout={() => {
          setIsCartOpen(false);
          handlePageNavigation('checkout');
        }}
      />
    </div>
  );
}