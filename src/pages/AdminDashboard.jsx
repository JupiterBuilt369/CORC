import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Package } from 'lucide-react';

const AdminDashboard = () => {
  const { products, addProduct, deleteProduct, user, loading } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    imageUrls: '',
    stock: ''
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-xl text-red-600 font-serif">Access Denied: Admin privileges required.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrls: formData.imageUrls.split(',').map(url => url.trim()).filter(url => url),
        createdAt: new Date().toISOString()
      };
      await addProduct(newProduct);
      setFormData({ name: '', category: '', price: '', description: '', imageUrls: '', stock: '' });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-32 px-4 md:px-10 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-8 border-b pb-4">Admin Dashboard</h1>
        
        {/* Add Product Form */}
        <div className="bg-gray-50 p-8 rounded-xl mb-12 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6" /> Add New Product
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Product Name</label>
              <input 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition" 
                placeholder="e.g. Noir Heavyweight Tee" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Category</label>
              <input 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition" 
                placeholder="e.g. T-Shirts" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Price ($)</label>
              <input 
                type="number"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition" 
                placeholder="0.00" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider">Stock Quantity</label>
              <input 
                type="number"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition" 
                placeholder="0" 
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold uppercase tracking-wider">Image URLs (comma separated)</label>
              <input 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition" 
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
                value={formData.imageUrls}
                onChange={e => setFormData({...formData, imageUrls: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold uppercase tracking-wider">Description</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black transition h-32" 
                placeholder="Product details..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="bg-black text-white py-4 px-8 rounded hover:bg-gray-800 transition md:col-span-2 uppercase tracking-widest font-bold">
              Add Product to Catalog
            </button>
          </form>
        </div>

        {/* Product List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" /> Current Catalog ({products.length})
          </h2>
          <div className="grid gap-4">
            {products.map(product => (
              <div key={product.id} className="flex flex-col md:flex-row justify-between items-center p-4 border border-gray-200 rounded hover:shadow-md transition bg-white">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {product.imageUrls?.[0] && (
                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category} | ${product.price}</p>
                    <p className="text-xs text-gray-400 mt-1">ID: {product.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right mr-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this product?')) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="text-red-500 hover:bg-red-50 p-3 rounded-full transition"
                    title="Delete Product"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;