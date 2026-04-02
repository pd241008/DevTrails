"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, Zap, TrendingUp, ChevronRight } from "lucide-react";
import { useAppContext } from "./context/AppContext";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAppContext();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-500 p-2 shadow-lg shadow-indigo-500/30">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">GigShield</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 flex flex-col items-center max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm font-medium text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Zero-Touch Parametric Insurance
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Protect your gig earnings from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">unexpected.</span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-lg text-zinc-400 md:text-xl">
            AI-driven coverage that automatically pays you out when severe weather, traffic spikes, or platform crashes disrupt your shifts.
          </p>

          <div className="mt-10 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(user ? "/dashboard" : "/register")}
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-zinc-200 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              {user ? "Go to Dashboard" : "Get Covered Instantly"}
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="mt-24 grid gap-8 md:grid-cols-3 max-w-5xl w-full z-10 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-sm">
            <div className="mb-4 inline-flex rounded-xl bg-orange-500/20 p-3">
              <Zap className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Zero-Touch Payouts</h3>
            <p className="text-zinc-400 leading-relaxed">No clunky claim forms. Connected oracles monitor the environment & transfer funds instantly when thresholds are met.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-sm">
            <div className="mb-4 inline-flex rounded-xl bg-indigo-500/20 p-3">
              <Shield className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Platform Agnostic</h3>
            <p className="text-zinc-400 leading-relaxed">Whether you're slinging packages for Amazon Flex or delivering food, GigShield bridges the gap in your safety net.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-sm">
            <div className="mb-4 inline-flex rounded-xl bg-emerald-500/20 p-3">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dynamic Premiums</h3>
            <p className="text-zinc-400 leading-relaxed">Our risk models assess zones and incidents fairly, offering discounts to safe riders and dynamically adjusting tier pricing.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
