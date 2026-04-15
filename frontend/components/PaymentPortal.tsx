"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Lock, Loader2, CheckCircle2, ChevronRight, Wand2 } from "lucide-react";

interface PaymentPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tierName: string;
  amount: number;
}

export default function PaymentPortal({ isOpen, onClose, onSuccess, tierName, amount }: PaymentPortalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "securing" | "success">("idle");

  const fillTestCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setExpiry("12/26");
    setCvc("452");
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("verifying");
    
    // Step 1: Banking verification
    await new Promise(r => setTimeout(r, 1800));
    setStatus("securing");
    
    // Step 2: Parametric protocol securing
    await new Promise(r => setTimeout(r, 1600));
    setStatus("success");
    
    // Finalize
    await new Promise(r => setTimeout(r, 1200));
    onSuccess();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            {status === "idle" ? (
              <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Secure Checkout</h3>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-left">GigShield // Vault v2</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                    <span className="text-xl">×</span>
                  </button>
                </div>

                <div className="mb-6 rounded-2xl bg-zinc-950 p-4 border border-zinc-800/50">
                   <div className="flex justify-between items-center text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                      <span>Plan Selection</span>
                      <span>Total Due</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-white font-black">{tierName} Protection</span>
                      <span className="text-2xl font-black text-white">₹{amount}</span>
                   </div>
                </div>

                <form onSubmit={handlePay} className="space-y-4 text-left">
                  <div>
                    <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Card Number</label>
                    <div className="relative">
                       <CreditCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                       <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-700 transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/5"
                        required
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Expiry</label>
                      <input 
                        type="text" 
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 px-4 text-sm text-white placeholder-zinc-700 focus:border-indigo-500/50 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">CVC</label>
                      <input 
                        type="text" 
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3.5 px-4 text-sm text-white placeholder-zinc-700 focus:border-indigo-500/50 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 py-4 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:bg-indigo-400 hover:shadow-indigo-500/40"
                    >
                      Process Payment
                      <ChevronRight className="h-4 w-4 text-white/50" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={fillTestCard}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-700 hover:text-white"
                    >
                      <Wand2 className="h-3 w-3" />
                      Use Test Card (4242)
                    </button>
                  </div>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2">
                   <Lock className="h-3 w-3 text-zinc-600" />
                   <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600">256-bit AES Encryption Active</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                 <AnimatePresence mode="wait">
                    {status === "verifying" && (
                        <motion.div 
                            key="verifying"
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <Loader2 className="mb-6 h-12 w-12 animate-spin text-indigo-500" />
                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Verifying with Bank...</h3>
                            <p className="text-sm text-zinc-500 font-medium">Communicating with secure payment network.</p>
                        </motion.div>
                    )}
                    {status === "securing" && (
                        <motion.div 
                            key="securing"
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-6 h-12 w-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Securing Protocol...</h3>
                            <p className="text-sm text-zinc-500 font-medium">Finalizing parametric contract conditions.</p>
                        </motion.div>
                    )}
                    {status === "success" && (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase italic">Payment Confirmed</h3>
                            <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">Protocol Active</p>
                        </motion.div>
                    )}
                 </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
