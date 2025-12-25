import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/StoreContext';

// --- Shared Components (Global Overlays) ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import SearchOverlay from './components/SearchOverlay';
import MobileMenu from './components/MobileMenu';
import ToastContainer from './components/ToastContainer';
import NewsletterModal from './components/NewsletterModal';
import AnnouncementBar from './components/AnnouncementBar';
import PageTitle from './components/PageTitle';
import AdminRoute from './components/AdminRoute'; // <--- IMPORTED ADMIN ROUTE
import ProtectedRoute from './components/ProtectedRoute';

// --- Pages (Main Content) ---
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import CustomPrint from './pages/CustomPrint';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import Lookbook from './pages/Lookbook';
import OrderTracking from './pages/OrderTracking';
import HelpCenter from './pages/HelpCenter';

function App() {
  return (
    // Future flags enabled to silence React Router v7 warnings
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        
        {/* Dynamic Browser Tab Titles */}
        <PageTitle />

        {/* Main Layout Wrapper: Flex column ensures Footer stays at the bottom */}
        <div className="min-h-screen bg-corc-black text-white selection:bg-corc-gold selection:text-black font-sans flex flex-col">
          
          {/* --- Global Overlays (Always accessible) --- */}
          <AnnouncementBar />
          <Navbar />
          <CartSidebar />
          <SearchOverlay />
          <MobileMenu />
          <ToastContainer />
          <NewsletterModal />
          
          {/* --- Main Content Area --- */}
          <div className="flex-1"> 
            <Routes>
              {/* Storefront */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/lookbook" element={<Lookbook />} />
              <Route path="/custom" element={<CustomPrint />} />
              
              {/* Transactional */}
              <Route path="/cart" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              
              {/* User Account */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              
              {/* Support & Utility */}
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="/help" element={<HelpCenter />} />
              
              {/* PROTECTED ADMIN ROUTE */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              
              {/* 404 Page Not Found */}
              <Route path="*" element={
                <div className="h-screen flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-6xl font-serif text-corc-gold mb-4">404</h1>
                  <p className="text-gray-500 uppercase tracking-widest text-sm">
                    Page not found in the matrix.
                  </p>
                  <a href="/" className="mt-8 border-b border-white pb-1 hover:text-corc-gold hover:border-corc-gold transition-colors text-sm uppercase tracking-wider">
                    Return Home
                  </a>
                </div>
              } />
            </Routes>
          </div>

          {/* --- Global Footer --- */}
          <Footer />
          
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;