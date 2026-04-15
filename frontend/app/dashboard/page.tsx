"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, LayoutDashboard, LogOut, RotateCcw, User as UserIcon, Briefcase, ShieldAlert } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import DevPanel from "../../components/DevPanel";
import PayoutModal from "../../components/PayoutModal";
import WorkerDashboard from "../../components/dashboard/WorkerDashboard";
import InsurerDashboard from "../../components/dashboard/InsurerDashboard";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const { user, payouts, isHydrated, logout, resetSimulation } = useAppContext();
  
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

  const handleLogout = () => {
    logout();
    router.push("/register");
  };

  if (!user || !isHydrated) return null;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans glass-surface selection:bg-indigo-500 selection:text-white">
      {/* Professional Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/50 px-8 py-5 sticky top-0 z-40 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
               <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white uppercase">
                GigShield <span className="text-zinc-500 font-medium">// Core</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1"></span>
                Authorized Session: {user.role === 'admin' ? "Insurer_Root" : "Worker_Node"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-zinc-400" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-none">{user.name}</span>
                    <span className="text-[10px] font-medium text-zinc-500 mt-1 uppercase tracking-tighter">{user.platform || "Platform Admin"}</span>
                </div>
             </div>

             <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                title="Logout"
             >
                <LogOut className="h-5 w-5" />
             </button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-12 max-w-7xl px-8 pb-32">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">
                    <LayoutDashboard className="h-3 w-3" />
                    Management Console
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                    {user.role === 'admin' ? "Risk & Loss Evaluation" : "Earnings Protection Dashboard"}
                </h2>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={resetSimulation}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                >
                    <RotateCcw className="h-4 w-4" />
                    Reset Simulation
                </button>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider text-indigo-400">
                    {user.role === 'admin' ? <ShieldAlert className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                    SECURE_{(user.role || 'WORKER').toUpperCase()}
                </div>
            </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={user.role}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {user.role === 'admin' ? (
              <InsurerDashboard />
            ) : (
              <WorkerDashboard user={user} payouts={payouts} />
            )}
          </motion.div>
        </AnimatePresence>
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
