"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "./context/AppContext";

export default function RootPage() {
  const router = useRouter();
  const { user, isHydrated, policyTier } = useAppContext();

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        router.push("/register");
      } else if (user.role === 'worker' && !policyTier) {
        router.push("/policy");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, isHydrated, router, policyTier]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-zinc-500 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Initializing Secure Protocol...</p>
      </div>
    </div>
  );
}
