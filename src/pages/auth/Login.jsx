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
    if (token) {
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
      
      // Call the actual API using authService
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });
      
      console.log('Login successful:', response);
      
      // Check if user is admin
      const user = authService.getCurrentUser();
      if (user.role !== 'admin') {
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

  // Rest of component sama seperti sebelumnya...
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md p-8">
        {/* Glass Card Effect */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl"></div>
          
          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <LogoDisplay
                  logoUrl={generalSettings.logo_url}
                  siteName=""
                  size="lg"
                  showText={false}
                  fallbackIcon={Shield}
                />
                <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {generalSettings.site_name || 'Admin Portal'}
            </h1>
            <p className="text-gray-300 text-sm">
              {generalSettings.site_description || 'Sistem Bantuan Sosial Digital'}
            </p>
          </div>

          {/* Login Form */}
          <div className="relative z-10 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                <span className="relative z-10">Masuk ke Admin Panel</span>
              )}
              
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Lupa Password?
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-gray-400">
              {generalSettings.organization || 'Sistem Admin Bantuan Sosial'} v1.0
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Powered by React + Laravel • Secure & Modern
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;