"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Calendar, Activity, IndianRupee } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import DevPanel from "../../components/DevPanel";
import PayoutModal from "../../components/PayoutModal";
import { AnimatePresence, motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const { user, policyTier, payouts, isHydrated } = useAppContext();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState({ event: "", amount: 0 });

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/register");
    }
  }, [user, isHydrated, router]);

  const handleDevTrigger = (event: string, amount: number) => {
    setCurrentTrigger({ event, amount });
    setModalOpen(true);
  };

  if (!user || !isHydrated) return null;

  const totalPayout = payouts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* Top Banner */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user.name}</h1>
            <p className="text-sm text-zinc-400">Operating in {user.zone} via {user.platform}</p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold text-indigo-300">{policyTier || "Uninsured"} Policy Active</span>
          </div>
        </div>
      </div>

      <main className="mx-auto mt-8 max-w-5xl space-y-6 px-6">
        {/* Uninsured Prompt */}
        {!policyTier && (
          <div className="flex flex-col sm:flex-row items-center justify-between rounded-3xl border border-orange-500/30 bg-orange-500/10 p-6 shadow-lg shadow-orange-500/5">
            <div>
              <h3 className="text-xl font-bold text-orange-400">You are currently uninsured!</h3>
              <p className="mt-1 text-sm text-zinc-300">Protect your earnings against real-world disruptions. Get covered instantly for zero-touch payouts.</p>
            </div>
            <button 
              onClick={() => router.push("/policy")} 
              className="mt-4 sm:mt-0 whitespace-nowrap rounded-full bg-orange-500 px-6 py-3 font-bold text-black transition-all hover:bg-orange-400 hover:scale-105"
            >
              Select Coverage Plan
            </button>
          </div>
        )}
        {/* Active Status Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-3 text-emerald-400">
              <Activity className="h-5 w-5" />
              <span className="font-semibold">Live Oracle Status</span>
            </div>
            <div className="mt-4 text-3xl font-black text-white">Monitoring</div>
            <p className="mt-1 text-sm text-zinc-500">Weather APIs connected successfully.</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <Calendar className="h-5 w-5" />
              <span className="font-semibold">Days Covered</span>
            </div>
            <div className="mt-4 text-3xl font-black text-white">56 Days</div>
            <p className="mt-1 text-sm text-zinc-500">Since Jan 2026</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)] relative overflow-hidden">
             <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl"></div>
            <div className="flex items-center gap-3 text-emerald-400">
              <IndianRupee className="h-5 w-5" />
              <span className="font-semibold">Total Payouts</span>
            </div>
            <div className="mt-4 text-4xl font-black text-white flex items-center">
              ₹ {totalPayout}
            </div>
          </div>
        </div>

        {/* Ledger Section */}
        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Payout Ledger</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {payouts.length === 0 ? (
                <p className="text-sm italic text-zinc-500">No events triggered yet. You're having a smooth week!</p>
              ) : (
                payouts.map((payout, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition-all hover:bg-zinc-900"
                  >
                    <div>
                      <div className="font-medium text-white">{payout.title}</div>
                      <div className="text-xs text-zinc-500 mt-1">{payout.time}</div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1 text-emerald-400 text-lg font-bold border border-emerald-500/20">
                      + ₹{payout.amount}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Dev Overlays */}
      <DevPanel onTrigger={handleDevTrigger} />
      
      <PayoutModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        breachEvent={currentTrigger.event} 
        amount={currentTrigger.amount} 
      />
    </div>
  );
}
