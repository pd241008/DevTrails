"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, Sparkles, IndianRupee } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import PaymentPortal from "../../components/PaymentPortal";

const BASE_PRICES = { Basic: 290, Standard: 590, Pro: 990 };

const TIERS_CONFIG = [
  {
    level: "Basic",
    color: "from-zinc-600 to-zinc-400",
    features: ["Rain Coverage", "Heatwave protection", "Max payout ₹3,000/week"]
  },
  {
    level: "Standard",
    color: "from-indigo-600 to-indigo-400",
    recommended: true,
    features: ["Storm Coverage", "Heatwave up to 45°C", "Traffic Spikes", "Max payout ₹8,000/week"]
  },
  {
    level: "Pro",
    color: "from-emerald-600 to-emerald-400",
    features: ["All Standard Features", "Platform Downtime", "Server Errors", "Unlimited Payouts"]
  }
];

export default function PolicyManagement() {
  const router = useRouter();
  const { setPolicyTier, policyTier: currentTier } = useAppContext();
  const [selectedTier, setSelectedTier] = useState(currentTier || "Standard");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handlePaymentSuccess = () => {
    setIsCheckoutOpen(false);
    setPolicyTier(selectedTier);
    router.push("/dashboard");
  };

  const isCurrentPlan = selectedTier === currentTier;

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-20 font-sans glass-surface selection:bg-indigo-500 selection:text-white">
      <div className="mx-auto max-w-5xl text-left">
        <div className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400"
          >
            <Sparkles className="h-3 w-3" />
            AI-Powered Risk Assessment Active
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            {currentTier ? "Manage Your Coverage" : "Select Your Protection Tier"}
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto font-medium">
            Dynamic parametric coverage designed for the modern gig economy. Choose your safety net.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {TIERS_CONFIG.map((tier, idx) => {
             const active = selectedTier === tier.level;
             const owned = currentTier === tier.level;

             return (
                <motion.div
                  key={tier.level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedTier(tier.level)}
                  className={`premium-card p-8 cursor-pointer relative overflow-hidden transition-all duration-300 ${
                    active ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5 shadow-2xl shadow-indigo-500/10" : ""
                  }`}
                >
                  {owned && (
                    <div className="absolute top-0 left-0 p-3">
                      <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-br-xl rounded-tl-xl">Current Plan</span>
                    </div>
                  )}
                  {tier.recommended && !owned && (
                    <div className="absolute top-0 right-0 p-3">
                      <span className="bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-bl-xl rounded-tr-xl">Best Value</span>
                    </div>
                  )}
                  
                  <div className={`mb-6 h-12 w-12 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-lg pt-1`}>
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{tier.level}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                     <span className="text-3xl font-black text-white">₹{(BASE_PRICES as any)[tier.level]}</span>
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">/week</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-zinc-400 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${tier.color} opacity-20`} />
                </motion.div>
             );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center">
            <button
              onClick={() => setIsCheckoutOpen(true)}
              disabled={isCurrentPlan}
              className={`premium-button-primary w-full max-w-md h-16 text-lg flex items-center justify-center gap-3 group ${
                isCurrentPlan ? "opacity-50 cursor-not-allowed filter-none shadow-none" : ""
              }`}
            >
              {isCurrentPlan ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <IndianRupee className="h-5 w-5" />
              )}
              {isCurrentPlan ? "Active Policy" : currentTier ? `Upgrade to ${selectedTier}` : `Subscribe to ${selectedTier}`}
            </button>
            <p className="mt-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
               {isCurrentPlan ? "*You are already covered by this tier." : "*Checkout process managed via secure vault protocol."}
            </p>
        </div>
      </div>

      <PaymentPortal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handlePaymentSuccess}
        tierName={selectedTier}
        amount={(BASE_PRICES as any)[selectedTier]}
      />
    </div>
  );
}
