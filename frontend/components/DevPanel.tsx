"use client";

import { motion } from "framer-motion";
import { Flame, CloudRain, ServerCrash, Zap, Settings, RotateCcw } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAppContext } from "../app/context/AppContext";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7860";

export default function DevPanel({ onTrigger }: { onTrigger: (event: string, amount: number) => void }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const { resetSimulation } = useAppContext();

  const runBatchSimulation = async () => {
    setIsSimulating(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/simulate_trigger`, {
        event_type: "weather_rain",
        current_value: 25.5,
        demo_mode: true
      });
      onTrigger("SEVERE RAINSTORM [BATCH_ACTIVE]", 500);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card p-6 bg-zinc-900/90 backdrop-blur-3xl w-72 border-zinc-800 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Simulation Console
            </span>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            disabled={isSimulating}
            onClick={() => onTrigger("Extreme Heat Threshold: 45°C", 500)}
            className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-[10px] font-bold text-zinc-400 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white uppercase tracking-wider"
          >
            <div className="flex items-center gap-3">
              <Flame className="h-4 w-4 text-orange-500" />
              Heatwave
            </div>
          </button>
          
          <button 
             disabled={isSimulating}
             onClick={() => onTrigger("Flood Warning: >15mm/hr", 750)}
             className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-[10px] font-bold text-zinc-400 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white uppercase tracking-wider"
          >
            <div className="flex items-center gap-3">
              <CloudRain className="h-4 w-4 text-indigo-400" />
              Flash Flood
            </div>
          </button>

          <button 
             disabled={isSimulating}
             onClick={runBatchSimulation}
             className={`group relative flex items-center justify-center gap-3 rounded-xl bg-indigo-500 px-4 py-4 text-xs font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 uppercase tracking-widest ${isSimulating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Zap className={`h-4 w-4 ${isSimulating ? "animate-spin" : ""}`} />
            {isSimulating ? "Processing..." : "Run Demo Sequence"}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white/20"></span>
            </span>
          </button>

          <button 
             onClick={resetSimulation}
             className="mt-2 flex items-center justify-center gap-2 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear Simulation State
          </button>
        </div>
      </motion.div>
    </div>
  );
}
