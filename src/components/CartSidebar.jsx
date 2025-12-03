import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Truck, Plus, Minus } from 'lucide-react'; // Added Plus/Minus icons
import { useStore } from '../context/StoreContext';

const CartSidebar = () => {
  // Get updateQuantity from the store
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal } = useStore(); 
  const navigate = useNavigate();

  const FREE_SHIPPING_THRESHOLD = 200;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm gpu-accelerated" 
            onClick={() => setIsCartOpen(false)} 
          />
          
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-corc-dark border-l border-white/10 z-[70] p-6 flex flex-col shadow-2xl gpu-accelerated"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">Your Bag</h2>
              <X className="cursor-pointer hover:text-corc-gold transition-colors" onClick={() => setIsCartOpen(false)} />
            </div>

            <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-sm">
              <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-widest">
                <Truck className="w-4 h-4 text-corc-gold" />
                {isFreeShipping ? <span className="text-green-400">Free Shipping Unlocked!</span> : <span className="text-gray-400">Add <span className="text-white">${remaining}</span> for Free Shipping</span>}
              </div>
              <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${isFreeShipping ? 'bg-green-400' : 'bg-corc-gold'}`}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50"><p className="text-sm uppercase tracking-widest">Empty Bag</p></div>
              ) : (
                cart.map(item => (
                  <div key={item.uniqueId} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-gray-900 border border-white/10 overflow-hidden relative">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      {item.category === 'Custom' && item.customDesign && (
                        <img src={item.customDesign} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 object-contain" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-serif text-sm">{item.name}</h3>
                        <p className="text-[10px] text-gray-500 uppercase mt-1">Size: {item.size || 'M'}</p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        {/* --- NEW: QUANTITY CONTROLS --- */}
                        <div className="flex items-center border border-white/20 rounded-sm">
                          <button 
                            onClick={() => updateQuantity(item.uniqueId, -1)}
                            className="px-2 py-1 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            disabled={item.quantity <= 1} // Disable minus if qty is 1
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-white px-2 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.uniqueId, 1)}
                            className="px-2 py-1 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {/* ----------------------------- */}

                        <div className="flex items-center gap-4">
                          <span className="text-corc-gold text-sm font-mono">${item.price * item.quantity}</span>
                          <button onClick={() => removeFromCart(item.uniqueId)}>
                            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/10 pt-6 mt-4">
                <div className="flex justify-between text-xl font-serif mb-4"><span>Total</span><span className="text-corc-gold">${cartTotal}</span></div>
                <button onClick={handleCheckout} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-corc-gold transition-colors">Proceed to Checkout</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;