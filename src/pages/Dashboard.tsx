import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { api } from '../services/api';
import type { OrderDetails } from '../types';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics
  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalCost, 0);
  const pendingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  
  // Calculate average order value
  const avgOrderValue = activeOrders.length > 0 
    ? Math.round(totalRevenue / activeOrders.length) 
    : 0;

  // Chart data aggregation (Grouped by date for last 7 days)
  const getChartData = () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const formattedDate = `${d.getDate()} June`;
      return formattedDate;
    });

    return dates.map(dateStr => {
      // Find orders matching this day (e.g. "21 June 2026" or "20 June 2026")
      const dayOrders = orders.filter(o => {
        // Compare "20 June" with "20 June 2026"
        return o.orderDate && o.orderDate.includes(dateStr) && o.status !== 'Cancelled';
      });

      const revenue = dayOrders.reduce((sum, o) => sum + o.totalCost, 0);
      const count = dayOrders.length;

      return {
        name: dateStr,
        Revenue: revenue,
        Orders: count,
      };
    });
  };

  const chartData = getChartData();

  return (
    <div className="space-y-8">
      {/* Page header and current date indicator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Welcome Back!
          </h1>
          <p className="text-slate-550 text-xs font-sans">
            Here is what's happening with D-CURE Plus today.
          </p>
        </div>
        <div className="font-sans text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/50">
          Today: {new Date().getDate()} June {new Date().getFullYear()}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          change={{ value: '14.2%', isPositive: true }}
          icon={DollarSign}
          color="green"
          isLoading={loading}
        />
        <StatCard
          title="Total Checkouts"
          value={orders.length}
          change={{ value: '8.4%', isPositive: true }}
          icon={ShoppingBag}
          color="blue"
          isLoading={loading}
        />
        <StatCard
          title="Pending Deliveries"
          value={pendingCount}
          change={{ value: '12%', isPositive: false }}
          icon={Clock}
          color="yellow"
          isLoading={loading}
        />
        <StatCard
          title="Average Basket"
          value={`৳${avgOrderValue.toLocaleString()}`}
          change={{ value: '2.1%', isPositive: true }}
          icon={TrendingUp}
          color="green"
          isLoading={loading}
        />
      </div>

      {/* Analytics Chart & Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Sales Trend Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-150/80 lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-slate-800">
                Sales Trend
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Revenue & order trends over the last 7 days
              </p>
            </div>
            <div className="flex gap-4 font-sans text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-brand-green">
                <span className="h-2 w-2 rounded-full bg-brand-green" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Orders
              </span>
            </div>
          </div>

          <div className="h-72 w-full font-sans text-xs">
            {loading ? (
              <div className="h-full w-full bg-slate-50 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#004d2e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#004d2e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.96)', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px',
                      boxShadow: '0 8px 16px -4px rgba(30, 41, 59, 0.08)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke="#004d2e" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Orders" 
                    stroke="#d4af37" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorOrders)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Order Actions / Status Summary Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-150/80 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="font-display text-base font-bold text-slate-800">
                Order Activity
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Real-time checkout distributions
              </p>
            </div>
            <Link to="/orders" className="text-xs font-semibold text-brand-green hover:underline flex items-center gap-0.5">
              Manage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            {/* Status distribution bars */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650">Processing / Pending</span>
                <span className="font-sans font-bold text-amber-600">{pendingCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${orders.length > 0 ? (pendingCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650">Shipped</span>
                <span className="font-sans font-bold text-blue-600">{shippedCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${orders.length > 0 ? (shippedCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650">Delivered</span>
                <span className="font-sans font-bold text-brand-green">{orders.filter(o => o.status === 'Delivered').length}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-brand-green h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${orders.length > 0 ? (orders.filter(o => o.status === 'Delivered').length / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-1.5 border-t border-slate-100 pt-4 mt-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Total checkout submissions:</span>
                <span className="font-sans font-bold text-slate-800">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Cancelled / Rejected:</span>
                <span className="font-sans font-bold text-brand-red">{orders.filter(o => o.status === 'Cancelled').length}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Latest Orders segment */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-150/80">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-display text-base font-bold text-slate-800">
              Recent Checkout Submissions
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              The latest customer submissions received from the landing page
            </p>
          </div>
          <Link to="/orders" className="text-xs font-semibold text-brand-green hover:underline">
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
          {loading ? (
            <div className="space-y-3 py-4">
              <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
              <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
              <div className="h-10 bg-slate-50 animate-pulse rounded-lg" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center py-8 text-xs font-medium text-slate-400">No recent orders.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-display font-semibold text-xs tracking-wider uppercase">
                  <th className="pb-3.5 pl-2 font-medium">Order ID</th>
                  <th className="pb-3.5 font-medium">Customer Name</th>
                  <th className="pb-3.5 font-medium">Package</th>
                  <th className="pb-3.5 font-medium">Area</th>
                  <th className="pb-3.5 font-medium">Total Cost</th>
                  <th className="pb-3.5 font-medium">Status</th>
                  <th className="pb-3.5 pr-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans font-medium text-slate-700">
                {orders.slice(0, 5).map((order) => {
                  const statusColors = {
                    Processing: 'bg-amber-50 text-amber-600 border border-amber-100',
                    Shipped: 'bg-blue-50 text-blue-600 border border-blue-100',
                    Delivered: 'bg-brand-green-light text-brand-green border border-brand-green/10',
                    Cancelled: 'bg-brand-red/5 text-brand-red border border-brand-red/10',
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pl-2 font-bold font-display text-slate-800">{order.orderNumber || order.id}</td>
                      <td className="py-4 font-display font-semibold text-slate-800">{order.customerName}</td>
                      <td className="py-4 font-display text-slate-600 truncate max-w-[180px]">{order.packageName}</td>
                      <td className="py-4">
                        <span className="font-display">
                          {order.deliveryArea === 'inside' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                        </span>
                      </td>
                      <td className="py-4 font-bold text-slate-800 font-display">৳{order.totalCost}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-display ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 pr-2 text-right">
                        <Link 
                          to="/orders" 
                          state={{ selectedOrderId: order.id }}
                          className="font-display font-bold text-brand-green hover:underline cursor-pointer"
                        >
                          View Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
