import { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  X
} from 'lucide-react';
import { api } from '../services/api';
import type { PackageOption } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

// Custom Hook to Auto-calculate Savings
function usePackageSavings(price: number, originalPrice: number) {
  return useMemo(() => {
    return originalPrice > price ? originalPrice - price : 0;
  }, [price, originalPrice]);
}

// Inline Bottle SVG component for premium vector rendering
const BottleSVG = ({ className = "h-28" }: { className?: string }) => (
  <svg className={`${className} w-auto`} viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cap */}
    <rect x="35" y="10" width="30" height="15" rx="3" fill="#d4af37" />
    <line x1="39" y1="10" x2="39" y2="25" stroke="#9a7b1c" strokeWidth="1.5" />
    <line x1="44" y1="10" x2="44" y2="25" stroke="#9a7b1c" strokeWidth="1.5" />
    <line x1="50" y1="10" x2="50" y2="25" stroke="#9a7b1c" strokeWidth="1.5" />
    <line x1="56" y1="10" x2="56" y2="25" stroke="#9a7b1c" strokeWidth="1.5" />
    <line x1="61" y1="10" x2="61" y2="25" stroke="#9a7b1c" strokeWidth="1.5" />

    {/* Neck */}
    <rect x="40" y="25" width="20" height="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />

    {/* Body */}
    <rect x="20" y="35" width="60" height="100" rx="10" fill="#004d2e" stroke="#003520" strokeWidth="2.5" />

    {/* Label BG */}
    <rect x="26" y="55" width="48" height="60" rx="3" fill="#ffffff" />

    {/* Leaf details */}
    <path d="M50 63C45 68 42 73 42 78C42 82 45 85 50 85C55 85 58 82 58 78C58 73 55 68 50 63Z" fill="#004d2e" />
    <text x="50" y="96" fill="#004d2e" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">D-CURE</text>
    <text x="50" y="103" fill="#d4af37" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">PLUS</text>

    {/* Reflection Highlight */}
    <rect x="23" y="38" width="5" height="94" rx="2.5" fill="#ffffff" fillOpacity="0.12" />
  </svg>
);

// Bottles layout renderer based on package configurations
const BottlesPreview = ({ id }: { id: string }) => {
  if (id === 'single' || id.includes('1') || id.includes('১')) {
    return (
      <div className="relative h-32 flex items-center justify-center">
        <BottleSVG className="h-28" />
      </div>
    );
  } else if (id === 'double' || id.includes('2') || id.includes('২')) {
    return (
      <div className="relative h-32 flex items-end justify-center pb-1">
        {/* Back Bottle */}
        <div className="transform -rotate-12 translate-x-4 opacity-80 filter blur-[0.2px] scale-90">
          <BottleSVG className="h-24" />
        </div>
        {/* Front Bottle */}
        <div className="relative z-10">
          <BottleSVG className="h-28" />
        </div>
      </div>
    );
  } else {
    // Triple or multiple course
    return (
      <div className="relative h-32 flex items-end justify-center pb-1">
        {/* Left Back */}
        <div className="transform -rotate-12 translate-x-6 opacity-75 filter blur-[0.2px] scale-85">
          <BottleSVG className="h-24" />
        </div>
        {/* Right Back */}
        <div className="transform rotate-12 -translate-x-6 opacity-75 filter blur-[0.2px] scale-85">
          <BottleSVG className="h-24" />
        </div>
        {/* Center Front */}
        <div className="relative z-10">
          <BottleSVG className="h-28" />
        </div>
      </div>
    );
  }
};

