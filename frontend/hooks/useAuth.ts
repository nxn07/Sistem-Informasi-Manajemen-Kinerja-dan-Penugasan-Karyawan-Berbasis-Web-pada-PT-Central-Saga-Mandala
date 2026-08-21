"use client";

import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth-service";
import { User } from "@/types/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getMe();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const hasRole = (roleName: string) => {
    return (
      user?.roles?.includes(roleName) ||
      user?.role === roleName ||
      (!user?.roles && !user?.role) ||
      false
    );
  };

  const hasPermission = (permissionName: string) => {
    return user?.permissions?.includes(permissionName) || false;
  };

  const isManagerOrAdmin = () => {
    return hasRole("ADMIN") || hasRole("MANAGER");
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
    isManagerOrAdmin,
    refreshUser: fetchUser,
  };
}
