import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-corc-gold text-black overflow-hidden relative z-[60]"
        >
          <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className="flex-1 text-center md:text-left">
              Season 01 Available Now
            </span>
            <span className="hidden md:block flex-1 text-center">
              Free Worldwide Shipping over $200
            </span>
            <div className="flex-1 flex justify-end gap-4">
              <span className="hidden md:inline cursor-pointer hover:underline">Currency: USD</span>
              <button onClick={() => setIsVisible(false)}>
                <X className="w-3 h-3 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBar;