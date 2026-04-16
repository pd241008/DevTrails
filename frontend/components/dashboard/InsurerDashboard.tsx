"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { TrendingDown, AlertCircle, Users, Wallet, BarChart3, Shield, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ForecastTab from "./ForecastTab";
import ClaimsReviewTab from "./ClaimsReviewTab";
import { useAppContext } from "../../app/context/AppContext";

const LOSS_RATIO_DATA = [
  { name: 'Mon', ratio: 0.12 },
  { name: 'Tue', ratio: 0.15 },
  { name: 'Wed', ratio: 0.45 },
  { name: 'Thu', ratio: 0.22 },
  { name: 'Fri', ratio: 0.18 },
  { name: 'Sat', ratio: 0.14 },
  { name: 'Sun', ratio: 0.11 },
];

const RISK_DATA = [
  { name: 'Zone A', risk: 85, color: '#f43f5e' }, // Rose 500
  { name: 'Zone B', risk: 45, color: '#6366f1' }, // Indigo 500
  { name: 'Zone C', risk: 20, color: '#10b981' }, // Emerald 500
  { name: 'Zone D', risk: 65, color: '#f43f5e' },
  { name: 'Zone E', risk: 30, color: '#6366f1' },
];

export default function InsurerDashboard({ activeTab: propActiveTab }: { activeTab?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, claims } = useAppContext();
  const activeTab = propActiveTab || searchParams.get('tab') || 'kpi';
  
  const pendingClaimsCount = claims.filter(c => c.status === 'pending').length;

  const setTab = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-900/50 border border-zinc-800 w-fit">
        {[
          { id: 'kpi', label: 'Risk KPIs', icon: Info },
          { id: 'forecast', label: 'Forecasts', icon: BarChart3 },
          { id: 'claims', label: 'Claims', icon: Shield, count: pendingClaimsCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
              : "text-zinc-500 hover:text-white"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white ml-1">
                    {tab.count}
                </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'kpi' && (
          <motion.div 
            key="kpi"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Insurer KPIs */}
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { label: "Loss Ratio Avg", value: "22.4%", icon: TrendingDown, color: "text-emerald-400", sub: "Under Target" },
                { label: "Anomalies", value: "14 Flags", icon: AlertCircle, color: "text-rose-400", sub: "Priority High" },
                { label: "Total Members", value: "12,482", icon: Users, color: "text-indigo-400", sub: "+4% this week" },
                { label: "Net Premiums", value: "₹8.4M", icon: Wallet, color: "text-zinc-400", sub: "Q1 Projected" },
              ].map((kpi, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="premium-card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                      <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{kpi.label}</span>
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">{kpi.value}</div>
                  <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${kpi.color}`}>{kpi.sub}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <motion.div className="premium-card p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white tracking-tight">Claims Loss Ratio</h3>
                  <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">7D Real-time</span>
                  </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={LOSS_RATIO_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip 
                        contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} 
                        itemStyle={{ color: '#6366f1', textTransform: 'uppercase', fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ratio" 
                        stroke="#6366f1" 
                        strokeWidth={4} 
                        dot={{ fill: '#6366f1', strokeWidth: 2, r: 6, stroke: '#18181b' }} 
                        activeDot={{ r: 8, stroke: '#FFF', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div className="premium-card p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white tracking-tight">Risk Distribution</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">ML Forecast</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={RISK_DATA} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} width={70} />
                      <Tooltip 
                         cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                         contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                      />
                      <Bar dataKey="risk" radius={[0, 8, 8, 0]} barSize={32}>
                        {RISK_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'forecast' && (
          <motion.div 
             key="forecast" 
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }} 
             exit={{ opacity: 0, x: -20 }}
          >
            <ForecastTab city={user?.zone || 'Mumbai'} />
          </motion.div>
        )}

        {activeTab === 'claims' && (
          <motion.div 
             key="claims" 
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }} 
             exit={{ opacity: 0, x: -20 }}
          >
            <ClaimsReviewTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
