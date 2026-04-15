"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Activity, IndianRupee, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkerDashboardProps {
  user: any;
  payouts: any[];
}

export default function WorkerDashboard({ user, payouts }: WorkerDashboardProps) {
  const router = useRouter();
  const totalPayout = payouts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 text-left">
      {/* Active Status Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-8 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Active Protection</span>
            </div>
            <button 
                onClick={() => router.push("/policy")}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest"
            >
                Manage <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-4 text-4xl font-extrabold text-white tracking-tight">Active</div>
          <p className="mt-2 text-sm text-zinc-500 font-medium">Policy Node: {user?.zone || 'IN'}-9023</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-8"
        >
          <div className="flex items-center gap-3 text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Weekly Quota</span>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">65%</span>
            <span className="text-sm text-zinc-500 mb-1 font-medium">Secured</span>
          </div>
          <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
            />
          </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-card p-8 bg-indigo-500/5"
        >
          <div className="flex items-center gap-3 text-indigo-400">
            <IndianRupee className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Total Yield</span>
          </div>
          <div className="mt-4 text-4xl font-extrabold text-white tracking-tight">
            ₹{totalPayout}
          </div>
          <p className="mt-2 text-sm text-zinc-500 font-medium">Auto-settled to platform</p>
        </motion.div>
      </div>

      {/* Ledger Section */}
      <div className="premium-card p-8">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-zinc-500" />
                <h3 className="text-lg font-bold text-white tracking-tight">Disruption Ledger</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Last updated: Just now</span>
        </div>
        
        <div className="space-y-4">
          {payouts.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-500 font-medium">No disruptions recorded in this sector.</p>
            </div>
          ) : (
            payouts.map((payout, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between border border-zinc-800 bg-zinc-900/40 p-5 rounded-2xl transition-all hover:border-zinc-700"
              >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white tracking-tight">{payout.title || "Coverage Approved"}</div>
                      <div className="text-xs text-zinc-500 font-medium mt-0.5">{payout.time} // Ref: {payout.txId || 'N/A'}</div>
                    </div>
                </div>
                <div className="text-emerald-400 text-xl font-extrabold tracking-tight">
                  +₹{payout.amount}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
