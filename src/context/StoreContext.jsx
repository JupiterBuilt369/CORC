import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  addDoc,
  writeBatch,
  increment
} from 'firebase/firestore';

//create context
const AppContext = createContext();

// create Provider
export const AppProvider = ({ children }) => {


  
  // --- 1. USER STATE ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 2. PERSISTENT DATA (Load from LocalStorage) ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // NEW: Recently Viewed History
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // --- 3. UI STATES ---
  const [toasts, setToasts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- 4. AUTH & USER DATA LISTENER ---
  useEffect(() => {
    let userUnsub;
    const authUnsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Listen to user doc in real-time to handle race conditions during signup
        userUnsub = onSnapshot(doc(db, "users", firebaseUser.uid), 
          (docSnap) => {
            if (docSnap.exists()) {
              setUser({ ...firebaseUser, ...docSnap.data() });
            } else {
              setUser(firebaseUser);
            }
            setLoading(false);
          },
          (error) => {
            console.error("User profile error:", error);
            setUser(firebaseUser); // Allow login even if DB fails
            setLoading(false);
          }
        );
      } else {
        if (userUnsub) userUnsub();
        setUser(null);
        setCart([]);
        setWishlist([]);
        setOrders([]);
        setAddresses([]);
        setCards([]);
        setLoading(false);
      }
    });
    return () => {
      authUnsub();
      if (userUnsub) userUnsub();
    };
  }, []);

  // --- 5. SAVE EFFECTS ---
  // Listen for Products
  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(prods);
    });
    return unsubscribe;
  }, []);

  // Listen for User Data
  useEffect(() => {
    if (!user?.uid) return;

    const unsubCart = onSnapshot(collection(db, "users", user.uid, "cart"), (snap) => 
      setCart(snap.docs.map(d => ({ ...d.data(), uniqueId: d.id }))));

    const unsubWish = onSnapshot(collection(db, "users", user.uid, "wishlist"), (snap) => 
      setWishlist(snap.docs.map(d => ({ ...d.data(), id: d.id }))));

    const unsubOrders = onSnapshot(query(collection(db, "users", user.uid, "orders"), orderBy("date", "desc")), (snap) => 
      setOrders(snap.docs.map(d => ({ ...d.data(), id: d.id }))));

    const unsubAddr = onSnapshot(collection(db, "users", user.uid, "addresses"), (snap) => 
      setAddresses(snap.docs.map(d => ({ ...d.data(), id: d.id }))));

    const unsubCards = onSnapshot(collection(db, "users", user.uid, "cards"), (snap) => 
      setCards(snap.docs.map(d => ({ ...d.data(), id: d.id }))));

    return () => {
      unsubCart(); unsubWish(); unsubOrders(); unsubAddr(); unsubCards();
    };
  }, [user?.uid]);

  // Listen for Reviews (Global)
  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setReviews(revs);
    });
    return unsubscribe;
  }, []);

  
  // --- 6. HELPER ACTIONS ---
  const addToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // --- 7. AUTH ACTIONS ---
  const registerUser = async (userData) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const newUser = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=c6a87c&color=000`,
        isAdmin: userData.email === "admin@corc.com", // AUTO-ADMIN for this email
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, "users", res.user.uid), newUser);
      await updateProfile(res.user, { displayName: userData.name });
      addToast(`Welcome, ${newUser.name}`);
      return newUser;
    } catch (error) {
      addToast(error.message);
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile to return it for immediate use in the UI
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      const userData = userDocSnap.exists() ? { ...userCredential.user, ...userDocSnap.data() } : userCredential.user;

      addToast("Welcome back");
      return userData;
    } catch (error) {
      addToast("Login failed: " + error.message);
      throw error;
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    addToast("Logged out");
  };

  const updateUser = async (data) => {
    if (!user) return;
    try {
      // Security: Prevent updating sensitive fields like isAdmin via profile update
      const { isAdmin, ...safeData } = data;
      await updateDoc(doc(db, "users", user.uid), safeData);
      addToast("Profile Updated");
    } catch (error) {
      addToast("Update failed");
    }
  };

  // --- 8. SHOP ACTIONS ---
  const addToCart = async (p) => {
    if (!user) { addToast("Please login to shop"); return; }
    const uid = `${p.id}-${p.size || 'M'}`;
    const itemRef = doc(db, "users", user.uid, "cart", uid);
    try {
      const docSnap = await getDoc(itemRef);
      if (docSnap.exists()) {
        await updateDoc(itemRef, { quantity: docSnap.data().quantity + 1 });
      } else {
        await setDoc(itemRef, { ...p, uniqueId: uid, quantity: 1 });
      }
      addToast("Added to Cart");
      setIsCartOpen(true);
    } catch (e) { console.error(e); }
  };

  const removeFromCart = async (uid) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "cart", uid));
  };
  
  const updateQuantity = async (uid, delta) => {
    if (!user) return;
    const itemRef = doc(db, "users", user.uid, "cart", uid);
    const item = cart.find(i => i.uniqueId === uid);
    if (item) {
      const newQty = Math.max(1, item.quantity + delta);
      await updateDoc(itemRef, { quantity: newQty });
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const toggleWishlist = async (p) => {
    if (!user) { addToast("Login required"); return; }
    const itemRef = doc(db, "users", user.uid, "wishlist", p.id.toString());
    const exists = wishlist.some(x => x.id === p.id);
    if (exists) {
      await deleteDoc(itemRef);
      addToast("Removed from Wishlist");
    } else {
      await setDoc(itemRef, p);
      addToast("Saved to Wishlist");
    }
  };
  
  const isInWishlist = (id) => wishlist.some(p => p.id === id);

  // --- 9. ORDER & REVIEW ACTIONS ---
  const placeOrder = async (details) => {
    if (!user) return;
    const order = {
      date: new Date().toISOString(),
      status: 'Processing',
      items: cart,
      total: details.total,
      shipping: details.shipping,
      userId: user.uid
    };
    
    const batch = writeBatch(db);
    
    // 1. Create Order in User's subcollection
    const newOrderRef = doc(collection(db, "users", user.uid, "orders"));
    batch.set(newOrderRef, order);

    // 2. Process Cart Items (Clear cart & Decrement Stock)
    cart.forEach(item => {
      // Delete from cart
      const cartRef = doc(db, "users", user.uid, "cart", item.uniqueId);
      batch.delete(cartRef);
      
      // Decrement stock in products collection
      const productRef = doc(db, "products", item.id);
      batch.update(productRef, { stock: increment(-item.quantity) });
    });
    await batch.commit();

    addToast("Order Placed Successfully");
    return { id: newOrderRef.id, ...order };
  };

  const addReview = async (r) => { 
    await addDoc(collection(db, "reviews"), r);
    addToast("Review Posted"); 
  };
  
  const addToHistory = (p) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(x => x.id !== p.id);
      return [p, ...filtered].slice(0, 6);
    });
  };

  // --- 11. PROFILE ACTIONS ---
  const addAddress = async (addr) => { 
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "addresses"), addr);
    addToast("Address Added"); 
  };
  const removeAddress = async (id) => { 
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "addresses", id));
    addToast("Address Removed"); 
  };
  const addCard = async (card) => { 
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "cards"), card);
    addToast("Card Saved"); 
  };
  const removeCard = async (id) => { 
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "cards", id));
    addToast("Card Removed"); 
  };
  
  // --- 12. ADMIN ACTIONS ---
  const addProduct = async (p) => { 
    if (!user?.isAdmin) { addToast("Unauthorized Action"); return; }
    await addDoc(collection(db, "products"), p); 
    addToast("Product Created"); 
  };
  
  const deleteProduct = async (id) => { 
    if (!user?.isAdmin) { addToast("Unauthorized Action"); return; }
    await deleteDoc(doc(db, "products"), id); 
    addToast("Product Deleted"); 
  };

  // --- 13. SEEDING ---
  const seedDatabase = async () => {
    if (!user?.isAdmin) { addToast("Unauthorized Action"); return; }
    
    const SEED_PRODUCTS = [
      {
        id: 1,
        name: "Noir Heavyweight Tee",
        category: "T-Shirts",
        price: 55,
        description: "400gsm cotton, boxy fit, acid wash finish.",
        imageUrls: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"],
        stock: 20
      },
      {
        id: 2,
        name: "Vantablack Tech Jacket",
        category: "Outerwear",
        price: 220,
        description: "Water-resistant, multiple tactical pockets.",
        imageUrls: ["https://images.unsplash.com/photo-1551488852-7a09d38c44d5?w=800"],
        stock: 5
      },
      {
        id: 3,
        name: "Distressed Denim (Gold Stitch)",
        category: "Bottoms",
        price: 180,
        description: "Hand-distressed Japanese denim with 18k gold thread details.",
        imageUrls: ["https://images.unsplash.com/photo-1542272617-08f082287019?w=800"],
        stock: 12
      },
      {
        id: 4,
        name: "Oversized Hoodie 'ECLIPSE'",
        category: "Hoodies",
        price: 110,
        description: "Drop shoulder, french terry cotton.",
        imageUrls: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800"],
        stock: 50
      },
      {
        id: 5,
        name: "Silk Bomber 'Kyoto'",
        category: "Outerwear",
        price: 350,
        description: "Limited edition silk embroidery.",
        imageUrls: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"],
        stock: 3
      },
      {
        id: 6,
        name: "Utility Cargo Vest",
        category: "Accessories",
        price: 85,
        description: "Functional streetwear utility vest.",
        imageUrls: ["https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800"],
        stock: 15
      }
    ];
    
    const batch = writeBatch(db);
    SEED_PRODUCTS.forEach(p => {
      const ref = doc(collection(db, "products"));
      batch.set(ref, p);
    });
    await batch.commit();
    addToast("Database Seeded");
  };

  return (
    <AppContext.Provider value={{ 
      user, loading, updateUser, registerUser, loginUser, logoutUser,
      addresses, addAddress, removeAddress,
      cards, addCard, removeCard,
      products, setProducts, addProduct, deleteProduct,
      cart, addToCart, removeFromCart, updateQuantity, cartTotal,
      wishlist, toggleWishlist, isInWishlist,
      orders, placeOrder,
      reviews, addReview,
      recentlyViewed, addToHistory,
      isCartOpen, setIsCartOpen, isSearchOpen, setIsSearchOpen, isMenuOpen, setIsMenuOpen,
      toasts, addToast, removeToast,
      seedDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useStore must be used within an AppProvider');
  }
  return context;
};