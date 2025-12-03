import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ShoppingBag, Loader2, RefreshCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const CustomPrint = () => {
  const { addToCart } = useStore();
  
  // --- STATE ---
  const [design, setDesign] = useState(null); // The uploaded image
  const [shirtColor, setShirtColor] = useState('black'); // 'black' or 'white'
  const [size, setSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- MOCKUP ASSETS (Plain Tees) ---
  // Using high-quality blank visuals
  const mockups = {
    black: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
    white: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"
  };

  // --- HANDLERS ---
  
  // 1. Handle File Upload & Convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesign(reader.result); // Stores image string
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Add Custom Item to Cart
  const handleAddToCart = () => {
    if (!design) return alert("Please upload a design first.");
    if (!size) return alert("Please select a size.");

    setLoading(true);

    // Simulate processing
    setTimeout(() => {
      const customProduct = {
        id: Date.now(), // Unique ID
        name: "Custom Design Tee",
        category: "Custom",
        price: 65, // Premium price for custom
        image: mockups[shirtColor], // Show the base tee in cart
        customDesign: design, // Store the user's art
        size: size,
        color: shirtColor
      };

      addToCart(customProduct);
      setLoading(false);
      // Optional: Reset or navigate away
    }, 1000);
  };

  return (
    <div className="pt-32 px-6 min-h-screen grid-bg pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif mb-4">Create <span className="text-corc-gold">Your Own</span></h1>
          <p className="text-gray-500 uppercase tracking-widest text-xs">Upload your art. We handle the rest.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* --- LEFT: VISUALIZER --- */}
          <div className="relative bg-gray-900 border border-white/10 h-[600px] overflow-hidden group flex items-center justify-center">
            
            {/* Base T-Shirt Image */}
            <img 
              src={mockups[shirtColor]} 
              alt="T-Shirt Mockup" 
              className={`w-full h-full object-cover transition-opacity duration-500 ${shirtColor === 'white' ? 'opacity-90' : 'opacity-100'}`}
            />

            {/* User Design Overlay */}
            {design && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                drag // Allow user to drag their design!
                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 border-2 border-dashed border-white/30 hover:border-corc-gold cursor-move flex items-center justify-center overflow-hidden"
              >
                <img src={design} className="max-w-full max-h-full object-contain pointer-events-none" />
                
                {/* Remove Button */}
                <button 
                  onClick={() => setDesign(null)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Helper Text */}
            {!design && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-white/20 font-serif text-3xl uppercase tracking-widest">Preview Area</p>
              </div>
            )}
          </div>

          {/* --- RIGHT: TOOLS --- */}
          <div className="space-y-10">
            
            {/* 1. Upload Tool */}
            <div className="bg-corc-dark p-8 border border-white/10">
              <h3 className="text-xl font-serif mb-6">1. Upload Design</h3>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-white/20 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-corc-gold hover:bg-white/5 transition-all group"
              >
                <Upload className="w-8 h-8 text-gray-500 group-hover:text-corc-gold mb-2 transition-colors" />
                <p className="text-xs uppercase tracking-widest text-gray-400">Click to Browse (PNG, JPG)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* 2. Customization Options */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif">2. Customize</h3>
              
              {/* Color Selection */}
              <div>
                <label className="text-[10px] uppercase text-gray-500 tracking-widest mb-3 block">Base Color</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShirtColor('black')}
                    className={`w-12 h-12 rounded-full bg-black border-2 transition-all ${shirtColor === 'black' ? 'border-corc-gold scale-110' : 'border-white/20'}`} 
                  />
                  <button 
                    onClick={() => setShirtColor('white')}
                    className={`w-12 h-12 rounded-full bg-gray-200 border-2 transition-all ${shirtColor === 'white' ? 'border-corc-gold scale-110' : 'border-white/20'}`} 
                  />
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="text-[10px] uppercase text-gray-500 tracking-widest mb-3 block">Size</label>
                <div className="grid grid-cols-4 gap-4">
                  {['S', 'M', 'L', 'XL'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSize(s)}
                      className={`py-3 border transition-colors text-sm ${
                        size === s 
                          ? 'border-corc-gold text-corc-gold bg-corc-gold/10' 
                          : 'border-white/10 text-gray-500 hover:border-white hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Action */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-xs uppercase tracking-widest">Total Cost</span>
                <span className="text-3xl font-serif text-white">$65.00</span>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full py-5 bg-white text-black uppercase font-bold tracking-[0.2em] hover:bg-corc-gold transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    Add Custom Order <ShoppingBag className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest">
                Custom orders take 5-7 business days to craft.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomPrint;