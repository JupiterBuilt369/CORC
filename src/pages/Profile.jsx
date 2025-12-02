import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, User, LogOut, MapPin, CreditCard, ShoppingBag, 
  Settings, Camera, Plus, Trash2, Edit2, Shield 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Profile = () => {
  const { 
    user, setUser, updateUser, 
    orders, 
    addresses, addAddress, removeAddress,
    cards, addCard, removeCard 
  } = useStore();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // -- Edit Profile State --
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  // -- Address Form State --
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', street: '', city: '', zip: '' });

  // -- Card Form State --
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ type: 'Visa', last4: '', expiry: '' });

  useEffect(() => {
    if (!user) navigate('/login');
    setEditForm(user || {});
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser(editForm);
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({ type: 'Home', street: '', city: '', zip: '' });
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    addCard(newCard);
    setShowCardForm(false);
    setNewCard({ type: 'Visa', last4: '', expiry: '' });
  };

  if (!user) return null;

  // Helper Component for Sidebar Tabs
  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-4 text-xs uppercase tracking-widest transition-all border-l-2 ${
        activeTab === id 
          ? 'bg-white/5 border-corc-gold text-white' 
          : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className={`w-4 h-4 ${activeTab === id ? 'text-corc-gold' : ''}`} />
      {label}
    </button>
  );

  return (
    <div className="pt-32 px-6 min-h-screen grid-bg pb-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="md:col-span-1 space-y-6">
          {/* User Card */}
          <div className="bg-corc-dark border border-white/10 p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-corc-gold to-transparent opacity-50" />
            
            <div className="relative inline-block group/avatar">
              <img 
                src={user.avatar || "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-2 border-corc-dark shadow-xl mb-4 mx-auto"
              />
              <div className="absolute bottom-4 right-0 bg-corc-gold text-black p-1.5 rounded-full cursor-pointer hover:scale-110 transition-transform" onClick={() => setActiveTab('profile')}>
                <Edit2 className="w-3 h-3" />
              </div>
            </div>
            
            <h2 className="font-serif text-xl text-white">{user.name}</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Member since 2024</p>
          </div>

          {/* Navigation */}
          <div className="bg-corc-dark border border-white/10 py-2">
            <TabButton id="profile" icon={User} label="Personal Info" />
            <TabButton id="orders" icon={Package} label="Order History" />
            <TabButton id="addresses" icon={MapPin} label="Address Book" />
            <TabButton id="wallet" icon={CreditCard} label="Payment Methods" />
            
            <div className="my-2 border-t border-white/5" />
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-4 text-xs uppercase tracking-widest text-red-500 hover:bg-red-500/10 border-l-2 border-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="md:col-span-3">
          
          {/* TAB: PROFILE INFO */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-end">
                <h1 className="text-3xl font-serif">Personal <span className="text-corc-gold">Details</span></h1>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)} 
                  className="text-xs uppercase tracking-widest border-b border-white/20 pb-1 hover:text-corc-gold hover:border-corc-gold transition-colors"
                >
                  {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-corc-dark border border-white/10 p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 tracking-widest">Full Name</label>
                    <input 
                      disabled={!isEditingProfile}
                      value={editForm.name || ''}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-4 text-sm focus:border-corc-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 tracking-widest">Email Address</label>
                    <input 
                      disabled={!isEditingProfile}
                      value={editForm.email || ''}
                      onChange={e => setEditForm({...editForm, email: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-4 text-sm focus:border-corc-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 tracking-widest">Phone Number</label>
                    <input 
                      disabled={!isEditingProfile}
                      value={editForm.phone || ''}
                      onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-4 text-sm focus:border-corc-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 tracking-widest">Avatar URL</label>
                    <input 
                      disabled={!isEditingProfile}
                      value={editForm.avatar || ''}
                      onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 p-4 text-sm focus:border-corc-gold outline-none disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button className="bg-corc-gold text-black px-8 py-3 text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          )}

          {/* TAB: ADDRESSES */}
          {activeTab === 'addresses' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif">Address <span className="text-corc-gold">Book</span></h1>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-corc-gold transition-colors">
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              <AnimatePresence>
                {showAddressForm && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleAddAddress} 
                    className="bg-corc-dark border border-white/10 p-6 space-y-4 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Label (e.g. Home)" value={newAddress.type} onChange={e => setNewAddress({...newAddress, type: e.target.value})} className="bg-black p-3 text-sm border border-white/10 focus:border-corc-gold outline-none text-white" required />
                      <input placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="bg-black p-3 text-sm border border-white/10 focus:border-corc-gold outline-none text-white" required />
                    </div>
                    <input placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full bg-black p-3 text-sm border border-white/10 focus:border-corc-gold outline-none text-white" required />
                    <input placeholder="ZIP Code" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="w-full bg-black p-3 text-sm border border-white/10 focus:border-corc-gold outline-none text-white" required />
                    <button className="bg-white text-black px-6 py-2 text-xs uppercase font-bold tracking-widest hover:bg-corc-gold">Save Address</button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-corc-dark border border-white/10 p-6 relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-corc-gold" />
                        <span className="text-sm font-serif text-white">{addr.type}</span>
                      </div>
                      {addr.isDefault && <span className="text-[10px] bg-white/10 px-2 py-1 uppercase tracking-widest text-gray-400">Default</span>}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {addr.street}<br/>{addr.city}, {addr.zip}<br/>{addr.country}
                    </p>
                    <button onClick={() => removeAddress(addr.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: WALLET */}
          {activeTab === 'wallet' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif">Payment <span className="text-corc-gold">Methods</span></h1>
                <button onClick={() => setShowCardForm(!showCardForm)} className="flex items-center gap-2 text-xs uppercase tracking-widest hover:text-corc-gold transition-colors">
                  <Plus className="w-4 h-4" /> Add Card
                </button>
              </div>

              <AnimatePresence>
                {showCardForm && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleAddCard} 
                    className="bg-corc-dark border border-white/10 p-6 space-y-4 overflow-hidden"
                  >
                    <input placeholder="Last 4 Digits" maxLength="4" value={newCard.last4} onChange={e => setNewCard({...newCard, last4: e.target.value})} className="w-full bg-black p-3 text-sm border border-white/10 focus:border-corc-gold outline-none text-white" required />
                    <input placeholder="Expiry (MM/YY)" value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} className="w-full bg-black p-3 text-sm border border-white/10 focus:border-corc-gold outline-none text-white" required />
                    <button className="bg-white text-black px-6 py-2 text-xs uppercase font-bold tracking-widest hover:bg-corc-gold">Save Card</button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="grid md:grid-cols-2 gap-4">
                {cards.map(card => (
                  <div key={card.id} className="bg-gradient-to-br from-gray-900 to-black border border-white/10 p-6 rounded-xl relative group">
                    <div className="flex justify-between items-start mb-8">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <span className="font-serif italic text-gray-500">{card.type}</span>
                    </div>
                    <div className="text-xl font-mono text-white tracking-widest mb-4">
                      •••• •••• •••• {card.last4}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Expires</p>
                        <p className="text-sm text-gray-300">{card.expiry}</p>
                      </div>
                      <Shield className="w-4 h-4 text-corc-gold opacity-50" />
                    </div>
                    <button onClick={() => removeCard(card.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <h1 className="text-3xl font-serif">Order <span className="text-corc-gold">History</span></h1>
              
              {orders.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10">
                  <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet.</p>
                </div>
              ) : (
                orders.map((order, i) => (
                  <motion.div 
                    key={order.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.1 }} 
                    className="bg-corc-dark border border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="flex -space-x-4">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <img key={idx} src={item.image} className="w-16 h-16 rounded-full border-2 border-corc-dark object-cover" />
                        ))}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-white">{order.id}</h3>
                        <p className="text-xs text-gray-500 mt-1">{order.items.length} Items — {order.date}</p>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col md:items-end gap-2">
                      <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold border ${order.status === 'Delivered' ? 'border-green-500 text-green-500' : 'border-corc-gold text-corc-gold'}`}>
                        {order.status}
                      </span>
                      <span className="text-xl font-light">${order.total}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;