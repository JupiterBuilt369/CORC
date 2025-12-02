import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- USER STATE ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('corc-user');
    return saved ? JSON.parse(saved) : { 
      name: "Founder", 
      email: "admin@corc.com", 
      phone: "+1 (555) 019-2834",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      isAdmin: true 
    };
  });

  // --- ADDRESS BOOK ---
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('corc-addresses');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: "Home", street: "123 Fashion Ave", city: "New York", zip: "10012", country: "USA", isDefault: true }
    ];
  });

  // --- PAYMENT METHODS ---
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('corc-cards');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: "Visa", last4: "4242", expiry: "12/28" }
    ];
  });

  // --- PRODUCTS ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('corc-products');
    return saved ? JSON.parse(saved) : [];
  });

  // --- CART ---
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('corc-cart');
    return saved ? JSON.parse(saved) : [];
  });

  // --- WISHLIST ---
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('corc-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // --- ORDERS ---
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('corc-orders');
    return saved ? JSON.parse(saved) : [];
  });

  // --- REVIEWS (Restored) ---
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('corc-reviews');
    return saved ? JSON.parse(saved) : [
      {
        id: 101,
        productId: 1, 
        userName: "Alex K.",
        userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
        rating: 5,
        date: "Oct 12, 2024",
        text: "The fit is absolutely perfect. Boxy but not too short.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
      }
    ];
  });

  // --- UI STATES ---
  const [toasts, setToasts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (products.length === 0) {
      if (api && api.getProducts) {
        api.getProducts().then(data => {
          setProducts(data);
          localStorage.setItem('corc-products', JSON.stringify(data));
        }).catch(err => console.error(err));
      }
    }
  }, []);

  // --- SAVE SIDE EFFECTS ---
  useEffect(() => localStorage.setItem('corc-user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('corc-addresses', JSON.stringify(addresses)), [addresses]);
  useEffect(() => localStorage.setItem('corc-cards', JSON.stringify(cards)), [cards]);
  useEffect(() => localStorage.setItem('corc-products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('corc-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('corc-wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('corc-orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('corc-reviews', JSON.stringify(reviews)), [reviews]);

  // --- TOASTS ---
  const addToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // --- ACTIONS ---
  const updateUser = (data) => { setUser(prev => ({ ...prev, ...data })); addToast("Profile Updated"); };
  const addAddress = (address) => { setAddresses(prev => [...prev, { ...address, id: Date.now() }]); addToast("Address Added"); };
  const removeAddress = (id) => { setAddresses(prev => prev.filter(a => a.id !== id)); addToast("Address Removed"); };
  const addCard = (card) => { setCards(prev => [...prev, { ...card, id: Date.now() }]); addToast("Card Saved"); };
  const removeCard = (id) => { setCards(prev => prev.filter(c => c.id !== id)); addToast("Card Removed"); };
  
  const addProduct = (newProduct) => { setProducts(prev => [{ ...newProduct, id: Date.now() }, ...prev]); addToast(`Product Created`); };
  const deleteProduct = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); addToast("Product Deleted"); };
  
  const addToCart = (product) => {
    setCart(prev => {
      const uniqueId = `${product.id}-${product.size || 'M'}`;
      const existing = prev.find(p => p.uniqueId === uniqueId);
      if (existing) return prev.map(p => p.uniqueId === uniqueId ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { ...product, uniqueId, quantity: 1 }];
    });
    addToast(`Added to Cart`);
    setIsCartOpen(true);
  };
  const removeFromCart = (uniqueId) => setCart(prev => prev.filter(p => p.uniqueId !== uniqueId));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) { addToast("Removed from Wishlist"); return prev.filter(p => p.id !== product.id); }
      addToast("Saved to Wishlist"); return [...prev, product];
    });
  };
  const isInWishlist = (id) => wishlist.some(p => p.id === id);

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      items: cart,
      total: orderDetails.total,
      shipping: orderDetails.shipping
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    addToast("Order Placed Successfully");
    return newOrder;
  };

  const addReview = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    addToast("Review Posted");
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, updateUser,
      addresses, addAddress, removeAddress,
      cards, addCard, removeCard,
      products, setProducts, addProduct, deleteProduct,
      cart, addToCart, removeFromCart, cartTotal,
      wishlist, toggleWishlist, isInWishlist,
      orders, placeOrder,
      reviews, addReview, // <--- Now exported correctly
      isCartOpen, setIsCartOpen, isSearchOpen, setIsSearchOpen, isMenuOpen, setIsMenuOpen,
      toasts, addToast, removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => useContext(AppContext);