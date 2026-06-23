import { useEffect, useState } from 'react';
import {
  Globe,
  Search,
  Loader2,
  Map
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';
import type { District } from '../types';

export default function Districts() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [districtQuery, setDistrictQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const data = await api.getDistricts();
        setDistricts(data);
      } catch {
        toast.error('জেলা তালিকা লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoading(false);
      }
    }
    loadDistricts();
  }, []);

  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(districtQuery.toLowerCase()) ||
    d.name_bn.includes(districtQuery) ||
    d.code.includes(districtQuery)
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header details */}
      <div className="text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Districts Directory
          </h1>
          <p className="text-slate-550 text-xs font-sans mt-1">
            Browse and search configured shipping districts for checking out orders.
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="glass-panel rounded-2xl border border-slate-150/80 overflow-hidden bg-white shadow-xs">
        <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand-green" />
            <h3 className="font-display font-bold text-sm text-slate-800">অনুমোদিত জেলা তালিকা ({districts.length})</h3>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full font-mono">
            Read Only
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute inset-y-0 left-3 h-4 w-4 text-slate-405 flex items-center pointer-events-none mt-3" />
            <input
              type="text"
              placeholder="জেলা বা কোড দিয়ে খুঁজুন (যেমন: Dhaka, ঢাকা, 3001)..."
              value={districtQuery}
              onChange={(e) => setDistrictQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-xs text-slate-800 hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:bg-white font-sans transition-all"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-7 w-7 text-brand-green animate-spin" />
              <span className="text-slate-400 font-sans text-xs">জেলা সমূহ লোড করা হচ্ছে...</span>
            </div>
          ) : filteredDistricts.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-sans text-xs">
              কোনো জেলা পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-sans text-xs">
              {filteredDistricts.map((district) => (
                <div 
                  key={district.encrypted_id}
                  className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl hover:border-slate-300 hover:bg-white hover:shadow-xs transition-all duration-200 flex flex-col justify-between text-left"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Map className="h-3.5 w-3.5 text-brand-green/75" />
                      <span className="font-bold text-slate-800 text-sm">{district.name_bn}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium pl-5">{district.name}</div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-500 pl-5">
                    <span className="bg-slate-200/50 px-2 py-0.5 rounded font-mono text-[9px]">Code: {district.code}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
