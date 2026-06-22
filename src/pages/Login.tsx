import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import logoImg from '../assets/cedra.png';
import productImg from '../assets/d-cure.png';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // If already authenticated, redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-800 antialiased overflow-hidden font-sans">
      
      {/* LEFT PANE: LOGIN FORM */}
      <div className="flex w-full flex-col justify-between p-6 sm:p-8 md:p-12 lg:w-[45%] xl:w-[40%] bg-white/70 backdrop-blur-md border-r border-slate-100 z-10">
        
        {/* Header Branding */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center gap-3.5"
        >
          <div className="h-9 w-auto flex items-center shrink-0">
            <img src={logoImg} alt="Cedra Logo" className="h-7 w-auto object-contain" />
          </div>
          <div className="border-l border-slate-200 pl-3.5 py-0.5">
            <h1 className="font-display text-sm font-bold leading-none tracking-tight text-brand-green">
              D-CURE Plus
            </h1>
            <span className="text-[8.5px] font-sans font-semibold tracking-wider text-slate-400 uppercase block mt-1">
              Admin Portal
            </span>
          </div>
        </motion.div>

        {/* Login Card/Form Wrapper */}
        <div className="my-auto py-8">
          <div className="max-w-md mx-auto space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="space-y-2"
            >
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sign In
              </h2>
              <p className="text-sm text-slate-500">
                Welcome back! Please enter your details to access the admin dashboard.
              </p>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">
                  Email Address
                </label>
                <div 
                  className={`relative flex items-center rounded-xl border bg-slate-50 transition-all duration-200 ${
                    emailFocused 
                      ? 'border-brand-green/60 bg-white ring-2 ring-brand-green/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="pl-4 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="name@example.com"
                    className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    required
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-600 block">
                    Password
                  </label>
                </div>
                <div 
                  className={`relative flex items-center rounded-xl border bg-slate-50 transition-all duration-200 ${
                    passwordFocused 
                      ? 'border-brand-green/60 bg-white ring-2 ring-brand-green/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="pl-4 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    required
                    disabled={isSubmitting || isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading || !email || !password}
                className="w-full relative flex items-center justify-center gap-2 rounded-xl bg-brand-green hover:bg-brand-green/95 text-white font-display font-semibold text-sm py-3 px-4 shadow-md shadow-brand-green/10 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 group cursor-pointer"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center lg:text-left text-[11px] text-slate-400 font-sans"
        >
          &copy; {new Date().getFullYear()} D-CURE Plus. All rights reserved.
        </motion.div>
      </div>

      {/* RIGHT PANE: BRANDING ARTWORK & GLOWING BACKDROP */}
      <div className="relative hidden w-[55%] xl:w-[60%] lg:flex flex-col justify-between p-12 bg-slate-950 overflow-hidden select-none">
        
        {/* Animated Mesh Gradients */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-1/4 -right-1/4 h-[80%] w-[80%] rounded-full bg-brand-green/30 blur-[120px] animate-pulse [animation-duration:10s]" />
          <div className="absolute -bottom-1/4 -left-1/4 h-[80%] w-[80%] rounded-full bg-brand-green/15 blur-[120px] animate-pulse [animation-duration:15s] [animation-delay:2s]" />
          <div className="absolute top-[40%] left-[30%] h-[30%] w-[30%] rounded-full bg-accent-gold/5 blur-[90px] animate-pulse [animation-duration:12s] [animation-delay:4s]" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Subtle Decorative Badge */}
        <div className="z-10 self-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-accent-gold uppercase tracking-wider backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold animate-ping" />
            Security Shield Active
          </span>
        </div>

        {/* Main Marketing Pitch */}
        <div className="z-10 my-auto w-full max-w-xl flex flex-col items-center lg:items-start gap-8 xl:gap-10">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 w-full"
          >
            <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-white">
              The Hub for E-Commerce Excellence.
            </h1>
            <p className="font-sans text-sm xl:text-base text-slate-400 leading-relaxed">
              D-CURE Plus e-commerce portal streamlines orders, manages package models, and tracks customer interactions in real time.
            </p>
          </motion.div>

          {/* Floating Product Image showcasing the brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="w-full flex justify-center items-center py-2"
          >
            <div className="relative group max-w-[280px] xl:max-w-[340px] rounded-2xl overflow-hidden shadow-2xl shadow-brand-green/20 border border-white/10 bg-white/5 p-4 backdrop-blur-md animate-float">
              {/* Glow overlay inside card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/25 via-transparent to-accent-gold/10 opacity-70 pointer-events-none" />
              <img 
                src={productImg} 
                alt="D-CURE Plus Product" 
                className="w-full h-auto object-contain rounded-xl relative z-10 transition-transform duration-500 group-hover:scale-103" 
              />
            </div>
          </motion.div>
        </div>

        {/* Footer branding */}
        <div className="z-10 flex justify-between items-center border-t border-white/5 pt-6 text-[10px] text-slate-500 font-sans">
          <div>D-Cure Plus E-commerce Portal v1.2</div>
          <div>Powered by Advanced Secure Auth</div>
        </div>
      </div>
    </div>
  );
}
