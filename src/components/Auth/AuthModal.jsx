import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { create } from 'zustand';

export const useAuthModalStore = create((set) => ({
  isOpen: false,
  view: 'login', // 'login' or 'signup'
  openModal: (view = 'login') => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false }),
  setView: (view) => set({ view })
}));

const AuthModal = () => {
  const { isOpen, view, closeModal, setView } = useAuthModalStore();
  const { login, signup, loginWithGoogle } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Fill required fields');
    if (view === 'signup' && !name) return toast.error('Name is required');

    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      if (view === 'login') {
        login(email, password);
        toast.success('Welcome back!');
      } else {
        signup({ name, email });
        toast.success('Account created!');
      }
      closeModal();
    } catch (err) {
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await new Promise(r => setTimeout(r, 500));
      loginWithGoogle();
      toast.success('Success!');
      closeModal();
    } catch (err) {
      toast.error('Google auth failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl w-full max-w-[440px] p-8 shadow-xl"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-[#999] hover:text-[#0A0A0A] bg-[#F8F8F8] hover:bg-[#F0F0F0] rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-6 mb-8 border-b border-[#E8E8E8]">
              <button
                onClick={() => setView('login')}
                className={`pb-3 font-heading text-[16px] tracking-[0.05em] uppercase transition-colors relative ${view === 'login' ? 'text-[#0A0A0A] font-bold' : 'text-[#999] hover:text-[#555]'}`}
              >
                Log In
                {view === 'login' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0A0A0A]" />}
              </button>
              <button
                onClick={() => setView('signup')}
                className={`pb-3 font-heading text-[16px] tracking-[0.05em] uppercase transition-colors relative ${view === 'signup' ? 'text-[#0A0A0A] font-bold' : 'text-[#999] hover:text-[#555]'}`}
              >
                Sign Up
                {view === 'signup' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0A0A0A]" />}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {view === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-lg border-[1.5px] border-[#E8E8E8] font-body text-[14px] outline-none focus:border-[#0A0A0A] transition-colors"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-[52px] px-4 rounded-lg border-[1.5px] border-[#E8E8E8] font-body text-[14px] outline-none focus:border-[#0A0A0A] transition-colors"
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-[52px] pl-4 pr-12 rounded-lg border-[1.5px] border-[#E8E8E8] font-body text-[14px] outline-none focus:border-[#0A0A0A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CCC] hover:text-[#555]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] mt-2 bg-[#0A0A0A] text-white font-heading text-[14px] uppercase tracking-[0.1em] rounded-lg hover:bg-[#33] transition-colors disabled:opacity-70"
              >
                {loading ? 'Processing...' : view === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-[#E8E8E8]" />
              <span className="font-body text-[12px] text-[#CCC]">or</span>
              <div className="flex-1 h-[1px] bg-[#E8E8E8]" />
            </div>

            <button
              onClick={handleGoogle}
              className="w-full h-[52px] bg-white border-[1.5px] border-[#E8E8E8] rounded-lg flex items-center justify-center gap-3 hover:bg-[#F8F8F8] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-body text-[14px] text-[#555] font-medium">Continue with Google</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default memo(AuthModal);
