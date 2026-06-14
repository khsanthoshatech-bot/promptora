import React, { useEffect, useState } from 'react';
import { useUser } from '../lib/auth';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { UserProfile, ApiRequest } from '../types';

export default function Overview() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    Promise.all([
      fetch(`/api/user/${user.id}`).then(res => res.json()),
      fetch(`/api/stats/${user.id}`).then(res => res.json())
    ])
    .then(([profileData, statsData]) => {
      setProfile(profileData);
      setStats(statsData);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return <div className="p-8 text-neutral-500">Loading overview...</div>;
  }

  // Process data for charts
  const chartData = [...(stats?.requests || [])].reverse().reduce((acc: any[], req: ApiRequest) => {
    const date = new Date(req.createdAt).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.requests += 1;
      existing.cost += req.cost;
    } else {
      acc.push({ date, requests: 1, cost: req.cost });
    }
    return acc;
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-neutral-300">
      <header className="flex items-center justify-between pb-6 border-b border-neutral-900">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight">Welcome Back 👋</h1>
          <p className="text-sm text-neutral-500 mt-2 font-light">Monitor API traffic, usage analytics, and wallet activity across Promptora.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-950">
            <span className="w-2 h-2 bg-[#00FFB2] rounded-full animate-pulse shadow-[0_0_8px_#00FFB2]"></span>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">System Live</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Wallet Balance" 
          value={`$${(profile?.wallet || 0).toFixed(3)}`} 
        />
        <StatCard 
          title="Total Requests" 
          value={stats?.totalRequests || 0} 
        />
        <StatCard 
          title="Tokens Used" 
          value={(stats?.totalTokens || 0).toLocaleString()} 
        />
        <StatCard 
          title="Total Cost" 
          value={`$${(stats?.totalCost || 0).toFixed(4)}`} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-neutral-900 bg-neutral-950 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-sm font-medium text-white tracking-tighter">Request Velocity</h2>
              <p className="text-xs text-neutral-500 mt-1">Real-time traffic distributed by provider</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 border border-neutral-800 text-neutral-300 text-[10px] rounded uppercase tracking-widest font-semibold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]"></span>Gateway</span>
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-[200px] z-10">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00F5FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#171717" />
                  <XAxis dataKey="date" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#00F5FF' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#00F5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-600 font-mono text-[11px]">
                No request data yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-900 bg-neutral-950 flex flex-col h-[320px] overflow-hidden">
          <div className="p-5 border-b border-neutral-900 flex items-center justify-between bg-black/50">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Recent Logs</h4>
            <span className="text-[10px] text-neutral-400 font-medium hover:text-white transition-colors cursor-pointer">View All</span>
          </div>
          <div className="p-0 flex-1 overflow-y-auto font-mono text-[11px]">
            {stats?.requests?.slice(0, 10).map((req: ApiRequest) => (
              <div key={req.id} className="flex justify-between items-center px-5 py-3 border-b border-neutral-900/50 hover:bg-neutral-900/40 transition-colors">
                <span className="text-neutral-500 w-16 truncate" title={new Date(req.createdAt).toLocaleTimeString()}>
                  {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className={req.status === 200 ? "text-[#00FFB2] truncate flex-1 mx-2" : "text-red-400 truncate flex-1 mx-2"}>
                  {req.model}
                </span>
                <span className="text-white text-right font-medium">
                  ${req.cost.toFixed(4)}
                </span>
              </div>
            ))}
            {(!stats?.requests || stats.requests.length === 0) && (
              <p className="text-neutral-600 text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, onTrendClick }: { title: string, value: string | number, trend?: string, onTrendClick?: () => void }) {
  return (
    <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950 relative overflow-hidden group hover:border-neutral-800 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <p className="text-[10px] text-neutral-500 mb-2 font-bold uppercase tracking-widest relative z-10">{title}</p>
      <div className="flex items-end gap-2 relative z-10">
        <p className="text-3xl font-medium text-white tracking-tight">{value}</p>
        {trend && (
          <span 
            onClick={onTrendClick} 
            className="text-[10px] font-medium text-neutral-300 border border-neutral-800 bg-neutral-900 px-2 py-0.5 rounded cursor-pointer hover:bg-neutral-800 mb-1.5 transition-colors"
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}