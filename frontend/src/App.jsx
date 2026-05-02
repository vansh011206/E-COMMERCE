import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

// Admin imports
import AdminGuard from './admin/components/AdminGuard';
import AdminLayout from './admin/components/AdminLayout';
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./admin/pages/AdminProducts'));
const AdminAddProduct = lazy(() => import('./admin/pages/AdminAddProduct'));
const AdminEditProduct = lazy(() => import('./admin/pages/AdminEditProduct'));
const AdminOrders = lazy(() => import('./admin/pages/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./admin/pages/AdminOrderDetail'));
const AdminUsers = lazy(() => import('./admin/pages/AdminUsers'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));

const AdminLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9FAFB' }}>
    <div className="w-8 h-8 border-2 border-[#E5E7EB] border-t-[#FF3C78] rounded-full animate-spin" />
  </div>
);

import { useProductStore } from './store/productStore';

function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const fetchProducts = useProductStore(state => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Admin routes - completely separate from main site
  if (isAdminRoute) {
    return (
      <Suspense fallback={<AdminLoader />}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#0A0A0A',
              border: '1px solid #E5E7EB',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products" element={<AdminGuard><AdminLayout><AdminProducts /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products/add" element={<AdminGuard><AdminLayout><AdminAddProduct /></AdminLayout></AdminGuard>} />
          <Route path="/admin/products/edit/:id" element={<AdminGuard><AdminLayout><AdminEditProduct /></AdminLayout></AdminGuard>} />
          <Route path="/admin/orders" element={<AdminGuard><AdminLayout><AdminOrders /></AdminLayout></AdminGuard>} />
          <Route path="/admin/orders/:id" element={<AdminGuard><AdminLayout><AdminOrderDetail /></AdminLayout></AdminGuard>} />
          <Route path="/admin/users" element={<AdminGuard><AdminLayout><AdminUsers /></AdminLayout></AdminGuard>} />
          <Route path="/admin/settings" element={<AdminGuard><AdminLayout><AdminSettings /></AdminLayout></AdminGuard>} />
        </Routes>
      </Suspense>
    );
  }

  // Main site routes
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-body w-full max-w-[100vw]">
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
          <Route path="/profile/*" element={<Profile />} />
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
