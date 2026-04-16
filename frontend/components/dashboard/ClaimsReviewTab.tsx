"use client";

import { useAppContext } from "../../app/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck, ShieldX, User, MessageCircle, FileText, CheckCircle2, XCircle, Zap, Cpu } from "lucide-react";

export default function ClaimsReviewTab() {
  const { claims, updateClaimStatus } = useAppContext();
  const pendingClaims = claims.filter(c => c.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Claims Pending Adjudication</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Manual Verification Queue</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {pendingClaims.length} Active Requests
        </div>
      </div>

      <div className="space-y-4">
        {pendingClaims.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-[32px] bg-zinc-950/20">
            <CheckCircle2 className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Global Queue Clear</p>
          </div>
        ) : (
          <AnimatePresence>
            {pendingClaims.map((claim) => (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-zinc-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white">{claim.workerName}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">ID: {claim.id}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500 mb-3">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
                            <Clock className="h-3 w-3" />
                            {new Date(claim.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest border-l border-zinc-800 pl-3">
                            <FileText className="h-3 w-3" />
                            Evidence Attached
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                        <div className="hidden sm:block h-20 w-24 rounded-lg overflow-hidden border border-zinc-800 shrink-0 bg-zinc-900">
                           {claim.image ? <img src={claim.image} alt="Evidence" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-[8px] text-zinc-700">NO_IMG</div>}
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-2">
                               <MessageCircle className="h-3.5 w-3.5 text-zinc-700" />
                               <span className="text-[10px] font-bold text-zinc-600 uppercase">Statement</span>
                           </div>
                           <p className="text-xs text-zinc-400 italic leading-relaxed line-clamp-2">"{claim.description}"</p>
                           
                           {claim.aiScore && (
                               <div className="mt-3 flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-2.5 py-1.5 w-fit">
                                  <Cpu className="h-3 w-3 text-indigo-400" />
                                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-none">
                                      {claim.aiMessage || `Ensemble Trust: ${claim.aiScore}%`}
                                  </span>
                               </div>
                           )}
                        </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col lg:flex-row items-center gap-3 shrink-0">
                   <button 
                     onClick={() => updateClaimStatus(claim.id, 'rejected')}
                     className="flex-1 md:w-full lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/10 transition-all"
                   >
                     <ShieldX className="h-4 w-4" />
                     Deny
                   </button>
                   <button 
                     onClick={() => updateClaimStatus(claim.id, 'approved')}
                     className="flex-1 md:w-full lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all"
                   >
                     <ShieldCheck className="h-4 w-4" />
                     Approve
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* History Summary */}
      {claims.filter(c => c.status !== 'pending').length > 0 && (
         <div className="mt-12 pt-12 border-t border-zinc-800/50">
            <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-6">Recent Adjudications</h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {claims.filter(c => c.status !== 'pending').slice(0, 3).map(claim => (
                    <div key={claim.id} className="premium-card p-4 opacity-60">
                         <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black text-white">{claim.workerName}</span>
                            {claim.status === 'approved' ? 
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : 
                                <XCircle className="h-4 w-4 text-rose-500" />
                            }
                         </div>
                         <p className="text-[10px] text-zinc-500 line-clamp-1 italic">"{claim.description}"</p>
                    </div>
                ))}
            </div>
         </div>
      )}
    </div>
  );
}
