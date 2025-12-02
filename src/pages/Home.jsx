import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <header className="relative pt-32 pb-20 px-6 border-b border-white/10 grid-bg min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
        
        {/* Text Section: Slow fade in from left */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.5, ease: "easeOut" }} 
          className="space-y-8 z-10"
        >
          <div className="inline-block px-3 py-1 border border-corc-gold/30 text-corc-gold text-[10px] uppercase tracking-widest mb-4">
            New Collection 2025
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-[0.9]">
            WE ARE <br />
            <span className="text-gray-500">ETERNAL</span>
          </h1>
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
            Luxury streetwear designed for the modern avant-garde. Crafted in Tokyo, worn globally.
          </p>
          <button 
            onClick={() => navigate('/shop')} 
            className="bg-corc-gold text-black px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white transition-colors mt-8"
          >
            Explore Catalog
          </button>
        </motion.div>

        {/* Image Section: Slower fade with delay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }} 
          className="relative h-[600px] w-full"
        >
           <div className="absolute inset-0 bg-gradient-to-tr from-corc-black via-transparent to-transparent z-10" />
           <img 
             src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000" 
             alt="Hero Model" 
             className="w-full h-full object-cover grayscale contrast-125" 
           />
        </motion.div>
      </div>
    </header>
  );
};

export default Home;