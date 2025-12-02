import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, DollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const AdminDashboard = () => {
  const { products, addProduct, deleteProduct, user } = useStore();
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', category: 'T-Shirts', price: '', image: ''
  });

  if (!user || !user.isAdmin) {
    return <div className="pt-40 text-center">Access Denied</div>;
  }

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    addProduct({
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      image: formData.image || "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"
    });
    setFormData({ name: '', category: 'T-Shirts', price: '', image: '' });
  };

  return (
    <div className="pt-32 px-6 min-h-screen bg-corc-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
           <h1 className="text-5xl font-serif">Command <span className="text-corc-gold">Center</span></h1>
           <p className="text-gray-500 uppercase tracking-widest text-xs">Welcome back, Founder</p>
        </div>

        {/* --- STATS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Total Revenue', val: '$12,450', icon: DollarSign },
             { label: 'Active Orders', val: '24', icon: ShoppingBag },
             { label: 'Total Products', val: products.length, icon: Package },
             { label: 'Growth', val: '+18%', icon: TrendingUp },
           ].map((stat, i) => (
             <div key={i} className="bg-corc-dark border border-white/10 p-6">
                <div className="flex justify-between items-start mb-4">
                  <stat.icon className="text-corc-gold w-6 h-6" />
                  <span className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-3xl font-serif">{stat.val}</div>
             </div>
           ))}
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: ADD PRODUCT FORM */}
          <div className="lg:col-span-1">
            <div className="bg-corc-dark p-8 border border-white/10 sticky top-32">
              <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-corc-gold" /> Add New Drop
              </h3>
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-2">Product Name</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/20 p-3 outline-none focus:border-corc-gold" placeholder="Ex: Stealth Bomber" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] uppercase text-gray-500 block mb-2">Price ($)</label>
                      <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-white/20 p-3 outline-none focus:border-corc-gold" placeholder="0.00" />
                   </div>
                   <div>
                      <label className="text-[10px] uppercase text-gray-500 block mb-2">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/20 p-3 outline-none focus:border-corc-gold text-gray-400">
                        <option>T-Shirts</option>
                        <option>Outerwear</option>
                        <option>Hoodies</option>
                        <option>Accessories</option>
                      </select>
                   </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-gray-500 block mb-2">Image URL</label>
                  <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-black border border-white/20 p-3 outline-none focus:border-corc-gold" placeholder="https://..." />
                </div>
                <button type="submit" className="w-full bg-white text-black font-bold uppercase py-4 hover:bg-corc-gold transition-colors">
                   Publish Item
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: INVENTORY LIST */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-serif mb-6 pb-4 border-b border-white/10">Live Inventory</h3>
            <div className="space-y-4">
              {products.map(p => (
                <motion.div layout key={p.id} className="flex items-center gap-4 bg-corc-dark p-4 border border-white/5 hover:border-white/20 transition-colors group">
                   <img src={p.image} className="w-16 h-16 object-cover bg-gray-800" />
                   <div className="flex-1">
                      <h4 className="font-serif text-lg text-white">{p.name}</h4>
                      <div className="flex gap-4 text-xs text-gray-500 uppercase mt-1">
                        <span>{p.category}</span>
                        <span className="text-corc-gold">${p.price}</span>
                        <span>ID: {p.id}</span>
                      </div>
                   </div>
                   <button 
                     onClick={() => deleteProduct(p.id)}
                     className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;