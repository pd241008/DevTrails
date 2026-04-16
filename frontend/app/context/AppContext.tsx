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

export interface ClaimRequest {
  id: string;
  workerId: string;
  workerName: string;
  description: string;
  image?: string;
  aiScore?: number;
  aiMessage?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  amount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'premium' | 'claim' | 'system';
  timestamp: string;
}

export interface AppState {
  user: UserInfo | null;
  policyTier: string | null;
  payouts: TriggerEvent[];
  claims: ClaimRequest[];
  notifications: AppNotification[];
  setUser: (u: UserInfo | null) => void;
  setPolicyTier: (tier: string | null) => void;
  addPayout: (event: TriggerEvent) => void;
  submitClaim: (claim: Omit<ClaimRequest, 'id' | 'status' | 'timestamp'>) => void;
  updateClaimStatus: (claimId: string, status: 'approved' | 'rejected') => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp'>) => void;
  clearNotification: (id: string) => void;
  resetSimulation: () => void;
  logout: () => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserInfo | null>(null);
  const [policyTier, setPolicyTier] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<TriggerEvent[]>([]);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("gigshield_user");
    const savedPolicy = localStorage.getItem("gigshield_policy");
    const savedPayouts = localStorage.getItem("gigshield_payouts");
    const savedClaims = localStorage.getItem("gigshield_claims");
    const savedNotifs = localStorage.getItem("gigshield_notifications");

    if (savedUser) setUserState(JSON.parse(savedUser));
    if (savedPolicy) setPolicyTier(savedPolicy);
    if (savedPayouts) setPayouts(JSON.parse(savedPayouts));
    if (savedClaims) setClaims(JSON.parse(savedClaims));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    
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
      localStorage.setItem("gigshield_claims", JSON.stringify(claims));
      localStorage.setItem("gigshield_notifications", JSON.stringify(notifications));
    }
  }, [user, policyTier, payouts, claims, notifications, isHydrated]);

  const setUser = (u: UserInfo | null) => setUserState(u);

  const addPayout = (event: TriggerEvent) => {
    setPayouts((prev) => [event, ...prev]);
  };

  const submitClaim = (claim: Omit<ClaimRequest, 'id' | 'status' | 'timestamp'>) => {
    // AUTO-PROCEED: If aiScore > 90, auto-approve
    const isAutoApproved = (claim.aiScore || 0) > 90;
    const status = isAutoApproved ? 'approved' : 'pending';
    
    const newClaim: ClaimRequest = {
      ...claim,
      id: `clm_${Math.random().toString(36).substr(2, 9)}`,
      status,
      timestamp: new Date().toISOString()
    };
    
    setClaims((prev) => [newClaim, ...prev]);

    if (isAutoApproved) {
      addPayout({
        title: `AUTO_VERIFIED: ${claim.description.substring(0, 20)}...`,
        amount: claim.amount,
        time: "Processed Instantly",
        txId: `tx_auto_${newClaim.id.split('_')[1]}`
      });
    }
  };

  const updateClaimStatus = (claimId: string, status: 'approved' | 'rejected') => {
    setClaims((prev) => prev.map(c => 
      c.id === claimId ? { ...c, status } : c
    ));

    const claim = claims.find(c => c.id === claimId);
    if (claim && status === 'approved') {
      addPayout({
        title: `MANUAL_VERIFIED: ${claim.description.substring(0, 20)}...`,
        amount: claim.amount,
        time: "Approved Just Now",
        txId: `tx_man_${claimId.split('_')[1]}`
      });
      
      addNotification({
        title: "Claim Approved",
        message: `Your manual claim #${claimId.split('_')[1]} has been approved and paid out.`,
        type: 'claim'
      });
    } else if (claim && status === 'rejected') {
        addNotification({
            title: "Claim Rejected",
            message: `Manual claim #${claimId.split('_')[1]} was rejected by the underwriter.`,
            type: 'claim'
        });
    }
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `ntf_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  const resetSimulation = () => {
    setPayouts([]);
    setClaims([]);
    setNotifications([]);
    localStorage.removeItem("gigshield_payouts");
    localStorage.removeItem("gigshield_claims");
    localStorage.removeItem("gigshield_notifications");
  };

  const logout = () => {
    setUserState(null);
    setPolicyTier(null);
    setPayouts([]);
    setClaims([]);
    setNotifications([]);
    localStorage.removeItem("gigshield_user");
    localStorage.removeItem("gigshield_policy");
    localStorage.removeItem("gigshield_payouts");
    localStorage.removeItem("gigshield_claims");
    localStorage.removeItem("gigshield_notifications");
  };

  return (
    <AppContext.Provider value={{ 
      user, policyTier, payouts, claims, notifications,
      setUser, setPolicyTier, addPayout, submitClaim, updateClaimStatus,
      addNotification, clearNotification,
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
