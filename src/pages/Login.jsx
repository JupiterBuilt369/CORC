import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    api.login("user@example.com").then(u => { 
      setUser(u); 
      setLoading(false); 
      navigate('/shop'); 
    }); 
  };

  return (
    <div className="pt-32 px-6 min-h-screen flex items-center justify-center grid-bg">
      <div className="w-full max-w-md bg-corc-black/90 border border-white/10 p-10">
        <h2 className="text-3xl font-serif text-center mb-8">Member Access</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-corc-gold" />
          <input type="password" value="password" readOnly className="w-full bg-transparent border-b border-white/20 py-3 outline-none text-gray-500" />
          <button disabled={loading} className="w-full py-4 bg-corc-gold text-black font-bold uppercase hover:bg-white">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;