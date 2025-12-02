import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Search, User, Menu } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Navbar = () => {
  const { cart, setIsCartOpen, user, setIsSearchOpen, setIsMenuOpen } = useStore();


  return (
    <nav className="fixed w-full z-50 bg-corc-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Left Links */}
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] text-gray-400">
          <Link to="/shop" className="hover:text-corc-gold transition-colors">Shop</Link>
          <Link to="#" className="hover:text-corc-gold transition-colors">Limited</Link>
        </div>

        {/* Logo */}
        <Link to="/" className="text-4xl font-serif font-bold text-white tracking-tighter">
          -CORC-
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-6 text-gray-300">
          <Search
            onClick={() => setIsSearchOpen(true)} // <--- Add this onClick
            className="w-5 h-5 cursor-pointer hover:text-corc-gold transition-colors"
          />
          <Link to="/wishlist">
            <Heart className="w-5 h-5 hover:text-corc-gold transition-colors" />
          </Link>


          <div className="relative cursor-pointer hover:text-corc-gold transition-colors" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-corc-gold text-black text-[10px] font-bold w-3 h-3 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </div>

          {user ? (
            <Link to="/profile">
              <span className="text-xs border border-corc-gold px-2 py-1 text-corc-gold uppercase tracking-widest hover:bg-corc-gold hover:text-black transition-colors cursor-pointer">
                {user.name}
              </span>
            </Link>
          ) : (
            <Link to="/login">
              <User className="w-5 h-5 hover:text-corc-gold transition-colors" />
            </Link>
          )}

          <Menu
            onClick={() => setIsMenuOpen(true)} // <--- Add onClick
            className="w-6 h-6 md:hidden cursor-pointer hover:text-corc-gold transition-colors"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;