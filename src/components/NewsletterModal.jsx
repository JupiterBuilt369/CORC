import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Check } from 'lucide-react';

const NewsletterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const hasSeen = localStorage.getItem('corc-newsletter-seen');
    
    if (!hasSeen) {
      // Show after 4 seconds for a "natural" feel
      const timer = setTimeout(() => setIsOpen(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that the user closed it so we don't annoy them again
    localStorage.setItem('corc-newsletter-seen', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      // Store success state
      localStorage.setItem('corc-newsletter-seen', 'true');
      
      // Auto close after showing success message
      setTimeout(() => setIsOpen(false), 2500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 100, scale: 0.9 }} 
            className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[600px] h-auto md:h-[400px] bg-corc-dark border border-white/10 z-[95] shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Image (Desktop only) */}
            <div className="hidden md:block w-1/2 relative bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600" 
                alt="Exclusive Access" 
                className="w-full h-full object-cover opacity-60 grayscale mix-blend-overlay" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-corc-dark to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-corc-gold text-xs uppercase tracking-[0.2em] mb-1">Season 01</p>
                <h3 className="text-white font-serif text-2xl">Urban Decay</h3>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                  <div className="w-16 h-16 bg-corc-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-corc-gold" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mb-2">Welcome Inside.</h3>
                  <p className="text-gray-400 text-sm">Check your inbox for your access code.</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-3xl font-serif mb-3">Unlock <span className="text-corc-gold">Access</span></h2>
                  <p className="text-gray-400 text-xs leading-relaxed mb-8">
                    Join the inner circle. Get early access to drops, exclusive content, and 10% off your first order.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER YOUR EMAIL" 
                        className="w-full bg-transparent border-b border-white/20 py-3 pl-8 text-sm outline-none focus:border-corc-gold transition-colors placeholder:text-gray-700"
                      />
                    </div>
                    
                    <button 
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-corc-gold text-black uppercase font-bold text-xs tracking-[0.2em] hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? 'Processing...' : 'Join The Club'}
                      {!status === 'loading' && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>

                  <button 
                    onClick={handleClose}
                    className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    No thanks, I prefer paying full price
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;