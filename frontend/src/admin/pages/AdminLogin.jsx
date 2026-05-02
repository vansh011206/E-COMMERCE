import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin, isAdminAuthenticated } = useAdminStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await adminLogin(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back, Admin');
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] p-6">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-10">
          <Lock size={24} color="#0A0A0A" className="mb-4" />
          <p className="font-heading text-[14px] text-[#999999] uppercase tracking-[0.2em] mb-2">Admin</p>
          <h1 className="font-heading text-[32px] text-[#0A0A0A] tracking-[-0.02em] text-center">
            Sign in to dashboard
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-[13px] text-[#555555] block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] px-4 rounded-[10px] bg-[#F5F5F3] border-[1.5px] border-[#E8E8E8] font-body text-[15px] text-[#0A0A0A] outline-none transition-colors placeholder-[#CCCCCC] focus:border-[#0A0A0A]"
              placeholder="admin@voguevault.com"
              required
            />
          </div>

          <div>
            <label className="font-body text-[13px] text-[#555555] block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-[52px] pl-4 pr-12 rounded-[10px] bg-[#F5F5F3] border-[1.5px] font-body text-[15px] text-[#0A0A0A] outline-none transition-colors placeholder-[#CCCCCC] focus:border-[#0A0A0A] ${error ? 'border-[#EF4444] animate-[shake_0.3s_ease-in-out]' : 'border-[#E8E8E8]'}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#555555] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-[#0A0A0A] hover:bg-[#333333] text-white rounded-[10px] font-heading text-[15px] tracking-[0.06em] transition-all active:scale-98 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          {error && (
            <p className="font-body text-[13px] text-[#EF4444] text-center mt-2">{error}</p>
          )}
        </form>

        <div className="mt-12 text-center">
          <Link to="/" className="font-body text-[13px] text-[#999999] hover:text-[#0A0A0A] transition-colors">
            ← Back to store
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
