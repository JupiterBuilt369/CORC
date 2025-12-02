import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, MapPin } from 'lucide-react';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null); // null, 'searching', 'found'
  
  const steps = [
    { icon: Package, label: "Order Placed", date: "Feb 24, 10:00 AM", done: true },
    { icon: MapPin, label: "Processing", date: "Feb 25, 2:30 PM", done: true },
    { icon: Truck, label: "Shipped", date: "Feb 26, 9:00 AM", done: true },
    { icon: CheckCircle, label: "Delivered", date: "Expected Feb 28", done: false },
  ];

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId) return;
    
    // Simulate API Search
    setStatus('searching');
    setTimeout(() => {
      setStatus('found');
    }, 1500);
  };

  return (
    <div className="pt-40 px-6 min-h-screen bg-corc-black flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-4">Track <span className="text-corc-gold">Order</span></h1>
        <p className="text-gray-500 text-center text-xs uppercase tracking-widest mb-12">Enter your Order ID from your confirmation email</p>

        {/* Search Input */}
        <form onSubmit={handleTrack} className="relative mb-16">
          <input 
            type="text" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Ex: ORD-8821" 
            className="w-full bg-corc-dark border border-white/10 py-5 pl-6 pr-16 outline-none focus:border-corc-gold transition-colors text-xl font-serif uppercase"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 font-bold uppercase hover:bg-corc-gold transition-colors">
            Track
          </button>
        </form>

        {/* Result Area */}
        {status === 'searching' && (
          <div className="text-center text-gray-500 animate-pulse">Locating shipment details...</div>
        )}

        {status === 'found' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-corc-dark border border-white/5 p-8 md:p-12 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Package className="w-32 h-32" />
            </div>

            <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6 relative z-10">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                <h2 className="text-3xl font-serif text-white">{orderId}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</p>
                <p className="text-corc-gold font-bold uppercase">In Transit</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative z-10">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  {/* Vertical Line */}
                  {i !== steps.length - 1 && (
                    <div className={`absolute left-[19px] top-10 w-0.5 h-full ${step.done ? 'bg-corc-gold' : 'bg-white/10'}`} />
                  )}

                  {/* Icon Bubble */}
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 bg-corc-dark ${
                    step.done ? 'border-corc-gold text-corc-gold' : 'border-white/20 text-gray-600'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>

                  {/* Text */}
                  <div className="pt-2">
                    <h4 className={`text-lg font-serif ${step.done ? 'text-white' : 'text-gray-500'}`}>{step.label}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;