import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useStore();

  return (
    <div className="pt-32 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-serif mb-2">Your <span className="text-corc-gold">Favorites</span></h2>
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-12">
          {wishlist.length} Items Saved
        </p>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10">
            <Heart className="w-12 h-12 text-gray-700 mb-4" />
            <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
            <Link to="/shop" className="bg-white text-black px-8 py-3 uppercase font-bold text-xs tracking-widest hover:bg-corc-gold transition-colors">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {wishlist.map((p) => (
                <motion.div 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-900 border border-white/5 group"
                >
                  <div className="relative h-96 overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <button 
                      onClick={() => toggleWishlist(p)}
                      className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-serif text-xl">{p.name}</h3>
                        <p className="text-xs text-gray-500 uppercase mt-1">{p.category}</p>
                      </div>
                      <span className="text-corc-gold">${p.price}</span>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(p)}
                      className="w-full py-3 border border-white/20 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Move to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;