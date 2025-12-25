import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Login = () => {
  const { loginUser } = useStore(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const handleLogin = (e) => { 
    e.preventDefault(); 
    setLoading(true); 
    
    // Call Context Login function
    loginUser(formData.email, formData.password)
      .then((loggedInUser) => { 
        setLoading(false);
        
        // Redirect based on Role (Admin vs Customer)
        if (loggedInUser && loggedInUser.isAdmin) {
          navigate('/admin'); // Founder goes to Dashboard
        } else {
          navigate('/shop');  // Customer goes to Shop
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="pt-32 px-6 min-h-screen flex items-center justify-center grid-bg">
      <div className="w-full max-w-md bg-corc-black/90 border border-white/10 p-10 relative overflow-hidden backdrop-blur-sm">
        
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-corc-gold to-transparent" />

        <h2 className="text-3xl font-serif text-center mb-8">Member Access</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Email</label>
            <input 
              required 
              type="email" 
              placeholder="user@example.com" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-corc-gold transition-colors text-white placeholder:text-gray-700" 
            />
          </div>
          
          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500">Password</label>
              <Link to="/forgot-password" className="text-[10px] uppercase tracking-widest text-corc-gold hover:text-white transition-colors">
                Forgot Password?
              </Link>
            </div>
            <input 
              required 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-corc-gold transition-colors text-white" 
            />
          </div>

          <button disabled={loading} className="w-full py-4 bg-corc-gold text-black font-bold uppercase hover:bg-white transition-colors mt-4">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Enter"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-gray-600">
            New here? <Link to="/register" className="text-gray-400 hover:text-white border-b border-gray-600 hover:border-white pb-0.5 transition-all">Create an Account</Link>
          </p>
          <p className="text-[10px] text-gray-700">
            (Demo Admin: <span className="font-mono text-gray-500">admin@corc.com</span> / <span className="font-mono text-gray-500">admin123</span>)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;