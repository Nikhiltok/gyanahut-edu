import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getProfile } from "../api/auth";
import { setOnSessionExpired } from "../api/client";
import { getAccessToken } from "../api/token-storage";
import type { Profile } from "../types/auth";

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await getProfile();
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    setOnSessionExpired(() => setProfile(null));
  }, [loadProfile]);

  const signOut = useCallback(() => setProfile(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: !!profile,
      profile,
      refreshProfile: loadProfile,
      signOut,
    }),
    [isLoading, profile, loadProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
