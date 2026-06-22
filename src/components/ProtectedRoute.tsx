import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          {/* Logo Animation */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-green text-accent-gold shadow-lg shadow-brand-green/20">
            <ShieldCheck className="h-9 w-9 stroke-[2]" />
            <span className="absolute inset-0 rounded-2xl border border-brand-green animate-ping opacity-25" />
          </div>

          <div className="space-y-1 mt-2">
            <h3 className="font-display text-sm font-bold tracking-wide text-brand-green uppercase">
              D-CURE Plus
            </h3>
            <p className="text-xs text-slate-450">Securing your session...</p>
          </div>

          {/* Simple Spinner */}
          <div className="mt-4 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-green/30 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-brand-green/60 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-brand-green animate-bounce" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
