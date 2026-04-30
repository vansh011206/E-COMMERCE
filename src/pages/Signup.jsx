import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const pw = formData.password;
    let s = 0;
    if (pw.length > 0) s++;
    if (pw.length >= 6) s++;
    if (pw.match(/[A-Z]/) || pw.match(/[0-9]/)) s++;
    if (pw.length >= 8 && pw.match(/[^A-Za-z0-9]/)) s++;
    setStrength(s);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreed) {
      newErrors.agreed = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      signup({ name: formData.fullName, email: formData.email, phone: formData.phone });
      toast.success('Account created!');
      navigate('/');
    } catch (error) {
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      loginWithGoogle();
      toast.success('Account created!');
      navigate('/');
    } catch (error) {
      toast.error('Google signup failed');
    }
  };

  const strengthColors = ['bg-[#E8E8E8]', 'bg-[#E53935]', 'bg-[#FF9800]', 'bg-[#8BC34A]', 'bg-[#4CAF50]'];
  const currentStrengthColor = strength === 0 ? strengthColors[0] : strengthColors[strength];

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-[1000px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col lg:flex-row min-h-[650px] border border-[#E8E8E8]">
        
        {/* Left side - Image */}
        <div className="hidden lg:block lg:w-[45%] relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"
            alt="Fashion Model"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <h1 className="absolute bottom-10 left-10 text-white font-heading text-[40px] leading-[1.1] font-bold tracking-tight">
            JOIN THE<br />STYLE CLUB
          </h1>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-[55%] flex flex-col px-6 py-8 md:px-12 lg:px-16 overflow-y-auto hide-scrollbar">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <Link to="/" className="font-heading text-[18px] font-bold tracking-[0.1em] text-[#0A0A0A]">
              VOGUE VAULT
            </Link>
            <Link to="/" className="font-body text-[13px] text-[#555] hover:text-[#0A0A0A] hover:underline">
              Back to site
            </Link>
          </div>

          <div className="w-full max-w-[380px] mx-auto my-auto shrink-0 pb-6">
            <h2 className="font-heading text-[28px] text-[#0A0A0A] font-bold tracking-[-0.02em] mb-2">Create your account</h2>
            <p className="font-body text-[14px] text-[#999] mb-6">Join millions of fashion lovers</p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className={`w-full h-[52px] px-4 rounded-lg border-[1.5px] font-body text-[14px] text-[#0A0A0A] outline-none transition-all placeholder-[#CCCCCC] ${
                    errors.fullName ? 'border-[#E53935] focus:ring-[#E53935]/10' : 'border-[#E8E8E8] focus:border-[#0A0A0A] focus:ring-4 focus:ring-[#0A0A0A]/5'
                  }`}
                />
                {errors.fullName && <p className="font-body text-[12px] text-[#E53935] mt-1.5">{errors.fullName}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address *"
                  className={`w-full h-[52px] px-4 rounded-lg border-[1.5px] font-body text-[14px] text-[#0A0A0A] outline-none transition-all placeholder-[#CCCCCC] ${
                    errors.email ? 'border-[#E53935] focus:ring-[#E53935]/10' : 'border-[#E8E8E8] focus:border-[#0A0A0A] focus:ring-4 focus:ring-[#0A0A0A]/5'
                  }`}
                />
                {errors.email && <p className="font-body text-[12px] text-[#E53935] mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number (Optional)"
                  maxLength={10}
                  className={`w-full h-[52px] px-4 rounded-lg border-[1.5px] font-body text-[14px] text-[#0A0A0A] outline-none transition-all placeholder-[#CCCCCC] ${
                    errors.phone ? 'border-[#E53935] focus:ring-[#E53935]/10' : 'border-[#E8E8E8] focus:border-[#0A0A0A] focus:ring-4 focus:ring-[#0A0A0A]/5'
                  }`}
                />
                {errors.phone && <p className="font-body text-[12px] text-[#E53935] mt-1.5">{errors.phone}</p>}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password *"
                    className={`w-full h-[52px] pl-4 pr-12 rounded-lg border-[1.5px] font-body text-[14px] text-[#0A0A0A] outline-none transition-all placeholder-[#CCCCCC] ${
                      errors.password ? 'border-[#E53935] focus:ring-[#E53935]/10' : 'border-[#E8E8E8] focus:border-[#0A0A0A] focus:ring-4 focus:ring-[#0A0A0A]/5'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CCCCCC] hover:text-[#555] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Strength indicator */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${strength >= level ? currentStrengthColor : 'bg-[#E8E8E8]'}`} />
                  ))}
                </div>
                {errors.password && <p className="font-body text-[12px] text-[#E53935] mt-1.5">{errors.password}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password *"
                  className={`w-full h-[52px] px-4 rounded-lg border-[1.5px] font-body text-[14px] text-[#0A0A0A] outline-none transition-all placeholder-[#CCCCCC] ${
                    errors.confirmPassword ? 'border-[#E53935] focus:ring-[#E53935]/10' : 'border-[#E8E8E8] focus:border-[#0A0A0A] focus:ring-4 focus:ring-[#0A0A0A]/5'
                  }`}
                />
                {errors.confirmPassword && <p className="font-body text-[12px] text-[#E53935] mt-1.5">{errors.confirmPassword}</p>}
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-4 h-4 mt-0.5 shrink-0">
                    <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} className="peer appearance-none w-4 h-4 border border-[#CCCCCC] rounded-[3px] checked:bg-[#0A0A0A] checked:border-[#0A0A0A] transition-colors cursor-pointer" />
                    <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="font-body text-[13px] text-[#555] leading-snug">
                    I agree to the <Link to="/terms" className="text-[#0A0A0A] underline hover:text-[#555]">Terms of Service</Link> and <Link to="/privacy" className="text-[#0A0A0A] underline hover:text-[#555]">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreed && <p className="font-body text-[12px] text-[#E53935] mt-1.5 ml-7">{errors.agreed}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] mt-4 bg-[#0A0A0A] text-white font-heading text-[14px] uppercase tracking-[0.1em] rounded-lg hover:bg-[#333333] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-[#E8E8E8]" />
              <span className="font-body text-[12px] text-[#CCCCCC]">or</span>
              <div className="flex-1 h-[1px] bg-[#E8E8E8]" />
            </div>

            <button
              onClick={handleGoogleSignup}
              className="w-full h-[52px] bg-white border-[1.5px] border-[#E8E8E8] rounded-lg flex items-center justify-center gap-3 hover:bg-[#F8F8F8] hover:border-[#CCCCCC] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-body text-[14px] text-[#555] font-medium">Continue with Google</span>
            </button>

            <p className="font-body text-[13px] text-[#999] text-center mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0A0A0A] underline font-semibold hover:text-[#555] transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
