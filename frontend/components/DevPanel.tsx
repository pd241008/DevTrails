"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, CloudRain, ServerCrash, Zap, Settings, RotateCcw, ChevronUp, ChevronDown, Terminal } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAppContext } from "../app/context/AppContext";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7860";

export default function DevPanel({ onTrigger }: { onTrigger: (event: string, amount: number) => void }) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 premium-card p-6 bg-zinc-900/95 backdrop-blur-3xl w-80 border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Simulation Protocol
                </span>
              </div>
              <div className="flex h-2 w-2 items-center justify-center">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                disabled={isSimulating}
                onClick={() => onTrigger("Extreme Heat Threshold: 45°C", 500)}
                className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-[10px] font-bold text-zinc-400 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white uppercase tracking-wider"
              >
                <div className="flex items-center gap-3">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Heatwave Logic
                </div>
              </button>
              
              <button 
                 disabled={isSimulating}
                 onClick={() => onTrigger("Flood Warning: >15mm/hr", 750)}
                 className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-[10px] font-bold text-zinc-400 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-white uppercase tracking-wider"
              >
                <div className="flex items-center gap-3">
                  <CloudRain className="h-4 w-4 text-indigo-400" />
                  Flood Protocol
                </div>
              </button>
    
              <button 
                 disabled={isSimulating}
                 onClick={runBatchSimulation}
                 className={`group relative flex items-center justify-center gap-3 rounded-xl bg-indigo-500 px-4 py-4 text-xs font-black text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 uppercase tracking-widest ${isSimulating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Zap className={`h-4 w-4 ${isSimulating ? "animate-spin" : ""}`} />
                {isSimulating ? "Executing..." : "Execute Demo Sequence"}
              </button>
    
              <button 
                 onClick={resetSimulation}
                 className="mt-2 flex items-center justify-center gap-2 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] hover:text-zinc-400 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset System State
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
         onClick={() => setIsExpanded(!isExpanded)}
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-2xl transition-all ${
            isExpanded ? "bg-zinc-800 text-white border border-zinc-700" : "bg-indigo-500 text-white shadow-indigo-500/30"
         }`}
      >
        {isExpanded ? <ChevronDown className="h-6 w-6" /> : <Settings className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
