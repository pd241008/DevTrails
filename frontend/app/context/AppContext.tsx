"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface UserInfo {
  name: string;
  platform: string;
  zone: string;
  role: 'worker' | 'admin';
}

export interface TriggerEvent {
  title: string;
  amount: number;
  time: string;
  txId?: string;
}

export interface AppState {
  user: UserInfo | null;
  policyTier: string | null;
  payouts: TriggerEvent[];
  setUser: (u: UserInfo | null) => void;
  setPolicyTier: (tier: string | null) => void;
  addPayout: (event: TriggerEvent) => void;
  resetSimulation: () => void;
  logout: () => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserInfo | null>(null);
  const [policyTier, setPolicyTier] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<TriggerEvent[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("gigshield_user");
    const savedPolicy = localStorage.getItem("gigshield_policy");
    const savedPayouts = localStorage.getItem("gigshield_payouts");

    if (savedUser) setUserState(JSON.parse(savedUser));
    if (savedPolicy) setPolicyTier(savedPolicy);
    if (savedPayouts) setPayouts(JSON.parse(savedPayouts));
    
    setIsHydrated(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isHydrated) {
      if (user) {
        localStorage.setItem("gigshield_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("gigshield_user");
      }
      
      if (policyTier) {
        localStorage.setItem("gigshield_policy", policyTier);
      } else {
        localStorage.removeItem("gigshield_policy");
      }

      localStorage.setItem("gigshield_payouts", JSON.stringify(payouts));
    }
  }, [user, policyTier, payouts, isHydrated]);

  const setUser = (u: UserInfo | null) => setUserState(u);

  const addPayout = (event: TriggerEvent) => {
    setPayouts((prev) => [event, ...prev]);
  };

  const resetSimulation = () => {
    setPayouts([]);
    localStorage.setItem("gigshield_payouts", JSON.stringify([]));
  };

  const logout = () => {
    setUserState(null);
    setPolicyTier(null);
    setPayouts([]);
    localStorage.removeItem("gigshield_user");
    localStorage.removeItem("gigshield_policy");
    localStorage.removeItem("gigshield_payouts");
  };

  return (
    <AppContext.Provider value={{ 
      user, policyTier, payouts, 
      setUser, setPolicyTier, addPayout, 
      resetSimulation, logout,
      isHydrated 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
