"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, IndianRupee, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "../app/context/AppContext";

export default function PayoutModal({ 
  isOpen, 
  onClose, 
  breachEvent,
  amount
}: { 
  isOpen: boolean; 
  onClose: () => void;
  breachEvent: string;
  amount: number;
}) {
  const [step, setStep] = useState<"scanning" | "processing" | "success" | "idle">("idle");
  const { addPayout } = useAppContext();

  useEffect(() => {
    if (isOpen) {
      setStep("scanning");
      
      // Step 1: Scanning breach
      const t1 = setTimeout(() => {
        setStep("processing");
      }, 2000);

      // Step 2: Processing Payment
      const t2 = setTimeout(() => {
        setStep("success");
        addPayout({
          title: breachEvent,
          amount: amount,
          time: new Date().toLocaleTimeString()
        });
      }, 4000);

      // Step 3: Auto Close
      const t3 = setTimeout(() => {
        onClose();
        setStep("idle");
      }, 7000);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, breachEvent, amount]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl relative"
          >
            {/* Animated Glow Border */}
            <div className={`absolute inset-0 bg-gradient-to-r ${step === 'success' ? 'from-emerald-500/30 to-green-500/30' : 'from-indigo-500/30 to-purple-500/30'} blur-xl transition-colors duration-1000`} />

            <div className="relative rounded-2xl bg-zinc-900 p-8 text-center text-white z-10">
              
              {step === "scanning" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-500 animate-pulse">
                    <AlertTriangle className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Environmental Breach Detected</h3>
                  <p className="mt-2 text-zinc-400">{breachEvent}</p>
                  <div className="mt-6 flex w-full flex-col gap-2">
                    <div className="h-1 w-full bg-zinc-800 overflow-hidden rounded-full">
                      <motion.div className="h-full bg-red-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2 }} />
                    </div>
                    <span className="text-xs text-red-400 uppercase tracking-wider">Validating conditions...</span>
                  </div>
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-500">
                    <Loader2 className="h-10 w-10 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Zero-Touch Processing</h3>
                  <p className="mt-2 text-zinc-400">Policy criteria met. Initiating instant transfer.</p>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  <motion.div 
                    initial={{ rotate: -90, scale: 0 }} 
                    animate={{ rotate: 0, scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-500/50"
                  >
                    <CheckCircle className="h-12 w-12" />
                  </motion.div>
                  <h3 className="text-2xl font-bold tracking-tight text-emerald-400">Payout Hit Your Account!</h3>
                  <div className="mt-4 flex items-center justify-center gap-1 rounded-2xl bg-zinc-950 px-6 py-3 border border-emerald-500/30">
                    <IndianRupee className="h-6 w-6 text-white" />
                    <span className="text-3xl font-black text-white">{amount}</span>
                  </div>
                  <p className="mt-4 text-sm text-zinc-400">Directly deposited via UPI.</p>
                </motion.div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
