import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Register = () => {
  const { registerUser } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    setLoading(true); 
    
    // Call the new register function
    registerUser(formData).then(() => {
      setLoading(false);
      navigate('/shop'); 
    }); 
  };

  return (
    <div className="pt-32 px-6 min-h-screen flex items-center justify-center grid-bg">
      <div className="w-full max-w-md bg-corc-black/90 border border-white/10 p-10 relative overflow-hidden backdrop-blur-sm">
        
        {/* Gold Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-corc-gold to-transparent" />

        <h2 className="text-3xl font-serif text-center mb-2">Join CORC</h2>
        <p className="text-gray-500 text-xs text-center uppercase tracking-widest mb-8">Create your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Full Name</label>
            <input 
              required 
              type="text" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-corc-gold transition-colors text-white placeholder:text-gray-700" 
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Email</label>
            <input 
              required 
              type="email" 
              placeholder="user@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-corc-gold transition-colors text-white placeholder:text-gray-700" 
            />
          </div>
          
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">Password</label>
            <input 
              required 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-corc-gold transition-colors text-white" 
            />
          </div>

          <button disabled={loading} className="w-full py-4 bg-corc-gold text-black font-bold uppercase hover:bg-white transition-colors mt-4">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-gray-600">
          Already a member? <Link to="/login" className="text-gray-400 hover:text-white border-b border-gray-600 hover:border-white pb-0.5 transition-all">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;