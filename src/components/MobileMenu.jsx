import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, Twitter, Facebook } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const MobileMenu = () => {
  const { isMenuOpen, setIsMenuOpen, user } = useStore();
  const navigate = useNavigate();

  const handleLink = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const menuVars = {
    initial: { scaleY: 0 },
    animate: { 
      scaleY: 1, 
      transition: { duration: 0.5, ease: [0.12, 0, 0.39, 0] }
    },
    exit: { 
      scaleY: 0,
      transition: { delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const linkVars = {
    initial: { y: "30vh", transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] } },
    open: { y: 0, transition: { ease: [0, 0.55, 0.45, 1], duration: 0.7 } }
  };

  const containerVars = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.3, staggerChildren: 0.09, staggerDirection: 1 } }
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          variants={menuVars}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-[90] bg-corc-gold origin-top flex flex-col justify-between p-10 md:hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center text-black">
            <h2 className="text-3xl font-serif font-bold">-CORC-</h2>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Links */}
          <motion.div 
            variants={containerVars}
            initial="initial"
            animate="open"
            exit="initial"
            className="flex flex-col gap-6"
          >
            {[
              { title: "Home", path: "/" },
              { title: "Shop Catalog", path: "/shop" },
              { title: "Wishlist", path: "/wishlist" },
              { title: "Cart", path: "/checkout" }, // Direct link to checkout for mobile
            ].map((link, index) => (
              <div key={index} className="overflow-hidden">
                <motion.div variants={linkVars}>
                  <button 
                    onClick={() => handleLink(link.path)}
                    className="text-5xl font-serif text-black hover:text-white transition-colors text-left w-full uppercase leading-none"
                  >
                    {link.title}
                  </button>
                </motion.div>
              </div>
            ))}

            {/* User Link */}
            <div className="overflow-hidden mt-8 pt-8 border-t border-black/20">
               <motion.div variants={linkVars}>
                 {user ? (
                   <button onClick={() => handleLink('/profile')} className="text-xl font-bold uppercase tracking-widest text-black">
                     Account: {user.name}
                   </button>
                 ) : (
                   <button onClick={() => handleLink('/login')} className="text-xl font-bold uppercase tracking-widest text-black">
                     Login / Register
                   </button>
                 )}
               </motion.div>
            </div>
          </motion.div>

          {/* Footer Socials */}
          <div className="flex gap-8 text-black">
            <Instagram className="w-6 h-6" />
            <Twitter className="w-6 h-6" />
            <Facebook className="w-6 h-6" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;