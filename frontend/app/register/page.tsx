"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, User, ShoppingBag, ShieldCheck, Briefcase, ShieldAlert } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Register() {
  const router = useRouter();
  const { setUser } = useAppContext();
  
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("Amazon Flex");
  const [zone, setZone] = useState("Pune");
  const [role, setRole] = useState<'worker' | 'admin'>('worker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUser({ name, platform, zone, role });
    if (role === 'worker') {
      router.push("/policy");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 selection:bg-indigo-500 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg rounded-[32px] border border-zinc-800 bg-zinc-900/40 p-10 shadow-2xl backdrop-blur-2xl"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-emerald-500 shadow-2xl shadow-indigo-500/40">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Project ShiftSafeguard</h1>
          <p className="mt-3 text-base text-zinc-400">Initialize your secure protection protocol.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
             <button 
                type="button"
                onClick={() => setRole('worker')}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                    role === 'worker' 
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" 
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700"
                }`}
             >
                <Briefcase className="h-6 w-6" />
                <span className="text-sm font-bold uppercase tracking-wider">Worker</span>
             </button>
             <button 
                type="button"
                onClick={() => setRole('admin')}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                    role === 'admin' 
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" 
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700"
                }`}
             >
                <ShieldAlert className="h-6 w-6" />
                <span className="text-sm font-bold uppercase tracking-wider">Insurer</span>
             </button>
          </div>

          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Pierce"
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 py-4 pl-12 pr-4 text-white placeholder-zinc-600 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  required
                />
              </div>
            </div>

            {role === 'worker' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-widest text-zinc-500">Platform</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                    <select 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-zinc-800 bg-zinc-950/50 py-4 pl-12 pr-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="Amazon Flex">Amazon Flex</option>
                      <option value="Flipkart">Flipkart Delivery</option>
                      <option value="Zomato">Zomato</option>
                      <option value="Swiggy">Swiggy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-widest text-zinc-500">Zone</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                    <select 
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      className="w-full appearance-none rounded-2xl border border-zinc-800 bg-zinc-950/50 py-4 pl-12 pr-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="Pune">Pune</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Mumbai">Mumbai</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 text-lg font-extrabold text-white shadow-2xl shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40"
          >
            Access Dashboard
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
