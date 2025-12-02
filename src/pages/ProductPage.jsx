import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Heart, Star, Ruler, AlertCircle, Camera, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useStore } from '../context/StoreContext';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInWishlist, reviews, addReview, user } = useStore();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Calculate Average Rating safely
  const productReviews = reviews ? reviews.filter(r => r.productId === parseInt(id)) : [];
  const averageRating = productReviews.length 
    ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1) 
    : 0;

  useEffect(() => {
    setLoading(true);
    
    // 1. Fetch current product
    api.getProductById(id).then(data => {
      // SAFETY CHECK: If product doesn't exist, stop here to prevent crash
      if (!data) {
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(data);
      
      // 2. Fetch all products to find related ones
      api.getProducts().then(allProducts => {
        if (!allProducts) return;
        const related = allProducts
          .filter(p => p.category === data.category && p.id !== data.id)
          .slice(0, 3);
        setRelatedProducts(related);
        setLoading(false);
      });
    });
    
    // Scroll to top when ID changes
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-corc-gold w-10 h-10" /></div>;
  
  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-serif text-white mb-4">Product Not Found</h2>
      <Link to="/shop" className="text-corc-gold border-b border-corc-gold pb-1 hover:text-white transition-colors">Return to Shop</Link>
    </div>
  );

  const stockLevel = (product.id % 5) + 2; // Fake stock logic

  const handleAdd = () => {
    if (!selectedSize) return alert("Please select a size.");
    addToCart({ ...product, size: selectedSize });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      productId: product.id,
      userName: user ? user.name : "Guest",
      userAvatar: user ? user.avatar : null,
      rating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      text: reviewText,
      image: reviewImage || null
    };
    addReview(newReview);
    setShowReviewForm(false);
    setReviewText("");
    setReviewImage("");
  };

  return (
    <div className="pt-32 px-6 min-h-screen grid-bg pb-20">
      
      {/* --- SIZE GUIDE MODAL --- */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSizeGuide(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-corc-dark border border-white/10 p-8 max-w-lg w-full z-10">
              <h3 className="font-serif text-2xl mb-4">Size Guide (Inches)</h3>
              <table className="w-full text-sm text-gray-400">
                <thead className="border-b border-white/10 text-corc-gold uppercase">
                  <tr><th className="py-2 text-left">Size</th><th>Chest</th><th>Length</th><th>Sleeve</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr><td className="py-2 font-bold text-white">S</td><td>40</td><td>26</td><td>8.5</td></tr>
                  <tr><td className="py-2 font-bold text-white">M</td><td>42</td><td>27</td><td>9.0</td></tr>
                  <tr><td className="py-2 font-bold text-white">L</td><td>44</td><td>28</td><td>9.5</td></tr>
                  <tr><td className="py-2 font-bold text-white">XL</td><td>48</td><td>29</td><td>10.0</td></tr>
                </tbody>
              </table>
              <button onClick={() => setShowSizeGuide(false)} className="mt-6 w-full py-3 bg-white text-black uppercase font-bold text-xs tracking-widest">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        {/* Left: Image */}
        <div className="h-[500px] md:h-[700px] bg-gray-900 border border-white/5 relative overflow-hidden group">
          <button onClick={() => toggleWishlist(product)} className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-white hover:text-red-500 transition-all">
            <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
          <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-corc-gold text-xs uppercase tracking-[0.2em]">{product.category}</span>
              <div className="flex items-center gap-1 text-corc-gold text-xs">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white">{averageRating || "New"}</span>
                <span className="text-gray-500">({productReviews.length} Reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif mt-2 mb-4">{product.name}</h1>
            <p className="text-2xl text-white font-light">${product.price}</p>
          </div>

          <p className="text-gray-400 leading-relaxed max-w-md">
            Crafted from premium materials. This piece embodies the CORC philosophy of eternal street elegance. 
            Heavyweight construction with hand-finished details.
          </p>

          {/* Size Selector */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-500">
              <span>Select Size</span>
              <button onClick={() => setShowSizeGuide(true)} className="flex items-center gap-2 underline hover:text-white">
                <Ruler className="w-3 h-3" /> Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`py-4 border transition-colors ${selectedSize === size ? 'border-corc-gold text-corc-gold bg-corc-gold/10' : 'border-white/10 text-gray-500 hover:border-white hover:text-white'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Scarcity Indicator */}
          {stockLevel < 5 && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
              <AlertCircle className="w-4 h-4" />
              Only {stockLevel} items left in stock
            </div>
          )}

          <div className="pt-8 border-t border-white/10">
            <button onClick={handleAdd} className={`w-full py-5 uppercase font-bold tracking-[0.2em] transition-all ${selectedSize ? 'bg-corc-gold text-black hover:bg-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
              {selectedSize ? `Add to Cart — $${product.price}` : 'Select a Size'}
            </button>
          </div>
        </div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-20 mb-20">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-serif">Customer <span className="text-corc-gold">Reviews</span></h2>
          <button onClick={() => setShowReviewForm(!showReviewForm)} className="border-b border-white pb-1 text-xs uppercase tracking-widest hover:text-corc-gold hover:border-corc-gold transition-colors">
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        <AnimatePresence>
          {showReviewForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmitReview}
              className="bg-corc-dark border border-white/10 p-8 mb-12 overflow-hidden"
            >
              <h3 className="text-lg font-serif mb-4">Share your thoughts</h3>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRating(star)}>
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-corc-gold text-corc-gold' : 'text-gray-600'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                required 
                value={reviewText} 
                onChange={e => setReviewText(e.target.value)} 
                placeholder="How does it fit? What do you think of the material?"
                className="w-full bg-black border border-white/20 p-4 text-sm mb-4 outline-none focus:border-corc-gold"
                rows="4"
              />
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Camera className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input 
                    value={reviewImage} 
                    onChange={e => setReviewImage(e.target.value)} 
                    placeholder="Paste Image URL (Optional)"
                    className="w-full bg-black border border-white/20 p-3 pl-10 text-sm outline-none focus:border-corc-gold"
                  />
                </div>
              </div>
              <button className="bg-white text-black px-8 py-3 uppercase font-bold text-xs tracking-widest hover:bg-corc-gold transition-colors">
                Submit Review
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {productReviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first.</p>
          ) : (
            productReviews.map(review => (
              <div key={review.id} className="border border-white/10 p-6 bg-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-corc-gold text-black flex items-center justify-center font-bold">
                        {review.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif text-white">{review.userName}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex text-corc-gold">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{review.text}</p>
                {review.image && (
                  <img src={review.image} className="w-24 h-24 object-cover border border-white/10 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.open(review.image, '_blank')} />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- RELATED PRODUCTS --- */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto pt-10">
          <h2 className="text-3xl font-serif mb-12">Complete <span className="text-corc-gold">The Look</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map(p => (
              <Link to={`/product/${p.id}`} key={p.id}>
                <div className="group cursor-pointer">
                  <div className="h-[400px] bg-gray-900 border border-white/5 overflow-hidden">
                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-serif text-lg">{p.name}</h3>
                    <p className="text-gray-500 text-xs uppercase">${p.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;