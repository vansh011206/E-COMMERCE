import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import MobileNav from './components/Layout/MobileNav';
import SearchOverlay from './components/Search/SearchOverlay';
import ScrollToTop from './components/Layout/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#000',
            border: '1px solid #E5E5E5',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
          },
        }}
      />

      {/* Global Search Overlay */}
      <SearchOverlay />

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 pb-14 md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}

export default App;
