import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import authService from '../../services/authService';
import LogoDisplay from '../../components/ui/LogoDisplay';
import { useGeneralSettings } from '../../contexts/GeneralSettingsContext';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Get general settings for logo and site name
  const { settings: generalSettings } = useGeneralSettings();

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token || user) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email wajib diisi';
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Login attempt:', formData);
      
      // Coba login via cookie (Sanctum SPA) terlebih dahulu
      let response;
      try {
        response = await authService.loginWithCookie({
          email: formData.email,
          password: formData.password
        });
      } catch (e) {
        // Fallback ke token-based jika cookie login gagal (mis. CORS/dev)
        response = await authService.login({
          email: formData.email,
          password: formData.password
        });
      }
      
      console.log('Login successful:', response);
      
      // Check if user is admin or admin_aleg
      const user = authService.getCurrentUser();
      if (!['admin', 'admin_aleg'].includes(user.role)) {
        setErrors({
          general: 'Akses ditolak. Hanya admin yang dapat menggunakan panel ini.'
        });
        authService.logout();
        return;
      }
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error types
      if (typeof error === 'object' && error !== null) {
        // Validation errors from backend
        if (error.email || error.password) {
          setErrors(error);
        } else {
          setErrors({
            general: 'Login gagal. Periksa email dan password Anda.'
          });
        }
      } else {
        setErrors({
          general: typeof error === 'string' ? error : 'Terjadi kesalahan jaringan.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-orange-50">
      <div className="w-full max-w-md p-6">
        {/* Main Login Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-orange-50 rounded-full translate-y-12 -translate-x-12 opacity-30"></div>
          
          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25">
                <LogoDisplay
                  logoUrl={generalSettings.logo_url}
                  siteName=""
                  size="lg"
                  showText={false}
                  fallbackIcon={Shield}
                  className="w-10 h-10 text-white"
                />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-base font-medium">
              Continue to admin dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="relative z-10 space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-medium">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-lg">Signing In...</span>
                </div>
              ) : (
                <span className="text-lg">Sign In</span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500">
              {generalSettings.organization || 'Sistem Admin Bantuan Sosial'} • Admin Portal v2.0
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Powered by React + Laravel • Secure & Modern
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
