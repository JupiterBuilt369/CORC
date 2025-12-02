import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, CheckCircle, Tag, CreditCard, Lock, MapPin, 
  ChevronRight, ShieldCheck, ShoppingBag 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Checkout = () => {
  const { 
    cart, cartTotal, setIsCartOpen, user, placeOrder,
    addresses, cards // Get saved data from Profile
  } = useStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
  // Selection State
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || 'new');
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || 'new');

  // Form State (For new entries)
  const [newAddress, setNewAddress] = useState({ firstName: '', lastName: '', street: '', city: '', zip: '' });
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  
  // Promo
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ type: '', text: '' });

  // Update selection if addresses/cards change (e.g. initial load)
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === 'new') setSelectedAddressId(addresses[0].id);
    if (cards.length > 0 && selectedCardId === 'new') setSelectedCardId(cards[0].id);
  }, [addresses, cards]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'CORC20') {
      const val = Math.round(cartTotal * 0.2);
      setDiscount(val);
      setPromoMessage({ type: 'success', text: `Code Applied: -$${val}` });
    } else {
      setDiscount(0);
      setPromoMessage({ type: 'error', text: 'Invalid Code' });
    }
  };

  const finalTotal = cartTotal - discount;

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare Order Data
    const shippingInfo = selectedAddressId === 'new' 
      ? newAddress 
      : addresses.find(a => a.id === selectedAddressId);

    // Simulate Gateway
    setTimeout(() => {
      const order = placeOrder({
        total: finalTotal,
        shipping: shippingInfo,
        items: cart
      });
      setOrderData(order);
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  // --- EMPTY CART STATE ---
  if (cart.length === 0 && !success) {
    return (
      <div className="pt-32 px-6 min-h-screen flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-16 h-16 text-gray-700 mb-6" />
        <h2 className="text-3xl font-serif mb-4">Your bag is empty.</h2>
        <button onClick={() => navigate('/shop')} className="text-corc-gold border-b border-corc-gold pb-1 hover:text-white hover:border-white transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }

  // --- SUCCESS STATE ---
  if (success && orderData) {
    return (
      <div className="pt-32 px-6 min-h-screen flex flex-col items-center justify-center text-center grid-bg">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-5xl font-serif mb-4">Order Confirmed</h1>
          <p className="text-gray-400 mb-2">Order ID: <span className="text-white font-mono">{orderData.id}</span></p>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Thank you, {user?.name || 'Guest'}. A confirmation email has been sent.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setIsCartOpen(false); navigate('/profile'); }} className="border border-white/20 px-8 py-3 uppercase font-bold text-xs tracking-widest hover:border-corc-gold hover:text-corc-gold transition-colors">
              View Receipt
            </button>
            <button onClick={() => { setIsCartOpen(false); navigate('/'); }} className="bg-white text-black px-8 py-3 uppercase font-bold text-xs tracking-widest hover:bg-corc-gold transition-colors">
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 pb-20">
        
        {/* LEFT COLUMN: CHECKOUT FORM */}
        <div>
          <h2 className="text-3xl font-serif mb-8">Secure <span className="text-corc-gold">Checkout</span></h2>
          <form onSubmit={handlePay} className="space-y-10">
            
            {/* 1. SHIPPING DETAILS */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h3>
              
              <div className="space-y-3">
                {/* Saved Addresses */}
                {addresses.map(addr => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 border cursor-pointer transition-all flex justify-between items-center ${
                      selectedAddressId === addr.id ? 'border-corc-gold bg-white/5' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-serif text-white">{addr.type}</p>
                      <p className="text-xs text-gray-400">{addr.street}, {addr.city}</p>
                    </div>
                    {selectedAddressId === addr.id && <div className="w-3 h-3 bg-corc-gold rounded-full shadow-[0_0_10px_#c6a87c]" />}
                  </div>
                ))}

                {/* New Address Option */}
                <div 
                  onClick={() => setSelectedAddressId('new')}
                  className={`p-4 border cursor-pointer transition-all flex justify-between items-center ${
                    selectedAddressId === 'new' ? 'border-corc-gold bg-white/5' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-sm font-serif text-white">Use a different address</span>
                  {selectedAddressId === 'new' && <div className="w-3 h-3 bg-corc-gold rounded-full shadow-[0_0_10px_#c6a87c]" />}
                </div>

                {/* New Address Form (Collapsible) */}
                <AnimatePresence>
                  {selectedAddressId === 'new' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-4 pt-2"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="First Name" onChange={e => setNewAddress({...newAddress, firstName: e.target.value})} className="bg-black border border-white/20 p-3 text-sm focus:border-corc-gold outline-none" />
                        <input required placeholder="Last Name" onChange={e => setNewAddress({...newAddress, lastName: e.target.value})} className="bg-black border border-white/20 p-3 text-sm focus:border-corc-gold outline-none" />
                      </div>
                      <input required placeholder="Street Address" onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full bg-black border border-white/20 p-3 text-sm focus:border-corc-gold outline-none" />
                      <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="City" onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="bg-black border border-white/20 p-3 text-sm focus:border-corc-gold outline-none" />
                        <input required placeholder="Zip Code" onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="bg-black border border-white/20 p-3 text-sm focus:border-corc-gold outline-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 2. PAYMENT DETAILS */}
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Method
              </h3>

              <div className="space-y-3">
                {/* Saved Cards */}
                {cards.map(card => (
                  <div 
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`p-4 border cursor-pointer transition-all flex justify-between items-center ${
                      selectedCardId === card.id ? 'border-corc-gold bg-white/5' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-serif text-white">{card.type} •••• {card.last4}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Expires {card.expiry}</p>
                      </div>
                    </div>
                    {selectedCardId === card.id && <div className="w-3 h-3 bg-corc-gold rounded-full shadow-[0_0_10px_#c6a87c]" />}
                  </div>
                ))}

                {/* New Card Option */}
                <div 
                  onClick={() => setSelectedCardId('new')}
                  className={`p-4 border cursor-pointer transition-all flex justify-between items-center ${
                    selectedCardId === 'new' ? 'border-corc-gold bg-white/5' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-sm font-serif text-white">Enter new card details</span>
                  {selectedCardId === 'new' && <div className="w-3 h-3 bg-corc-gold rounded-full shadow-[0_0_10px_#c6a87c]" />}
                </div>

                {/* New Card Form */}
                <AnimatePresence>
                  {selectedCardId === 'new' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-4 pt-2"
                    >
                      <div className="relative">
                        <input required placeholder="Card Number" maxLength="19" onChange={e => setNewCard({...newCard, number: e.target.value})} className="w-full bg-black border border-white/20 p-3 pl-10 text-sm focus:border-corc-gold outline-none font-mono" />
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="MM/YY" maxLength="5" onChange={e => setNewCard({...newCard, expiry: e.target.value})} className="bg-black border border-white/20 p-3 text-sm focus:border-corc-gold outline-none text-center" />
                        <input required placeholder="CVC" maxLength="3" onChange={e => setNewCard({...newCard, cvc: e.target.value})} className="bg-black border border-white/20 p-3 text-sm focus:border-corc-gold outline-none text-center" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* PAY BUTTON */}
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-5 bg-corc-gold text-black uppercase font-bold tracking-[0.2em] hover:bg-white transition-colors flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(198,168,124,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Pay ${finalTotal} <ShieldCheck className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
              Secure SSL Encrypted Transaction
            </p>

          </form>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="bg-corc-dark p-8 border border-white/5 h-fit sticky top-32">
          <h3 className="text-xl font-serif mb-6 pb-4 border-b border-white/10">Order Summary</h3>
          <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.uniqueId} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover border border-white/10" />
                <div className="flex-1">
                  <h4 className="font-serif text-sm text-white">{item.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase mt-1">Size: {item.size}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                    <span className="text-sm text-corc-gold">${item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-6 pt-4 border-t border-white/10">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-2">
              <Tag className="w-3 h-3" /> Promo Code
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="TRY 'CORC20'" 
                className="flex-1 bg-black border border-white/20 px-4 py-3 text-xs uppercase outline-none focus:border-corc-gold transition-colors"
              />
              <button 
                onClick={handleApplyPromo}
                type="button"
                className="bg-white text-black px-4 py-3 text-xs font-bold uppercase hover:bg-corc-gold transition-colors"
              >
                Apply
              </button>
            </div>
            {promoMessage.text && (
              <p className={`text-xs mt-2 ${promoMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {promoMessage.text}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>${cartTotal}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-${discount}</span></div>}
            <div className="flex justify-between text-gray-400"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between text-xl font-serif text-white pt-4 border-t border-white/10 mt-4">
              <span>Total</span>
              <span className="text-corc-gold">${finalTotal}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;