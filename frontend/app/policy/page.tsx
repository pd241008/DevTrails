"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, Loader2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const TIERS = [
  {
    level: "Basic",
    price: "₹49/week",
    color: "from-zinc-600 to-zinc-400",
    features: ["Rain Coverage", "Heatwave up to 40°C", "Max payout ₹300/week"]
  },
  {
    level: "Standard",
    price: "₹99/week",
    color: "from-blue-600 to-cyan-500",
    recommended: true,
    features: ["Rain & Storm Coverage", "Heatwave up to 45°C", "Traffic Spikes", "Max payout ₹800/week"]
  },
  {
    level: "Pro",
    price: "₹149/week",
    color: "from-indigo-600 to-purple-500",
    features: ["All Standard Features", "Platform Downtime", "Server Errors", "Unlimited Payouts"]
  }
];

export default function PolicyManagement() {
  const router = useRouter();
  const { setPolicyTier } = useAppContext();
  const [selectedTier, setSelectedTier] = useState("Standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate Razorpay / Payment Gateway latency
    await new Promise((r) => setTimeout(r, 1500));
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Update State
    setPolicyTier(selectedTier);

    // Give time for success animation
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 p-6 pt-16">
      <div className="mb-12 text-center text-white">
        <h1 className="text-4xl font-extrabold tracking-tight">Protect Your Earnings</h1>
        <p className="mt-4 text-zinc-400">Select a parametric coverage tier. Payouts are zero-touch and instant.</p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-3">
        {TIERS.map((tier, idx) => (
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
            <div className="my-4 text-3xl font-extrabold text-white">{tier.price}</div>
            
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
        ))}
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
          *Mock Environment: No real money is charged.
        </p>
      </div>
    </div>
  );
}
