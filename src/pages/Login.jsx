import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '../api';
import { useStore } from '../context/StoreContext';

const Login = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (e) => { 
    e.preventDefault(); 
    setLoading(true); 
    
    // Simulate API Login
    api.login("user@example.com").then(u => { 
      setUser(u); 
      setLoading(false); 
      navigate('/shop'); 
    }); 
  };

  return (
    <div className="pt-32 px-6 min-h-screen flex items-center justify-center grid-bg">
      <div className="w-full max-w-md bg-corc-black/90 border border-white/10 p-10 relative overflow-hidden backdrop-blur-sm">
        
        {/* Gold Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-corc-gold to-transparent" />

        <h2 className="text-3xl font-serif text-center mb-8">Member Access</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Email</label>
            <input required type="email" placeholder="user@example.com" className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-corc-gold transition-colors text-white placeholder:text-gray-700" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500">Password</label>
              {/* --- NEW LINK HERE --- */}
              <Link to="/forgot-password" class="text-[10px] uppercase tracking-widest text-corc-gold hover:text-white transition-colors">
                Forgot Password?
              </Link>
            </div>
            <input required type="password" value="password" readOnly className="w-full bg-transparent border-b border-white/20 py-3 outline-none text-gray-500 cursor-not-allowed" />
          </div>

          <button disabled={loading} className="w-full py-4 bg-corc-gold text-black font-bold uppercase hover:bg-white transition-colors mt-4">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Enter"}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-gray-600">
  New here? <Link to="/register" className="text-gray-400 hover:text-white border-b border-gray-600 hover:border-white pb-0.5 transition-all">Create an Account</Link>
</p>
      </div>
    </div>
  );
};

export default Login;