import React from 'react';
import { motion } from 'framer-motion';

const Lookbook = () => {
  // Editorial Image Set
  const looks = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800",
      title: "The Noir Series",
      desc: "Structured chaos."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800",
      title: "Urban Decay",
      desc: "Reclaiming the concrete."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800",
      title: "Golden Hour",
      desc: "When the light hits the stitch."
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800",
      title: "Silence",
      desc: "Volume in the void."
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1617137968427-85924c809a10?w=800",
      title: "Fabric of Time",
      desc: "Heritage meets future."
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800",
      title: "The Final Cut",
      desc: "Precision above all."
    }
  ];

  return (
    <div className="pt-32 min-h-screen bg-corc-black">
      
      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-24 relative">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-[10rem] font-serif font-bold text-white select-none leading-none"
        >
          EDITORIAL
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 -mt-10 md:-mt-24"
        >
          <h2 className="text-2xl md:text-5xl font-serif text-white">
            Season <span className="text-corc-gold italic">01</span> / Origins
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-4">
            Tokyo &mdash; New York &mdash; Paris
          </p>
        </motion.div>
      </div>

      {/* --- EDITORIAL GRID --- */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {looks.map((look, i) => (
            <motion.div 
              key={look.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`relative group ${i % 2 === 1 ? 'md:mt-32' : ''}`} // Stagger effect
            >
              {/* Image Container */}
              <div className="relative h-[600px] md:h-[800px] overflow-hidden bg-gray-900 border border-white/5">
                <div className="absolute inset-0 bg-corc-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay pointer-events-none" />
                <img 
                  src={look.image} 
                  alt={look.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out" 
                />
                
                {/* Floating Caption */}
                <div className="absolute bottom-8 left-8 z-20">
                  <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-4">
                    <p className="text-corc-gold text-[10px] uppercase tracking-widest mb-1">Look 0{i + 1}</p>
                    <h3 className="text-2xl font-serif text-white">{look.title}</h3>
                    <p className="text-gray-400 text-xs italic mt-2">{look.desc}</p>
                  </div>
                </div>
              </div>

              {/* Decorative Number */}
              <div className="absolute -top-10 -right-10 text-[8rem] font-serif text-white/5 select-none z-0">
                {i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="text-center pb-32">
        <p className="text-gray-500 mb-6 uppercase tracking-widest text-xs">Seen enough?</p>
        <a 
          href="/shop" 
          className="inline-block border border-white/20 px-12 py-4 text-white hover:bg-white hover:text-black hover:border-white transition-all uppercase tracking-[0.2em] text-sm font-bold"
        >
          Shop The Collection
        </a>
      </div>

    </div>
  );
};

export default Lookbook;