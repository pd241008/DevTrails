"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, Loader2, Sparkles } from "lucide-react";
import { useAppContext } from "../context/AppContext";

// Base prices to be displayed as "Original"
const BASE_PRICES = {
  Basic: 29,
  Standard: 59,
  Pro: 99
};

const TIERS_CONFIG = [
  {
    level: "Basic",
    color: "from-zinc-600 to-zinc-400",
    features: ["Rain Coverage", "Heatwave up to 40°C", "Max payout ₹300/week"]
  },
  {
    level: "Standard",
    color: "from-blue-600 to-cyan-500",
    recommended: true,
    features: ["Rain & Storm Coverage", "Heatwave up to 45°C", "Traffic Spikes", "Max payout ₹800/week"]
  },
  {
    level: "Pro",
    color: "from-indigo-600 to-purple-500",
    features: ["All Standard Features", "Platform Downtime", "Server Errors", "Unlimited Payouts"]
  }
];

// Mock User Profile for AI Pricing Demo
const MOCK_WORKER_PROFILE = {
  zone_risk_score: 8,
  season: 2, // Monsoon
  worker_tenure_months: 6,
  clean_claim_history: 1
};

export default function PolicyManagement() {
  const router = useRouter();
  const { setPolicyTier } = useAppContext();
  const [selectedTier, setSelectedTier] = useState("Standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Dynamic Pricing State
  const [dynamicPrices, setDynamicPrices] = useState<any>(null);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);

  useEffect(() => {
    async function fetchPricing() {
      try {
        const response = await fetch("http://localhost:8000/api/calculate_premium", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(MOCK_WORKER_PROFILE)
        });
        const data = await response.json();
        setDynamicPrices(data);
      } catch (error) {
        console.error("Failed to fetch dynamic prices:", error);
      } finally {
        setIsLoadingPrices(false);
      }
    }
    fetchPricing();
  }, []);

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);
    setIsSuccess(true);
    setPolicyTier(selectedTier);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 p-6 pt-16">
      <div className="mb-12 text-center text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400"
        >
          <Sparkles className="h-4 w-4" />
          AI-Powered Parametric Pricing Active
        </motion.div>
        <h1 className="text-4xl font-extrabold tracking-tight">Protect Your Earnings</h1>
        <p className="mt-4 text-zinc-400">Select a parametric coverage tier. Payouts are zero-touch and instant.</p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-3">
        {TIERS_CONFIG.map((tier, idx) => {
          const basePrice = (BASE_PRICES as any)[tier.level];
          const dynamicPrice = dynamicPrices ? (dynamicPrices as any)[tier.level.toLowerCase()] : basePrice;
          const isAdjustment = dynamicPrice !== basePrice;

          return (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => setSelectedTier(tier.level)}
              className={`relative cursor-pointer rounded-3xl border-2 p-6 transition-all duration-300 ${
                selectedTier === tier.level 
                ? "border-indigo-500 bg-zinc-900 shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]" 
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  Recommended
                </div>
              )}
              
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${tier.color} p-3 shadow-lg`}>
                <Shield className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white">{tier.level}</h3>
              
              <div className="my-4">
                {isLoadingPrices ? (
                  <div className="h-10 w-24 animate-pulse rounded bg-zinc-800" />
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">₹{dynamicPrice}</span>
                      {isAdjustment && (
                        <span className="text-lg text-zinc-500 line-through">₹{basePrice}</span>
                      )}
                      <span className="text-sm font-medium text-zinc-400">/week</span>
                    </div>
                    {isAdjustment && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                          dynamicPrice > basePrice ? "text-orange-400" : "text-emerald-400"
                        }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${dynamicPrice > basePrice ? "bg-orange-400" : "bg-emerald-400"} animate-pulse`} />
                        {dynamicPrices?.message}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
              
              <ul className="mb-8 space-y-3">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-center text-zinc-300">
                    <CheckCircle2 className="mr-3 h-5 w-5 text-indigo-400" />
                    <span className="text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-6 left-6 right-6">
                <div className={`h-2 w-full rounded-full bg-gradient-to-r ${tier.color} opacity-20`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePay}
          disabled={isProcessing || isSuccess}
          className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl py-4 font-bold text-white transition-all ${
            isSuccess ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >
          {isProcessing ? (
             <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin"/> Processing secure payment...</span>
          ) : isSuccess ? (
            <span className="flex items-center gap-2 animate-pulse"><CheckCircle2 className="h-5 w-5"/> Payment Successful</span>
          ) : (
            <span>Subscribe to {selectedTier}</span>
          )}
        </motion.button>
        <p className="mt-4 text-center text-xs text-zinc-600">
          *Dynamic pricing calculated based on your historical risk profile and current seasonal factors.
        </p>
      </div>
    </div>
  );
}
