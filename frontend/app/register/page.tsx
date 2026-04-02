"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, User, ShoppingBag, ShieldCheck } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Register() {
  const router = useRouter();
  const { setUser } = useAppContext();
  
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("Amazon Flex");
  const [zone, setZone] = useState("Pune");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUser({ name, platform, zone });
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-500 shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Join GigShield</h1>
          <p className="mt-2 text-sm text-zinc-400">Secure your gig earnings against unpredictable disruptions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Platform Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Partner Platform</label>
              <div className="relative">
                <ShoppingBag className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Amazon Flex">Amazon Flex</option>
                  <option value="Flipkart">Flipkart Delivery</option>
                  <option value="Zomato">Zomato</option>
                  <option value="Swiggy">Swiggy</option>
                </select>
              </div>
            </div>

            {/* Zone Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Main Operating Zone</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                <select 
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Pune">Pune</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
          >
            Continue to Coverage
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
