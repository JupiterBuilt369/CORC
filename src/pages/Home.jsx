import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- IMPORT YOUR CUSTOM UI COMPONENTS ---
import Marquee from '../components/UI/Marquee';
import RevealText from '../components/UI/RevealText'; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* =========================================
          SECTION 1: HERO / LANDING
      ========================================= */}
      <header className="relative pt-32 pb-20 px-6 border-b border-white/10 grid-bg min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left: Text Content */}
          <div className="space-y-8 z-10">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className="inline-block px-3 py-1 border border-corc-gold/30 text-corc-gold text-[10px] uppercase tracking-widest mb-4"
            >
              New Collection 2025
            </motion.div>
            
            {/* HEADLINE WITH REVEAL ANIMATION */}
            <h1 className="text-6xl md:text-8xl font-serif leading-[0.9]">
              <div className="overflow-hidden">
                <RevealText delay={0.1}>WE ARE</RevealText>
              </div>
              <div className="overflow-hidden text-gray-500">
                <RevealText delay={0.2}>ETERNAL</RevealText>
              </div>
            </h1>
            
            {/* Description */}
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Luxury streetwear designed for the modern avant-garde. Crafted in Tokyo, worn globally.
            </p>
            
            {/* Button */}
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => navigate('/shop')} 
              className="bg-corc-gold text-black px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white transition-colors mt-8"
            >
              Explore Catalog
            </motion.button>
          </div>

          {/* Right: Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }} 
            className="relative h-[600px] w-full"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent z-10" />
             <img 
               src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000" 
               alt="Hero Model" 
               className="w-full h-full object-cover grayscale contrast-125" 
             />
          </motion.div>
        </div>
      </header>

      {/* =========================================
          SECTION 2: INFINITE SCROLL MARQUEE
      ========================================= */}
      <section className="py-8 border-b border-white/10 bg-zinc-900/50 backdrop-blur-sm">
        <Marquee 
          text="LIMITED DROP • WORLDWIDE SHIPPING • CORC CLOTHES • EST. 2025 • NO RESTOCKS" 
          speed={25} 
          className="text-white/80" 
        />
      </section>

      {/* =========================================
          SECTION 3: TEASER / CATEGORIES
      ========================================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <span className="text-corc-gold text-xs tracking-widest uppercase">The Edit</span>
            
            {/* Header with Reveal Animation */}
            <div className="text-3xl md:text-5xl mt-4 font-serif flex justify-center overflow-hidden">
               <RevealText className="inline-block">CURATED EXCELLENCE</RevealText>
            </div>
        </div>
      </section>

    </div>
  );
};

export default Home;