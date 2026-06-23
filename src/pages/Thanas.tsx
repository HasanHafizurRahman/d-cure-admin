import { useEffect, useState } from 'react';
import {
  Compass,
  Search,
  Loader2,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { toast } from 'sonner';
import type { Thana } from '../types';

export default function Thanas() {
  const [thanas, setThanas] = useState<Thana[]>([]);
  const [thanaQuery, setThanaQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadThanas() {
      try {
        const data = await api.getThanas();
        setThanas(data);
      } catch {
        toast.error('থানা তালিকা লোড করতে ব্যর্থ হয়েছে');
      } finally {
        setLoading(false);
      }
    }
    loadThanas();
  }, []);

  const filteredThanas = thanas.filter(t =>
    t.name.toLowerCase().includes(thanaQuery.toLowerCase()) ||
    t.name_bn.includes(thanaQuery) ||
    t.code.includes(thanaQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header details */}
      <div className="text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Thanas Directory
          </h1>
          <p className="text-slate-550 text-xs font-sans mt-1">
            Browse and search configured shipping thanas.
          </p>
        </div>
      </div>

      {/* Main card */}
      <div className="glass-panel rounded-2xl border border-slate-150/80 overflow-hidden bg-white shadow-xs">
        <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-brand-green" />
            <h3 className="font-display font-bold text-sm text-slate-800">অনুমোদিত থানা তালিকা ({thanas.length})</h3>
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
              placeholder="থানা বা কোড দিয়ে খুঁজুন (যেমন: Atwari, আটোয়ারী, 550602)..."
              value={thanaQuery}
              onChange={(e) => setThanaQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-xs text-slate-800 hover:border-slate-350 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:bg-white font-sans transition-all"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-7 w-7 text-brand-green animate-spin" />
              <span className="text-slate-400 font-sans text-xs">থানা সমূহ লোড করা হচ্ছে...</span>
            </div>
          ) : filteredThanas.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-sans text-xs">
              কোনো থানা পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-sans text-xs">
              {filteredThanas.map((thana) => (
                <div
                  key={thana.encrypted_id}
                  className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl hover:border-slate-350 hover:bg-white hover:shadow-xs transition-all duration-200 flex flex-col justify-between text-left shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand-green/75" />
                      <span className="font-bold text-slate-800 text-sm">{thana.name_bn}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium pl-5">{thana.name}</div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-500 pl-5">
                    <span className="bg-slate-200/50 px-2 py-0.5 rounded font-mono text-[9px]">Code: {thana.code}</span>
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
