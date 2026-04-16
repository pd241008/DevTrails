"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import WorkerDashboard from "../../components/dashboard/WorkerDashboard";
import InsurerDashboard from "../../components/dashboard/InsurerDashboard";
import DevPanel from "../../components/DevPanel";
import { Loader2 } from "lucide-react";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, payouts, claims, isHydrated, addNotification, addPayout } = useAppContext();
  
  // Tab Management for Insurer (Forecast vs Claims)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/register");
    }
  }, [isHydrated, user, router]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleManualTrigger = (event: string, amount: number) => {
    addNotification({
      title: "Atmospheric Surge Detected",
      message: `${event}. Risk models adjusted +15.5%.`,
      type: 'premium'
    });

    addPayout({
      title: `SURGE_TRIGGERED: ${event}`,
      amount: amount,
      time: new Date().toLocaleTimeString(),
      txId: `tx_surge_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    });
  };

  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-8 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                Control <span className="text-indigo-500 text-3xl not-italic tracking-normal lowercase ml-1">v4.0</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-zinc-500 uppercase tracking-widest">
              {user.role === 'admin' ? "Insurer Management Interface" : `Network Node: ${user.platform} Hub`}
            </p>
          </motion.div>


        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={user.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {user.role === 'admin' ? (
              <InsurerDashboard activeTab={activeTab} />
            ) : (
              <WorkerDashboard user={user} payouts={payouts} claims={claims} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DevPanel onTrigger={handleManualTrigger} />
    </main>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
