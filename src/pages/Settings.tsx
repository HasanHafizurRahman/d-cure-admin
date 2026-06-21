import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [insideCharge, setInsideCharge] = useState<number>(60);
  const [outsideCharge, setOutsideCharge] = useState<number>(130);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getSettings();
        setInsideCharge(data.insideDhakaCharge);
        setOutsideCharge(data.outsideDhakaCharge);
      } catch {
        toast.error('কনফিগারেশন লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (insideCharge < 0 || outsideCharge < 0) {
      return toast.error('ডেলিভারি চার্জ ঋণাত্মক হতে পারবে না');
    }
    setSaving(true);
    try {
      await api.updateSettings({
        insideDhakaCharge: insideCharge,
        outsideDhakaCharge: outsideCharge,
      });
      toast.success('কনফিগারেশন সফলভাবে সংরক্ষণ করা হয়েছে');
    } catch {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-150 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded-md" />
        <div className="h-10 bg-slate-150 rounded-lg" />
        <div className="h-10 bg-slate-150 rounded-lg" />
        <div className="h-10 bg-slate-150 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header details */}
      <div className="text-left">
        <h1 className="font-display text-2xl font-bold text-slate-800">
          Global Configurations
        </h1>
        <p className="text-slate-555 text-xs font-sans">
          Manage shipping rates and support connections mapping directly to the client checkout form.
        </p>
      </div>

      {/* Info Warning alert banner */}
      <div className="p-4 bg-brand-green/5 border border-brand-green/15 rounded-2xl text-brand-green text-xs font-medium flex items-start gap-2.5 text-left">
        <AlertCircle className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-display font-bold">তাত্ক্ষণিক প্রভাব নোটিশ</p>
          <p className="font-sans text-[11px] leading-relaxed text-slate-600">
            এখানে আপনার করা যেকোনো পরিবর্তন কাস্টমার সাইডের চেকআউট ক্যালকুলেটরে সরাসরি প্রভাব ফেলবে।
          </p>
        </div>
      </div>

      {/* Settings Form panel */}
      <div className="glass-panel rounded-2xl border border-slate-150/80 overflow-hidden bg-white">
        <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-brand-green" />
          <h3 className="font-display font-bold text-sm text-slate-800">ডেলিভারি চার্জ</h3>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5 text-left font-sans text-xs">
          {/* Inside Dhaka charge */}
          <div className="space-y-1.5">
            <label className="font-display font-semibold text-slate-700 block flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-green" />
              ঢাকার ভিতরে ডেলিভারি চার্জ (৳) *
            </label>
            <input
              type="number"
              value={insideCharge}
              onChange={(e) => setInsideCharge(Number(e.target.value))}
              placeholder="60"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          {/* Outside Dhaka charge */}
          <div className="space-y-1.5">
            <label className="font-display font-semibold text-slate-700 block flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-green" />
              ঢাকার বাইরে ডেলিভারি চার্জ (৳) *
            </label>
            <input
              type="number"
              value={outsideCharge}
              onChange={(e) => setOutsideCharge(Number(e.target.value))}
              placeholder="130"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            />
          </div>


          {/* Save button CTA */}
          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-brand-green hover:bg-[#125136] text-white px-6 py-3 rounded-xl font-display font-bold text-xs shadow-md cursor-pointer transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  সংরক্ষণ করুন
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
