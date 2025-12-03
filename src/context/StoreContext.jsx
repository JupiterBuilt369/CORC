import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- 1. USER STATE ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('corc-user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- 2. PERSISTENT DATA (Load from LocalStorage) ---
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('corc-products')) || []);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('corc-cart')) || []);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('corc-wishlist')) || []);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('corc-orders')) || []);
  const [addresses, setAddresses] = useState(() => JSON.parse(localStorage.getItem('corc-addresses')) || []);
  const [cards, setCards] = useState(() => JSON.parse(localStorage.getItem('corc-cards')) || []);
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem('corc-reviews')) || []);
  
  // NEW: Recently Viewed History
  const [recentlyViewed, setRecentlyViewed] = useState(() => JSON.parse(localStorage.getItem('corc-recent')) || []);

  // --- 3. UI STATES ---
  const [toasts, setToasts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- 4. INITIAL API LOAD ---
  useEffect(() => {
    if (products.length === 0 && api?.getProducts) {
      api.getProducts().then(data => {
        setProducts(data);
        localStorage.setItem('corc-products', JSON.stringify(data));
      }).catch(console.error);
    }
  }, []);

  // --- 5. SAVE EFFECTS ---
  useEffect(() => localStorage.setItem('corc-user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('corc-products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('corc-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('corc-wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('corc-orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('corc-addresses', JSON.stringify(addresses)), [addresses]);
  useEffect(() => localStorage.setItem('corc-cards', JSON.stringify(cards)), [cards]);
  useEffect(() => localStorage.setItem('corc-reviews', JSON.stringify(reviews)), [reviews]);
  useEffect(() => localStorage.setItem('corc-recent', JSON.stringify(recentlyViewed)), [recentlyViewed]);

  // --- 6. HELPER ACTIONS ---
  const addToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // --- 7. AUTH ACTIONS ---
  const registerUser = (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          name: userData.name,
          email: userData.email,
          phone: "",
          avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=c6a87c&color=000`,
          isAdmin: false
        };
        setUser(newUser);
        addToast(`Welcome, ${newUser.name}`);
        resolve(newUser);
      }, 1500);
    });
  };

  const loginUser = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Admin Backdoor
        if (email === "admin@corc.com" && password === "admin123") {
          const admin = { name: "Founder", email, isAdmin: true, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200" };
          setUser(admin);
          addToast("Welcome back, Founder");
          resolve(admin);
        } else {
          // Regular User
          const customer = { name: "Customer", email, isAdmin: false, avatar: `https://ui-avatars.com/api/?name=${email}&background=random` };
          setUser(customer);
          addToast("Welcome back");
          resolve(customer);
        }
      }, 1500);
    });
  };

  const updateUser = (data) => { setUser(prev => ({ ...prev, ...data })); addToast("Profile Updated"); };

  // --- 8. SHOP ACTIONS ---
  const addToCart = (p) => {
    setCart(prev => {
      const uid = `${p.id}-${p.size || 'M'}`;
      const ex = prev.find(x => x.uniqueId === uid);
      if (ex) return prev.map(x => x.uniqueId === uid ? { ...x, quantity: x.quantity + 1 } : x);
      return [...prev, { ...p, uniqueId: uid, quantity: 1 }];
    });
    addToast("Added to Cart");
    setIsCartOpen(true);
  };

  const removeFromCart = (uid) => setCart(prev => prev.filter(p => p.uniqueId !== uid));
  
  const updateQuantity = (uid, delta) => {
    setCart(prev => prev.map(item => {
      if (item.uniqueId === uid) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const toggleWishlist = (p) => {
    setWishlist(prev => {
      const ex = prev.find(x => x.id === p.id);
      if (ex) { addToast("Removed from Wishlist"); return prev.filter(x => x.id !== p.id); }
      addToast("Saved to Wishlist"); return [...prev, p];
    });
  };
  const isInWishlist = (id) => wishlist.some(p => p.id === id);

  // --- 9. ORDER & REVIEW ACTIONS ---
  const placeOrder = (details) => {
    const order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      status: 'Processing',
      items: cart,
      total: details.total,
      shipping: details.shipping
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    addToast("Order Placed Successfully");
    return order;
  };

  const addReview = (r) => { setReviews(prev => [r, ...prev]); addToast("Review Posted"); };
  
  const addToHistory = (p) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(x => x.id !== p.id);
      return [p, ...filtered].slice(0, 6);
    });
  };

  // --- 10. PROFILE ACTIONS ---
  const addAddress = (addr) => { setAddresses(prev => [...prev, { ...addr, id: Date.now() }]); addToast("Address Added"); };
  const removeAddress = (id) => { setAddresses(prev => prev.filter(a => a.id !== id)); addToast("Address Removed"); };
  const addCard = (card) => { setCards(prev => [...prev, { ...card, id: Date.now() }]); addToast("Card Saved"); };
  const removeCard = (id) => { setCards(prev => prev.filter(c => c.id !== id)); addToast("Card Removed"); };
  
  // --- 11. ADMIN ACTIONS ---
  const addProduct = (p) => { setProducts(prev => [{ ...p, id: Date.now() }, ...prev]); addToast("Product Created"); };
  const deleteProduct = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); addToast("Product Deleted"); };

  return (
    <AppContext.Provider value={{ 
      user, setUser, updateUser, registerUser, loginUser,
      addresses, addAddress, removeAddress,
      cards, addCard, removeCard,
      products, setProducts, addProduct, deleteProduct,
      cart, addToCart, removeFromCart, updateQuantity, cartTotal,
      wishlist, toggleWishlist, isInWishlist,
      orders, placeOrder,
      reviews, addReview,
      recentlyViewed, addToHistory,
      isCartOpen, setIsCartOpen, isSearchOpen, setIsSearchOpen, isMenuOpen, setIsMenuOpen,
      toasts, addToast, removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => useContext(AppContext);