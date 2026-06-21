import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Trash2, 
  Eye,
  AlertCircle,
  Truck
} from 'lucide-react';
import { api } from '../services/api';
import type { OrderDetails } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders({
        status: activeTab,
        search: searchQuery,
      });
      setOrders(data);
    } catch (err) {
      toast.error('অর্ডার লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [activeTab, searchQuery]);

  // Extract navigation state to open order modal if routed from dashboard
  useEffect(() => {
    if (location.state && (location.state as any).selectedOrderId && orders.length > 0) {
      const orderId = (location.state as any).selectedOrderId;
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
        // Clear location state to prevent reopening on reload
        window.history.replaceState({}, document.title);
      }
    }
  }, [orders, location.state]);

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: OrderDetails['status']) => {
    try {
      const updated = await api.updateOrderStatus(id, newStatus);
      toast.success(`অর্ডার #${id} স্ট্যাটাস ${newStatus} এ আপডেট করা হয়েছে`);
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      toast.error('স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে');
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে আপনি অর্ডার #${id} মুছে ফেলতে চান?`)) return;
    try {
      await api.deleteOrder(id);
      toast.success(`অর্ডার #${id} সফলভাবে মুছে ফেলা হয়েছে`);
      setOrders(prev => prev.filter(o => o.id !== id));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder(null);
      }
    } catch (err) {
      toast.error('অর্ডার মুছতে সমস্যা হয়েছে');
    }
  };

  // Copy helper
  const handleCopyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('ক্লিপবোর্ডে কপি করা হয়েছে');
    setTimeout(() => setCopiedField(null), 2000);
  };


  const tabs: Array<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'> = [
    'All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  ];

  // Client side filtering for Package options
  const uniquePackages = Array.from(new Set(orders.map(o => o.packageName)));
  const filteredOrders = selectedPackage === 'All' 
    ? orders 
    : orders.filter(o => o.packageName === selectedPackage);

  return (
    <div className="space-y-6">
      {/* Top Controls: Tabs and Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/50 scrollbar-hide max-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-brand-green shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'All' ? 'সব অর্ডার' : tab === 'Processing' ? 'প্রসেসিং' : tab === 'Shipped' ? 'শিপড' : tab === 'Delivered' ? 'ডেলিভার্ড' : 'বাতিল'}
            </button>
          ))}
        </div>

        {/* Text Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Package filter dropdown */}
          <div className="relative">
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-4 py-2.5 rounded-xl pr-8 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            >
              <option value="All">সকল প্যাকেজ</option>
              {uniquePackages.map((pkg, idx) => (
                <option key={idx} value={pkg}>{pkg}</option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-450 pointer-events-none" />
          </div>

          {/* Phone/Name query */}
          <div className="relative">
            <input
              type="text"
              placeholder="আইডি, নাম অথবা ফোন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 text-xs text-slate-800 px-4 py-2.5 pl-9 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 w-full sm:w-60"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-450" />
          </div>
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="glass-panel rounded-2xl border border-slate-150/80 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          {loading ? (
            <div className="p-8 space-y-4">
              <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
              <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
              <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-sm font-semibold text-slate-400">কোনো অর্ডার পাওয়া যায়নি।</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-display font-semibold text-[10px] tracking-wider uppercase bg-slate-50/50">
                  <th className="py-3 px-6">অর্ডার আইডি</th>
                  <th className="py-3 px-6">গ্রাহক</th>
                  <th className="py-3 px-6">মোবাইল</th>
                  <th className="py-3 px-6">প্যাকেজ</th>
                  <th className="py-3 px-6 text-right">মূল্য</th>
                  <th className="py-3 px-6">স্ট্যাটাস</th>
                  <th className="py-3 px-6 text-center">দ্রুত পরিবর্তন</th>
                  <th className="py-3 px-6 text-right pr-8">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans font-medium text-slate-700 bg-white">
                {filteredOrders.map((order) => {
                  const statusColors = {
                    Processing: 'bg-amber-50 text-amber-600 border border-amber-100',
                    Shipped: 'bg-blue-50 text-blue-600 border border-blue-100',
                    Delivered: 'bg-brand-green-light text-brand-green border border-brand-green/10',
                    Cancelled: 'bg-brand-red/5 text-brand-red border border-brand-red/10',
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold font-display text-slate-800">{order.id}</td>
                      <td className="py-4 px-6 font-display font-semibold text-slate-800">{order.customerName}</td>
                      <td className="py-4 px-6 font-display text-slate-650">{order.phoneNumber}</td>
                      <td className="py-4 px-6 font-display text-slate-550 truncate max-w-[150px]" title={order.packageName}>
                        {order.packageName}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800 font-display text-right">৳{order.totalCost}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-display ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderDetails['status'])}
                          className="bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700 px-2 py-1 rounded-lg focus:outline-none"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-slate-500 hover:bg-slate-50 hover:text-brand-green rounded-lg cursor-pointer transition-colors"
                            title="অর্ডার বিবরণ"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 text-slate-500 hover:bg-slate-50 hover:text-brand-red rounded-lg cursor-pointer transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Modal / Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={() => setSelectedOrder(null)}
            >
              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.3 }}
                className="bg-white rounded-2xl border border-slate-100 w-full max-w-lg overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-brand-green p-6 text-white flex justify-between items-center">
                  <div className="font-display">
                    <span className="text-xs font-semibold tracking-wider text-accent-gold uppercase block">Customer Invoice</span>
                    <h3 className="text-lg font-bold">অর্ডার আইডি: {selectedOrder.id}</h3>
                  </div>
                  <div className="text-right font-display text-xs">
                    <p>তারিখ: {selectedOrder.orderDate}</p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                      selectedOrder.status === 'Processing' ? 'bg-amber-400 text-slate-900' :
                      selectedOrder.status === 'Shipped' ? 'bg-blue-400 text-slate-900' :
                      selectedOrder.status === 'Delivered' ? 'bg-emerald-400 text-slate-900' :
                      'bg-red-400 text-white'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide text-left">
                  
                  {/* Customer Information */}
                  <div className="space-y-3 font-display">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ডেলিভারি ঠিকানা</h4>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5 text-xs font-medium text-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{selectedOrder.customerName}</p>
                          <p className="mt-1 font-sans">{selectedOrder.phoneNumber}</p>
                          <p className="mt-1 text-slate-600">{selectedOrder.address}</p>
                          <p className="mt-1.5 text-[10px] text-brand-green bg-brand-green-light/40 px-2 py-0.5 rounded-md inline-block">
                            ডেলিভারি এলাকা: {selectedOrder.deliveryArea === 'inside' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyText(
                            `${selectedOrder.customerName}\n${selectedOrder.phoneNumber}\n${selectedOrder.address}`,
                            'address'
                          )}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          title="ঠিকানা কপি করুন"
                        >
                          {copiedField === 'address' ? <Check className="h-3.5 w-3.5 text-brand-green" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details Invoice calculate */}
                  <div className="space-y-3 font-display">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">অর্ডার বিবরণ</h4>
                    
                    <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 text-xs">
                      <div className="flex justify-between p-3 text-slate-650">
                        <span>{selectedOrder.packageName}</span>
                        <span className="font-bold text-slate-800">৳{selectedOrder.packagePrice}</span>
                      </div>
                      <div className="flex justify-between p-3 text-slate-500">
                        <span>ডেলিভারি চার্জ</span>
                        <span className="font-semibold text-slate-800">৳{selectedOrder.deliveryCharge}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50/50 font-bold text-sm text-slate-900">
                        <span>সর্বমোট মূল্য:</span>
                        <span className="text-brand-green">৳{selectedOrder.totalCost}</span>
                      </div>
                    </div>
                  </div>

                  {/* Missing Delivery validation prompt (Warning banner if missing details) */}
                  {selectedOrder.status === 'Processing' && (!selectedOrder.address.trim() || !selectedOrder.phoneNumber.trim()) && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>সতর্কতা: ডেলিভারি বা কন্টাক্ট ডিটেইলস অপূর্ণ রয়েছে!</span>
                    </div>
                  )}

                  {/* Actions drawers */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="grid grid-cols-3 gap-2">
                      {selectedOrder.status !== 'Shipped' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipped')}
                          className="flex items-center justify-center bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl font-display font-semibold text-[10px] cursor-pointer gap-1"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          শিপড
                        </button>
                      )}
                      {selectedOrder.status !== 'Delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')}
                          className="flex items-center justify-center bg-brand-green-light border border-brand-green/20 hover:bg-brand-green-light/80 text-brand-green py-2.5 rounded-xl font-display font-semibold text-[10px] cursor-pointer gap-1"
                        >
                          <Check className="h-3.5 w-3.5" />
                          ডেলিভার্ড
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center justify-center bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl font-display font-semibold text-[10px] cursor-pointer"
                      >
                        বন্ধ করুন
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
