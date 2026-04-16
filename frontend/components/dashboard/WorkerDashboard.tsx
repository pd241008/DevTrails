"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Activity, IndianRupee, Clock, CheckCircle2, ArrowUpRight, ShieldAlert, RefreshCw, Zap, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ManualClaimModal from "../ManualClaimModal";

interface WorkerDashboardProps {
  user: any;
  payouts: any[];
  claims: any[];
}

export default function WorkerDashboard({ user, payouts, claims }: WorkerDashboardProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  
  const pendingClaims = claims.filter(c => c.status === 'pending');
  const totalPayout = payouts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-10 text-left">
      {/* Key Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-4">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-6 bg-emerald-500/5 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <CheckCircle2 className="h-20 w-20" />
          </div>
          <div className="flex items-center gap-2 text-emerald-400 mb-6">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Node Status</span>
          </div>
          <div className="text-3xl font-black text-white uppercase italic tracking-tighter">Active</div>
          <p className="mt-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Cluster: {user?.zone || 'IN'}-9023</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-6 bg-indigo-500/5"
        >
          <div className="flex items-center gap-2 text-indigo-400 mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Network Sec</span>
          </div>
          <div className="text-3xl font-black text-white tracking-tighter italic">65%</div>
          <div className="mt-3 h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
            />
          </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card p-6 col-span-2 bg-zinc-900/40"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-zinc-500">
                <IndianRupee className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Liquidity Yield</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">+12%</span>
            </div>
          </div>
          <div className="text-4xl font-black text-white tracking-tighter">
            ₹{totalPayout.toLocaleString()}
          </div>
          <p className="mt-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Real-time parametrics settled</p>
        </motion.div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Activity Stream */}
        <div className="lg:col-span-2 space-y-8">
            {pendingClaims.length > 0 && (
                <div className="p-1 rounded-[32px] bg-gradient-to-b from-indigo-500/20 to-transparent">
                    <div className="premium-card p-8 bg-zinc-950/80 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <RefreshCw className="h-5 w-5 text-indigo-400 animate-spin-slow" />
                                <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Awaiting Adjudication</h3>
                            </div>
                            <span className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                {pendingClaims.length} Request{pendingClaims.length > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {pendingClaims.map((claim) => (
                                <div key={claim.id} className="group flex items-center justify-between bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 transition-all hover:border-zinc-700 hover:bg-zinc-900/60">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                            <Zap className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-white uppercase tracking-wider">{claim.id}</div>
                                            <div className="text-[10px] text-zinc-500 uppercase font-black mt-1">Telemetry Sync: {new Date(claim.timestamp).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest px-2 py-0.5 rounded-md bg-indigo-500/5 border border-indigo-500/10">Under Review</div>
                                        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Trust: {claim.aiScore}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="premium-card p-8 bg-zinc-900/20">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-zinc-500" />
                        <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Settled Ledger</h3>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer">
                        <Activity className="h-4 w-4 text-zinc-500" />
                    </div>
                </div>
                
                <div className="space-y-4">
                  {payouts.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-800/50 rounded-[32px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">No telemetry data recorded</p>
                    </div>
                  ) : (
                    payouts.map((payout, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between border border-transparent bg-zinc-900/40 p-6 rounded-2xl transition-all hover:bg-zinc-900/60 hover:border-zinc-800"
                      >
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                                <Activity className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{payout.title || "Coverage Approved"}</div>
                              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1.5 opacity-60">
                                {payout.time} // Protocol: {payout.txId || 'GS-902-A'}
                              </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-emerald-400 text-2xl font-black tracking-tighter">
                              +₹{payout.amount}
                            </div>
                            <div className="text-[8px] font-black text-emerald-500/40 uppercase tracking-[0.2em] mt-1">Confirmed</div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
            </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
            <div className="premium-card p-10 bg-indigo-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110 duration-500">
                    <ShieldAlert className="h-48 w-48 -rotate-12" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                        <ShieldAlert className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-8 mb-4">Manual Escalation</h3>
                    <p className="text-xs text-white/70 font-bold uppercase tracking-widest leading-relaxed mb-10 flex-1">
                        Node failed to auto-trigger? Submit evidence for multimodal adjudicatoin. 
                    </p>
                    <button 
                       onClick={() => setModalOpen(true)}
                       className="w-full rounded-2xl bg-black py-5 text-xs font-black text-white uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                    >
                       Initialize Protocol
                    </button>
                </div>
            </div>

            <div className="premium-card p-8 border-dashed border-zinc-800 bg-transparent">
                <div className="flex items-center gap-3 text-zinc-600 mb-6">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Compliance Status</span>
                </div>
                <div className="space-y-3">
                    {['Auth Key Sync', 'Location Telemetry', 'Risk Hash'].map((item) => (
                        <div key={item} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-zinc-500">{item}</span>
                            <span className="text-emerald-500">Verified</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      <ManualClaimModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
