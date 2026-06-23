import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Save,
  Loader2,
  AlertCircle,
  Globe,
  Map,
  Search,
  Check,
  Compass,
  ArrowRight,
  Database,
  Link
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';
import type { District, Thana } from '../types';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [insideCharge, setInsideCharge] = useState<number>(60);
  const [outsideCharge, setOutsideCharge] = useState<number>(130);

  // Districts State
  const [districts, setDistricts] = useState<District[]>([]);
  const [districtQuery, setDistrictQuery] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(true);

  // Thanas State
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [thanas, setThanas] = useState<Thana[]>([]);
  const [thanaQuery, setThanaQuery] = useState('');
  const [loadingThanas, setLoadingThanas] = useState(false);

  const handleSelectDistrict = async (district: District) => {
    setSelectedDistrict(district);
    setLoadingThanas(true);
    setThanaQuery('');
    try {
      const data = await api.getThanas(district.code);
      setThanas(data);
    } catch {
      toast.error('থানা সমূহ লোড করতে ব্যর্থ হয়েছে');
      setThanas([]);
    } finally {
      setLoadingThanas(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsData, districtsData] = await Promise.all([
          api.getSettings(),
          api.getDistricts()
        ]);
        setInsideCharge(settingsData.insideDhakaCharge);
        setOutsideCharge(settingsData.outsideDhakaCharge);
        setDistricts(districtsData);
      } catch {
        toast.error('কনফিগারেশন লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoading(false);
        setLoadingDistricts(false);
      }
    }
    loadData();
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
      <div className="glass-panel p-8 rounded-2xl border border-slate-150 animate-pulse space-y-6 mt-6">
        <div className="h-6 w-32 bg-slate-200 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 h-64 bg-slate-150 rounded-lg" />
          <div className="lg:col-span-8 h-96 bg-slate-150 rounded-lg" />
        </div>
      </div>
    );
  }

  const filteredDistricts = districts.filter(d =>
    d.name.toLowerCase().includes(districtQuery.toLowerCase()) ||
    d.name_bn.includes(districtQuery) ||
    d.code.includes(districtQuery)
  );

  const filteredThanas = thanas.filter(t =>
    t.name.toLowerCase().includes(thanaQuery.toLowerCase()) ||
    t.name_bn.includes(thanaQuery) ||
    t.code.includes(thanaQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header details */}
      <div className="text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Global Configurations
          </h1>
          <p className="text-slate-500 text-xs font-sans mt-1">
            Manage shipping rates, supported geography mapping, and core checkout controls.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-3.5 py-1.5 rounded-xl font-mono text-[10px] text-slate-500 self-start md:self-auto">
          <Database className="h-3.5 w-3.5 text-brand-green animate-pulse" />
          API Gateway: Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery charge & System Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Settings Form panel */}
          <div className="glass-panel rounded-2xl border border-slate-150/80 overflow-hidden bg-white shadow-xs">
            <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-green" />
              <h3 className="font-display font-bold text-sm text-slate-800">ডেলিভারি চার্জ কনফিগারেশন</h3>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 text-left font-sans text-xs">
              {/* Inside Dhaka charge */}
              <div className="space-y-2">
                <label className="font-display font-semibold text-slate-700 block flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand-green" />
                  ঢাকার ভিতরে ডেলিভারি চার্জ *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-display font-bold text-xs select-none">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={insideCharge}
                    onChange={(e) => setInsideCharge(Number(e.target.value))}
                    placeholder="60"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-800 font-display font-bold text-sm hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Outside Dhaka charge */}
              <div className="space-y-2">
                <label className="font-display font-semibold text-slate-700 block flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand-green" />
                  ঢাকার বাইরে ডেলিভারি চার্জ *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-display font-bold text-xs select-none">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={outsideCharge}
                    onChange={(e) => setOutsideCharge(Number(e.target.value))}
                    placeholder="130"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-3 text-slate-800 font-display font-bold text-sm hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Save button CTA */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-[#125136] text-white px-6 py-3 rounded-xl font-display font-bold text-xs shadow-md cursor-pointer transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      সংরক্ষণ করা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      কনফিগারেশন সংরক্ষণ করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Warning alert banner */}
          <div className="p-4 bg-brand-green/5 border border-brand-green/15 rounded-2xl text-brand-green text-xs font-medium flex items-start gap-2.5 text-left shadow-xs">
            <AlertCircle className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-display font-bold">তাত্ক্ষণিক প্রভাব নোটিশ</p>
              <p className="font-sans text-[11px] leading-relaxed text-slate-600">
                এখানে আপনার করা যেকোনো পরিবর্তন কাস্টমার সাইডের চেকআউট ক্যালকুলেটরে সরাসরি প্রভাব ফেলবে।
              </p>
            </div>
          </div>


        </div>

        {/* Right Column: Unified Geographic Mapping Directory */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-2xl border border-slate-150/80 overflow-hidden bg-white shadow-xs">
            {/* Main Header */}
            <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-left">
                <Map className="h-5 w-5 text-brand-green animate-pulse" />
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-800">ভৌগোলিক ম্যাপিং ডিরেক্টরি</h3>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">শিপিং জোনসমূহের জেলা ও থানার বিবরণ দেখুন।</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2.5 py-1 rounded-full font-mono">
                Read Only
              </span>
            </div>

            {/* Split screen layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Left Pane: Districts */}
              <div className="p-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs text-slate-700 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-brand-green" />
                    জেলা তালিকা ({districts.length})
                  </h4>
                </div>

                <div className="relative">
                  <Search className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 flex items-center pointer-events-none mt-2.5" />
                  <input
                    type="text"
                    placeholder="জেলা বা কোড দিয়ে খুঁজুন..."
                    value={districtQuery}
                    onChange={(e) => setDistrictQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 text-xs text-slate-800 hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-sans"
                  />
                </div>

                {loadingDistricts ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 text-brand-green animate-spin" />
                  </div>
                ) : filteredDistricts.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 font-sans text-xs">
                    কোনো জেলা পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-2 h-[480px] overflow-y-auto pr-1 font-sans text-xs">
                    {filteredDistricts.map((district) => {
                      const isSelected = selectedDistrict?.encrypted_id === district.encrypted_id;
                      return (
                        <button
                          type="button"
                          key={district.encrypted_id}
                          onClick={() => handleSelectDistrict(district)}
                          className={`w-full p-3 border rounded-xl flex items-center justify-between transition-all duration-150 cursor-pointer text-left active:scale-[0.99] group ${isSelected
                            ? 'border-brand-green bg-brand-green/5 shadow-xs font-semibold'
                            : 'bg-slate-50/50 border-slate-200/60 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                        >
                          <div className="space-y-0.5">
                            <div className={`font-bold transition-colors ${isSelected ? 'text-brand-green' : 'text-slate-800'}`}>
                              {district.name_bn}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">{district.name}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-mono text-[9px] ${isSelected ? 'bg-brand-green/10 text-brand-green' : 'bg-slate-200/50 text-slate-500'
                              }`}>
                              {district.code}
                            </span>
                            <ArrowRight className={`h-3.5 w-3.5 transition-all ${isSelected ? 'text-brand-green translate-x-0' : 'text-slate-300 group-hover:translate-x-0.5'
                              }`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Pane: Thanas */}
              <div className="p-5 flex flex-col space-y-4 bg-slate-50/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs text-slate-700 flex items-center gap-1.5 min-h-[1.5rem] text-left">
                    {selectedDistrict ? (
                      <>
                        <Check className="h-4 w-4 text-brand-green" />
                        থানা সমূহ: {selectedDistrict.name_bn} ({thanas.length})
                      </>
                    ) : (
                      'থানা সমূহ'
                    )}
                  </h4>
                </div>

                {!selectedDistrict ? (
                  <div className="flex flex-col items-center justify-center h-[480px] text-center p-6 text-slate-400 font-sans text-xs space-y-3">
                    <Compass className="h-10 w-10 text-slate-300 stroke-1 animate-pulse" />
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-500">কোনো জেলা নির্বাচিত নেই</p>
                      <p className="text-[11px] leading-relaxed max-w-[200px] mx-auto text-slate-400">
                        থানার তালিকা দেখতে বামদিকের তালিকা থেকে যেকোনো একটি জেলা নির্বাচন করুন।
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 flex items-center pointer-events-none mt-2.5" />
                      <input
                        type="text"
                        placeholder={`${selectedDistrict.name_bn} জেলার থানা দিয়ে খুঁজুন...`}
                        value={thanaQuery}
                        onChange={(e) => setThanaQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 text-xs text-slate-800 hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-sans"
                      />
                    </div>

                    {loadingThanas ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 text-brand-green animate-spin" />
                      </div>
                    ) : filteredThanas.length === 0 ? (
                      <div className="text-center py-20 text-slate-400 font-sans text-xs">
                        কোনো থানা পাওয়া যায়নি।
                      </div>
                    ) : (
                      <div className="space-y-2 h-[480px] overflow-y-auto pr-1 font-sans text-xs scroll-smooth">
                        {filteredThanas.map((thana) => (
                          <div
                            key={thana.encrypted_id}
                            className="p-3 bg-white border border-slate-200/60 rounded-xl hover:border-slate-300 transition-all flex items-center justify-between text-left"
                          >
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-800">{thana.name_bn}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{thana.name}</div>
                            </div>
                            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono text-[9px]">
                              {thana.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
