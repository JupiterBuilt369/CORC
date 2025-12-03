import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-corc-black border-t border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">

        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="text-4xl font-serif font-bold text-white tracking-tighter">-CORC-</Link>
          <p className="text-gray-500 text-xs mt-4 leading-relaxed max-w-xs">
            Defining the intersection of luxury and street culture. Designed in Tokyo, worn globally.
          </p>
        </div>

        {/* Catalog Links */}
        <div>
          <h4 className="text-white font-serif mb-6">Catalog</h4>
          <ul className="space-y-4 text-xs uppercase tracking-widest text-gray-500">
            <li><Link to="/shop" className="hover:text-corc-gold transition-colors">New Arrivals</Link></li>
            <li><Link to="/shop" className="hover:text-corc-gold transition-colors">Best Sellers</Link></li>
            <li><Link to="/lookbook" className="hover:text-corc-gold transition-colors">Editorial</Link></li>
            <li><Link to="/wishlist" className="hover:text-corc-gold transition-colors">Wishlist</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-white font-serif mb-6">Support</h4>
          <ul className="space-y-4 text-xs uppercase tracking-widest text-gray-500">
            <li><Link to="/track-order" className="hover:text-corc-gold transition-colors">Track Order</Link></li>
            <li><Link to="/help" className="hover:text-corc-gold transition-colors">Help Center & FAQ</Link></li>
            <li><Link to="/admin" className="hover:text-corc-gold transition-colors">Admin Login</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        {/* Column 4: Newsletter */}
        <div>
          <h4 className="text-white font-serif mb-6">Stay in the loop</h4>
          <div className="flex border-b border-white/20 pb-2">
            <input
              type="email"
              placeholder="ENTER EMAIL"
              className="bg-transparent w-full outline-none text-xs uppercase tracking-widest focus:placeholder-white transition-colors"
            />
            <button className="text-corc-gold hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-600 text-[10px] uppercase tracking-widest">© 2025 CORC Clothes. All Rights Reserved.</p>
        <div className="flex gap-6 text-gray-500">
          <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <Facebook className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;