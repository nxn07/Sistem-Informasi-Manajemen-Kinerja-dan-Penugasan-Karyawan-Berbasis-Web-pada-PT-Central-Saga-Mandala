"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface CanProps {
  role?: string | string[];
  permission?: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ role, permission, children, fallback = null }: CanProps) {
  const { user, loading } = useAuth();

  if (loading || !user) return <>{fallback}</>;

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    const userRoles = user.roles || (user.role ? [user.role] : ["ADMIN", "MANAGER"]);
    const hasAllowedRole = userRoles.some((r) => allowedRoles.includes(r));
    if (!hasAllowedRole) return <>{fallback}</>;
  }

  if (permission) {
    const allowedPermissions = Array.isArray(permission) ? permission : [permission];
    const hasAllowedPermission = user.permissions?.some((p) => allowedPermissions.includes(p));
    if (!hasAllowedPermission) return <>{fallback}</>;
  }

  return <>{children}</>;
}
