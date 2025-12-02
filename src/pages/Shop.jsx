import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, Heart, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Shop = () => {
  // 1. Get Global Data (Products & Wishlist functions)
  const { products, toggleWishlist, isInWishlist } = useStore();
  
  // 2. Local State for UI Logic
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'low', 'high'
  const [loading, setLoading] = useState(true);

  // 3. Initialize Data
  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);
      setLoading(false);
    } else {
      // If products are empty, it might be loading or actually empty
      // We set a small timeout to allow Context to fetch
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [products]);

  // 4. Filtering & Sorting Logic
  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Sort Logic
    if (sortOrder === 'low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'newest') {
      // Assuming higher ID = newer
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(result);
  }, [activeCategory, sortOrder, products]);

  // Extract unique categories dynamically
  const categories = ['All', ...new Set(products.map(p => p.category))];

  if (loading && products.length === 0) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-corc-gold w-10 h-10" /></div>;
  }

  return (
    <div className="pt-32 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER & CONTROLS --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-6">
           <div>
             <h2 className="text-5xl font-serif">
               Catalog <span className="text-corc-gold text-2xl align-top italic">2025</span>
             </h2>
             <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">
               {filteredProducts.length} Items Found
             </p>
           </div>

           <div className="flex flex-col md:flex-row gap-8 w-full md:w-auto items-start md:items-center">
             
             {/* Category Pills */}
             <div className="flex flex-wrap gap-4 md:gap-8 text-xs uppercase tracking-widest text-gray-500">
               {categories.map(cat => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`transition-colors hover:text-white ${
                     activeCategory === cat ? 'text-corc-gold font-bold' : ''
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>

             {/* Sort Dropdown */}
             <div className="relative group z-20">
               <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-white border border-white/20 px-4 py-2 hover:border-corc-gold transition-colors">
                 <SlidersHorizontal className="w-3 h-3" />
                 Sort: {sortOrder === 'newest' ? 'Newest' : sortOrder === 'low' ? 'Low Price' : 'High Price'}
                 <ChevronDown className="w-3 h-3 ml-2" />
               </button>
               
               <div className="absolute right-0 top-full mt-2 w-40 bg-corc-dark border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl">
                 <button onClick={() => setSortOrder('newest')} className="block w-full text-left px-4 py-3 text-xs uppercase hover:bg-white/5 text-gray-400 hover:text-white">Newest</button>
                 <button onClick={() => setSortOrder('low')} className="block w-full text-left px-4 py-3 text-xs uppercase hover:bg-white/5 text-gray-400 hover:text-white">Price: Low to High</button>
                 <button onClick={() => setSortOrder('high')} className="block w-full text-left px-4 py-3 text-xs uppercase hover:bg-white/5 text-gray-400 hover:text-white">Price: High to Low</button>
               </div>
             </div>

           </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative"
              >
                {/* Wishlist Button (Floating) */}
                <button 
                  onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white hover:text-red-500 transition-all"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(p.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>

                <Link to={`/product/${p.id}`}>
                  <div className="relative h-[450px] bg-gray-900 border border-white/5 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
                    />
                    
                    {/* Hover "View Details" Banner */}
                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent">
                      <span className="w-full block text-center py-3 bg-white text-black uppercase text-xs font-bold tracking-widest hover:bg-corc-gold">
                        View Details
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-lg group-hover:text-corc-gold transition-colors">{p.name}</h3>
                      <p className="text-gray-500 text-xs uppercase mt-1">{p.category}</p>
                    </div>
                    <span className="text-white text-sm font-light">${p.price}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
           <div className="py-20 text-center text-gray-500 border border-white/10 border-dashed rounded-lg">
             <p className="text-2xl font-serif mb-2">No items found.</p>
             <p className="text-sm">Try selecting a different category or adjusting your filter.</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default Shop;