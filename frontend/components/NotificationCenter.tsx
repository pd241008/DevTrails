"use client";

import { useAppContext } from "../app/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Shield, Info, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";

export default function NotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, clearNotification } = useAppContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0, y: 10, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 10, scale: 0.95 }}
           className="absolute right-0 mt-4 w-96 overflow-hidden rounded-[24px] border border-zinc-800 bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl z-[200]"
        >
          <div className="border-b border-zinc-800 p-6 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Activity Stream</h3>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {notifications.length} Unread
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-zinc-950 flex items-center justify-center mb-4 border border-zinc-800">
                        <Bell className="h-5 w-5 text-zinc-700" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">All protocols nominal</p>
                </div>
            ) : (
                <div className="p-2 space-y-1">
                    {notifications.map((notif) => (
                        <motion.div
                            key={notif.id}
                            layout
                            className="group relative flex gap-4 rounded-2xl p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        >
                            <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-zinc-800/50 border border-zinc-800 group-hover:border-zinc-700 transition-colors ${
                                notif.type === 'premium' ? "text-indigo-400" : 
                                notif.type === 'claim' ? "text-emerald-400" : "text-zinc-500"
                            }`}>
                                {notif.type === 'premium' && <TrendingUp className="h-5 w-5" />}
                                {notif.type === 'claim' && <Shield className="h-5 w-5" />}
                                {notif.type === 'system' && <Info className="h-5 w-5" />}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        {notif.type} protocol
                                    </h4>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); clearNotification(notif.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-white transition-all"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                                <h3 className="mt-0.5 text-xs font-bold text-white leading-tight">
                                    {notif.title}
                                </h3>
                                <p className="mt-1 text-[11px] font-medium leading-relaxed text-zinc-400 line-clamp-2 italic">
                                    {notif.message}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
          </div>

          {notifications.length > 0 && (
              <div className="p-4 bg-zinc-950/30 border-t border-zinc-800 flex justify-center">
                  <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
                      Mark all as acknowledged
                  </button>
              </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
