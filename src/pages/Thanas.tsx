import { useEffect, useState } from 'react';
import {
  Globe,
  Search,
  Loader2,
  Compass,
  MapPin,
  Check,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';
import type { District, Thana } from '../types';

export default function Thanas() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [thanas, setThanas] = useState<Thana[]>([]);
  const [thanaQuery, setThanaQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingThanas, setLoadingThanas] = useState(false);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const data = await api.getDistricts();
        setDistricts(data);
      } catch {
        toast.error('জেলা তালিকা লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoadingDistricts(false);
      }
    }
    loadDistricts();
  }, []);

  const handleSelectDistrict = async (district: District) => {
    setSelectedDistrict(district);
    setLoadingThanas(true);
    setThanaQuery('');
    try {
      const data = await api.getThanas(district.code);
      setThanas(data);
    } catch {
      toast.error('থানা তালিকা লোড করতে ব্যর্থ হয়েছে');
      setThanas([]);
    } finally {
      setLoadingThanas(false);
    }
  };

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header details */}
      <div className="text-left border-b border-slate-100 pb-5">
        <h1 className="font-display text-2xl font-bold text-slate-800">
          Thanas Directory
          {selectedDistrict && (
            <span className="text-brand-green font-display text-base font-bold ml-2 font-sans">
              &rsaquo; {selectedDistrict.name_bn}
            </span>
          )}
        </h1>
        <p className="text-slate-550 text-xs font-sans mt-1">
          Select a district and browse supported delivery thanas.
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-150/80 overflow-hidden bg-white shadow-xs">
        {/* Split screen layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Left Panel: Districts Selector (md:col-span-5) */}
          <div className="md:col-span-5 p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-xs text-slate-700 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-brand-green" />
                ১. জেলা নির্বাচন করুন ({districts.length})
              </h4>
            </div>

            <div className="relative">
              <Search className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 flex items-center pointer-events-none mt-2.5" />
              <input
                type="text"
                placeholder="জেলা খুঁজুন..."
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
                      className={`w-full p-3 border rounded-xl flex items-center justify-between transition-all duration-150 cursor-pointer text-left active:scale-[0.99] group ${
                        isSelected
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
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] ${
                          isSelected ? 'bg-brand-green/10 text-brand-green' : 'bg-slate-200/50 text-slate-500'
                        }`}>
                          {district.code}
                        </span>
                        <ArrowRight className={`h-3.5 w-3.5 transition-all ${
                          isSelected ? 'text-brand-green translate-x-0' : 'text-slate-300 group-hover:translate-x-0.5'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Thanas List (md:col-span-7) */}
          <div className="md:col-span-7 p-5 flex flex-col space-y-4 bg-slate-50/20">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-xs text-slate-700 flex items-center gap-1.5 min-h-[1.5rem] text-left">
                {selectedDistrict ? (
                  <>
                    <Check className="h-4 w-4 text-brand-green" />
                    ২. থানার তালিকা: {selectedDistrict.name_bn} ({thanas.length})
                  </>
                ) : (
                  '২. থানার তালিকা'
                )}
              </h4>
            </div>

            {!selectedDistrict ? (
              <div className="flex flex-col items-center justify-center h-[520px] text-center p-6 text-slate-400 font-sans text-xs space-y-3">
                <Compass className="h-10 w-10 text-slate-300 stroke-1 animate-pulse" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-500">কোনো জেলা নির্বাচিত নেই</p>
                  <p className="text-[11px] leading-relaxed max-w-[260px] mx-auto text-slate-400">
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
                    placeholder={`${selectedDistrict.name_bn} জেলার থানা দিয়ে খুঁজুন (যেমন: Atwari, আটোয়ারী)...`}
                    value={thanaQuery}
                    onChange={(e) => setThanaQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 text-xs text-slate-800 hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-sans focus:bg-white"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[480px] overflow-y-auto pr-1 font-sans text-xs">
                    {filteredThanas.map((thana) => (
                      <div
                        key={thana.encrypted_id}
                        className="p-3 bg-white border border-slate-200/60 rounded-xl hover:border-slate-300 transition-all flex items-center justify-between text-left shadow-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-brand-green/75" />
                            <span className="font-bold text-slate-800">{thana.name_bn}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium pl-5">{thana.name}</div>
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
  );
}
