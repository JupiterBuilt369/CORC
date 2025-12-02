import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Send, Mail, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const HelpCenter = () => {
  const { addToast } = useStore();
  const [openQuestion, setOpenQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- FAQ DATA ---
  const faqs = [
    {
      q: "When will my order ship?",
      a: "Orders placed before 2PM EST ship the same day. Standard shipping takes 3-5 business days. International orders take 7-14 days."
    },
    {
      q: "What is your return policy?",
      a: "We accept returns within 14 days of delivery. Items must be unworn with original tags attached. Final Sale items cannot be returned."
    },
    {
      q: "How do I wash the heavyweight cotton?",
      a: "Machine wash cold inside out. Hang dry is recommended to preserve the fit and fabric texture. Do not iron the print."
    },
    {
      q: "Where is CORC clothing made?",
      a: "Our fabrics are sourced from Japan and Italy. Final assembly and hand-finishing takes place in our Los Angeles studio."
    }
  ];

  const handleContact = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      addToast("Message Sent! We'll reply shortly.");
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="pt-32 px-6 min-h-screen bg-corc-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif mb-4">Support <span className="text-corc-gold">&</span> FAQ</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">We are here to help. 24/7.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 pb-20">
          
          {/* LEFT: FAQ ACCORDION */}
          <div>
            <h2 className="text-2xl font-serif mb-8 flex items-center gap-3">
              <MessageSquare className="text-corc-gold w-5 h-5" /> Frequently Asked
            </h2>
            <div className="space-y-4">
              {faqs.map((item, i) => (
                <div key={i} className="border border-white/10 bg-corc-dark transition-all hover:border-white/20">
                  <button 
                    onClick={() => setOpenQuestion(openQuestion === i ? -1 : i)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <span className="font-serif text-lg">{item.q}</span>
                    {openQuestion === i ? <Minus className="w-4 h-4 text-corc-gold" /> : <Plus className="w-4 h-4 text-gray-500" />}
                  </button>
                  
                  <AnimatePresence>
                    {openQuestion === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div>
            <h2 className="text-2xl font-serif mb-8 flex items-center gap-3">
              <Mail className="text-corc-gold w-5 h-5" /> Contact Us
            </h2>
            <form onSubmit={handleContact} className="bg-corc-dark border border-white/10 p-8 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase text-gray-500 mb-2 block">Name</label>
                  <input required type="text" className="w-full bg-black border border-white/20 p-3 outline-none focus:border-corc-gold transition-colors text-sm" placeholder="Your Name" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 mb-2 block">Order # (Optional)</label>
                  <input type="text" className="w-full bg-black border border-white/20 p-3 outline-none focus:border-corc-gold transition-colors text-sm" placeholder="ORD-XXXX" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-gray-500 mb-2 block">Email</label>
                <input required type="email" className="w-full bg-black border border-white/20 p-3 outline-none focus:border-corc-gold transition-colors text-sm" placeholder="email@example.com" />
              </div>

              <div>
                <label className="text-[10px] uppercase text-gray-500 mb-2 block">Message</label>
                <textarea required rows="5" className="w-full bg-black border border-white/20 p-3 outline-none focus:border-corc-gold transition-colors text-sm resize-none" placeholder="How can we help?" />
              </div>

              <button disabled={loading} className="w-full bg-white text-black font-bold uppercase text-xs tracking-widest py-4 hover:bg-corc-gold transition-colors flex items-center justify-center gap-2">
                {loading ? 'Sending...' : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>

            </form>

            <div className="mt-8 p-6 border border-dashed border-white/10 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-widest">
                Direct Email: <span className="text-white">support@corc-clothes.com</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpCenter;