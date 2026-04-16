"use client";

import { useAppContext } from "../app/context/AppContext";
import { Shield, LayoutDashboard, FileText, BarChart3, LogOut, Bell, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import NotificationCenter from "./NotificationCenter";

export default function Navbar() {
  const { user, logout, notifications } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/register");
  };

  const navLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ...(user.role === 'worker' 
      ? [{ label: "My Policy", href: "/policy", icon: FileText }]
      : [
          { label: "Market Insights", href: "/dashboard?tab=forecast", icon: BarChart3 },
          { label: "Claims Review", href: "/dashboard?tab=claims", icon: Shield }
        ]
    )
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/50 px-8 py-3 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-black tracking-tight text-white uppercase">
              ShiftSafeguard <span className="text-zinc-500 font-medium">// Core</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href || (pathname === '/dashboard' && link.href.includes('tab') && false); // Simplified for now
              return (
                <Link 
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    active 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`p-2 rounded-xl border transition-all ${
                    dropdownOpen ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-transparent border-transparent text-zinc-500 hover:text-white"
                }`}
            >
                <Bell className={`h-5 w-5 transition-transform ${dropdownOpen ? "scale-110" : ""}`} />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[8px] font-black text-white ring-4 ring-zinc-950">
                        {notifications.length}
                    </span>
                )}
            </button>
            <NotificationCenter isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
          </div>

          <div className="flex items-center gap-4 pl-6 border-l border-zinc-800">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-bold text-white leading-none">{user.name}</span>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-left">ShiftSafeguard // Vault v2</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700 hover:text-white transition-all"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