export default function Products() {
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPkg, setEditingPkg] = useState<PackageOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCapsules, setFormCapsules] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formLabel, setFormLabel] = useState('');
  const [formIsPopular, setFormIsPopular] = useState(false);

  // Calculate savings using the custom hook
  const formSavings = usePackageSavings(formPrice, formOriginalPrice);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await api.getPackages();
      setPackages(data);
    } catch {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openAddModal = () => {
    setEditingPkg(null);
    setFormId('');
    setFormTitle('');
    setFormCapsules('');
    setFormPrice(0);
    setFormOriginalPrice(0);
    setFormLabel('বিশেষ অফার');
    setFormIsPopular(false);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: PackageOption) => {
    setEditingPkg(pkg);
    setFormId(pkg.id);
    setFormTitle(pkg.title ? String(pkg.title) : '');
    setFormCapsules(pkg.capsules ? String(pkg.capsules) : '');
    setFormPrice(pkg.price);
    setFormOriginalPrice(pkg.originalPrice || pkg.price);
    setFormLabel(pkg.label || '');
    setFormIsPopular(pkg.isPopular || false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package? This may affect the customer checkout page.')) return;
    try {
      await api.deletePackage(id);
      toast.success('Package deleted successfully');
      setPackages(prev => prev.filter(p => p.id !== id));
    } catch {
      toast.error('Failed to delete package');
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!String(formTitle || '').trim()) return toast.error('Please enter the package title');
    if (!String(formCapsules || '').trim()) return toast.error('Please specify capsule quantity');
    if (formPrice <= 0) return toast.error('Please enter a valid price');

    const pkgData = {
      title: formTitle,
      capsules: formCapsules,
      price: formPrice,
      originalPrice: formOriginalPrice > 0 ? formOriginalPrice : formPrice,
      savings: formSavings,
      label: formLabel,
      isPopular: formIsPopular,
    };

    try {
      if (editingPkg) {
        // Update
        const updated = await api.updatePackage(formId, pkgData);
        toast.success('Package updated successfully');
        setPackages(prev => prev.map(p => p.id === formId ? updated : p));
      } else {
        // Create
        const created = await api.createPackage(pkgData);
        toast.success('New package added successfully');
        setPackages(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save package');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Package Pricing grid
          </h1>
          <p className="text-slate-550 text-xs font-sans">
            Customize package combinations, original pricing levels, and highlight deals.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brand-green hover:bg-[#125136] text-white px-4 py-2.5 rounded-xl font-display font-semibold text-xs transition-colors shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add New Package
        </button>
      </div>

      {/* Packages Grid display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 animate-pulse rounded-2xl border" />
          <div className="h-64 bg-slate-100 animate-pulse rounded-2xl border" />
          <div className="h-64 bg-slate-100 animate-pulse rounded-2xl border" />
        </div>
      ) : packages.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-2xl border border-slate-150">
          <p className="text-slate-400 font-semibold text-sm">No packages found. Create a new one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-lg ${pkg.isPopular
                  ? 'border-accent-gold ring-2 ring-accent-gold/20'
                  : 'border-slate-200'
                }`}
            >
              {/* Popular Flag corner ribbon */}
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
                  <div className="absolute top-3 -right-8 bg-accent-gold text-amber-950 text-[9px] font-display font-bold py-1 px-8 text-center uppercase tracking-wider transform rotate-45 shadow-xs">
                    সেরা অফার
                  </div>
                </div>
              )}

              {/* Package card layout items */}
              <div className="space-y-4 text-center">

                {/* Visual SVG representation */}
                <BottlesPreview id={pkg.id} />

                {/* Info and Price labels */}
                <div className="space-y-2">
                  {pkg.label && (
                    <span className="inline-block bg-[#004d2e]/5 text-brand-green font-display text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-brand-green/10">
                      {pkg.label}
                    </span>
                  )}
                  <h3 className="text-base sm:text-lg font-display font-bold text-slate-800 truncate">
                    {pkg.title}
                  </h3>
                  <p className="text-[10px] font-sans text-slate-400">
                    ID: {pkg.id} • {pkg.capsules}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <div className="text-2xl font-display font-bold text-brand-green">
                    ৳{pkg.price}
                  </div>
                  {pkg.savings && pkg.savings > 0 ? (
                    <div className="text-xs text-slate-500 font-sans flex items-center justify-center gap-1.5">
                      <span className="line-through text-brand-red font-display">৳{pkg.originalPrice}</span>
                      <span className="bg-brand-red/10 text-brand-red px-1.5 py-0.5 rounded-md font-semibold text-[10px]">
                        ৳{pkg.savings} Save!
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Card Footer Actions (Edit & Delete overlay icons) */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="flex items-center gap-1 text-slate-500 hover:text-brand-green bg-slate-50 hover:bg-brand-green-light/45 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="flex items-center gap-1 text-slate-500 hover:text-brand-red bg-slate-50 hover:bg-brand-red/15 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Package Modal Wrapper */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2"
            >
              {/* Left Side: Editor Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left border-r border-slate-100">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-display font-bold text-slate-800">
                    {editingPkg ? 'Edit Package' : 'Add New Package'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3.5 font-sans text-xs">
                  {/* Title Input */}
                  <div className="space-y-1">
                    <label className="font-display font-semibold text-slate-700">Package Title *</label>
                    <input
                      type="text"
                      placeholder="e.g., 1 Box (120 Capsules)"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>

                  {/* Capsules Quantity Input */}
                  <div className="space-y-1">
                    <label className="font-display font-semibold text-slate-700">Capsule Quantity *</label>
                    <input
                      type="text"
                      placeholder="e.g., 120 Capsules"
                      value={formCapsules}
                      onChange={(e) => setFormCapsules(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>

                  {/* Prices & Original Price row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-display font-semibold text-slate-700">Selling Price (৳) *</label>
                      <input
                        type="number"
                        placeholder="1200"
                        value={formPrice || ''}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-display font-semibold text-slate-700">Original Price (৳)</label>
                      <input
                        type="number"
                        placeholder="1200"
                        value={formOriginalPrice || ''}
                        onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      />
                    </div>
                  </div>

                  {/* Badge Label Offer text */}
                  <div className="space-y-1">
                    <label className="font-display font-semibold text-slate-700">Offer Label</label>
                    <input
                      type="text"
                      placeholder="যেমন: বিশেষ অফার, সেরা অফার (ফুল কোর্স)"
                      value={formLabel}
                      onChange={(e) => setFormLabel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>

                  {/* Popular Highlight Toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                    <div className="font-display">
                      <span className="font-semibold text-slate-700 text-xs block">পপুলার ফ্ল্যাগ হাইলাইট</span>
                      <span className="text-[10px] text-slate-400">রিং বর্ডার এবং গোল্ডেন রিবন যুক্ত করবে</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsPopular}
                        onChange={(e) => setFormIsPopular(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-250 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 rounded-xl font-display font-semibold text-xs cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-brand-green hover:bg-[#125136] text-white rounded-xl font-display font-semibold text-xs cursor-pointer transition-colors shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </form>

              {/* Right Side: Real-time Preview Panel */}
              <div className="bg-slate-50 p-6 flex flex-col justify-center items-center text-center">
                <div className="mb-4 text-left w-full">
                  <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-wider">Live Site Preview</h4>
                  <p className="text-[10px] text-slate-500 font-sans">See changes in real-time as you type</p>
                </div>

                {/* Client Side Pricing Card Representation */}
                <div className="w-full max-w-xs">
                  <div
                    className={`relative bg-white border rounded-2xl p-6 flex flex-col justify-between text-center select-none shadow-md ${formIsPopular
                        ? 'border-accent-gold ring-2 ring-accent-gold/20'
                        : 'border-slate-200'
                      }`}
                  >
                    {/* Ribbon */}
                    {formIsPopular && (
                      <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
                        <div className="absolute top-3 -right-8 bg-accent-gold text-amber-950 text-[9px] font-display font-bold py-1 px-8 text-center uppercase tracking-wider transform rotate-45 shadow-xs">
                          সেরা অফার
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Interactive SVG renderer */}
                      <BottlesPreview id={formId || formTitle || 'single'} />

                      {/* Info & Badges */}
                      <div className="space-y-1.5">
                        <span className="inline-block bg-[#004d2e]/5 text-brand-green font-display text-[9px] font-bold px-2 py-0.5 rounded-full border border-brand-green/10">
                          {formLabel || 'প্যাকেজ অফার'}
                        </span>
                        <h3 className="text-sm sm:text-base font-display font-bold text-slate-800 truncate">
                          {formTitle || 'Package Title'}
                        </h3>
                        <p className="text-[9px] font-sans text-slate-400">
                          {formCapsules || '120 Capsules'}
                        </p>
                      </div>

                      {/* Prices */}
                      <div className="space-y-0.5">
                        <div className="text-xl font-display font-bold text-brand-green">
                          ৳{formPrice || 0}
                        </div>
                        {formSavings > 0 ? (
                          <div className="text-[10px] text-slate-500 font-sans flex items-center justify-center gap-1.5">
                            <span className="line-through text-brand-red font-display">৳{formOriginalPrice}</span>
                            <span className="bg-brand-red/10 text-brand-red px-1 py-0.5 rounded-md font-semibold">
                              ৳{formSavings} Save!
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100">
                      <div
                        className={`w-full flex items-center justify-center py-2.5 rounded-md font-display font-bold text-[11px] select-none ${formIsPopular
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'bg-white border border-slate-800 text-slate-800'
                          }`}
                      >
                        Choose Package
                        <ArrowRight size={12} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
