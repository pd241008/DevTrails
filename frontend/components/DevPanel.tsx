"use client";

import { motion } from "framer-motion";
import { Flame, CloudRain, ServerCrash } from "lucide-react";

export default function DevPanel({ onTrigger }: { onTrigger: (event: string, amount: number) => void }) {
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Dev Panel: API Simulators</span>
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => onTrigger("Extreme Heat Threshold: 45°C", 500)}
            className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-white"
          >
            <Flame className="h-4 w-4 text-orange-500 group-hover:animate-bounce" />
            Trigger Heatwave
          </button>
          
          <button 
            onClick={() => onTrigger("Heavy Rain Warning: >15mm/hr", 750)}
            className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white"
          >
            <CloudRain className="h-4 w-4 text-blue-500 group-hover:animate-bounce" />
            Trigger Flash Flood
          </button>
          
          <button 
            onClick={() => onTrigger("Platform Outage: Server Down", 300)}
            className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white"
          >
            <ServerCrash className="h-4 w-4 text-purple-500 group-hover:animate-bounce" />
            Trigger Server Outage
          </button>
        </div>
      </motion.div>
    </div>
  );
}
