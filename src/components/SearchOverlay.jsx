import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const SearchOverlay = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Reset query on open
  useEffect(() => {
    if (isSearchOpen) {
      setQuery(''); 
      setResults([]);
    }
  }, [isSearchOpen]);

  // Filter logic
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const lowerQ = query.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(lowerQ) || 
      p.category.toLowerCase().includes(lowerQ)
    );
    setResults(filtered);
  }, [query, products]);

  const handleNavigate = (id) => {
    setIsSearchOpen(false);
    navigate(`/product/${id}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-corc-black/95 backdrop-blur-md flex flex-col pt-32 px-6"
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-4xl mx-auto w-full">
            {/* Input Field */}
            <div className="relative border-b border-white/20">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-corc-gold" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search catalog..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent py-6 pl-10 text-3xl font-serif text-white outline-none placeholder:text-gray-700"
              />
            </div>

            {/* Results Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {results.map(product => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleNavigate(product.id)}
                  className="flex items-center gap-4 p-4 border border-white/5 hover:border-corc-gold/50 cursor-pointer bg-white/5 transition-colors group"
                >
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img src={product.imageUrls[0]} className="w-16 h-20 object-cover" alt={product.name} />
                  ) : <div className="w-16 h-20 bg-gray-800" />}
                  <div className="flex-1">
                    <h4 className="font-serif text-lg group-hover:text-corc-gold transition-colors">{product.name}</h4>
                    <p className="text-xs text-gray-500 uppercase">{product.category}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white -translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                </motion.div>
              ))}

              {query && results.length === 0 && (
                <p className="text-gray-500 text-center col-span-2 pt-10">
                  No results found for "{query}"
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;