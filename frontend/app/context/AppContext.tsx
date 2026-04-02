"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface UserInfo {
  name: string;
  platform: string;
  zone: string;
}

export interface TriggerEvent {
  title: string;
  amount: number;
  time: string;
}

export interface AppState {
  user: UserInfo | null;
  policyTier: string | null;
  payouts: TriggerEvent[];
  setUser: (u: UserInfo) => void;
  setPolicyTier: (tier: string) => void;
  addPayout: (event: TriggerEvent) => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [policyTier, setPolicyTier] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<TriggerEvent[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("gigshield_user");
    const savedPolicy = localStorage.getItem("gigshield_policy");
    const savedPayouts = localStorage.getItem("gigshield_payouts");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedPolicy) setPolicyTier(savedPolicy);
    if (savedPayouts) setPayouts(JSON.parse(savedPayouts));
    
    setIsHydrated(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      if (user) localStorage.setItem("gigshield_user", JSON.stringify(user));
      if (policyTier) localStorage.setItem("gigshield_policy", policyTier);
      localStorage.setItem("gigshield_payouts", JSON.stringify(payouts));
    }
  }, [user, policyTier, payouts, isHydrated]);

  const addPayout = (event: TriggerEvent) => {
    setPayouts((prev) => [event, ...prev]);
  };

  return (
    <AppContext.Provider value={{ user, policyTier, payouts, setUser, setPolicyTier, addPayout, isHydrated }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
