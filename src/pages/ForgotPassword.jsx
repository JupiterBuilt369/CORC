import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle, ChevronLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ForgotPassword = () => {
  const { addToast } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      addToast("Reset link sent to your inbox");
    }, 2000);
  };

  return (
    <div className="pt-32 px-6 min-h-screen flex items-center justify-center grid-bg">
      <div className="w-full max-w-md bg-corc-black/90 border border-white/10 p-10 relative overflow-hidden backdrop-blur-sm">
        
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-corc-gold to-transparent opacity-50" />

        {!success ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/login" className="inline-flex items-center text-xs text-gray-500 hover:text-white mb-8 transition-colors">
              <ChevronLeft className="w-3 h-3 mr-1" /> Back to Login
            </Link>

            <h2 className="text-3xl font-serif text-center mb-2">Reset Access</h2>
            <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-10">
              Enter your email to recover your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <label className="text-[10px] uppercase tracking-[0.2em] text-corc-gold block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 py-3 pl-8 text-lg focus:border-corc-gold outline-none transition-colors placeholder:text-gray-700"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <button 
                disabled={loading} 
                type="submit" 
                className="w-full py-4 bg-corc-gold text-black uppercase font-bold tracking-widest hover:bg-white transition-colors flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">Check Your Inbox</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              We have sent a password recovery link to <span className="text-white">{email}</span>.
            </p>
            <Link to="/login" className="text-xs uppercase tracking-widest border-b border-corc-gold pb-1 text-corc-gold hover:text-white hover:border-white transition-colors">
              Return to Login
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;