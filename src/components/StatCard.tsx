import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color: 'green' | 'blue' | 'yellow' | 'red';
  isLoading?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  isLoading = false 
}: StatCardProps) {
  
  const colorMap = {
    green: {
      bg: 'bg-brand-green/5 border-brand-green/10',
      iconBg: 'bg-brand-green text-white shadow-brand-green/20',
      text: 'text-brand-green',
    },
    blue: {
      bg: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
      text: 'text-blue-600',
    },
    yellow: {
      bg: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
      text: 'text-amber-600',
    },
    red: {
      bg: 'bg-brand-red/5 border-brand-red/10',
      iconBg: 'bg-brand-red text-white shadow-brand-red/20',
      text: 'text-brand-red',
    },
  };

  const scheme = colorMap[color];

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 20px -8px rgba(30, 41, 59, 0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass-panel flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 ${scheme.bg}`}
    >
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
            <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="h-8 w-32 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
        </div>
      ) : (
        <>
          {/* Card Head */}
          <div className="flex items-center justify-between">
            <span className="font-display font-medium text-xs text-slate-500 uppercase tracking-wider">
              {title}
            </span>
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-md ${scheme.iconBg}`}>
              <Icon className="h-5 w-5 stroke-[2]" />
            </div>
          </div>

          {/* Card Body */}
          <div className="mt-4">
            <h3 className="font-display text-2xl font-bold text-slate-800 tracking-tight">
              {value}
            </h3>
            
            {/* Change Indicator */}
            {change && (
              <p className="mt-1.5 flex items-center gap-1.5 font-sans text-xs">
                <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                  change.isPositive 
                    ? 'bg-brand-green-light text-brand-green' 
                    : 'bg-brand-red/10 text-brand-red'
                }`}>
                  {change.isPositive ? '+' : ''}{change.value}
                </span>
                <span className="text-slate-400">vs last week</span>
              </p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
