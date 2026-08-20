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
    const extractRoleName = (r: any): string => {
      if (!r) return "";
      if (typeof r === "string") return r.toUpperCase();
      if (typeof r === "object" && r.name) return String(r.name).toUpperCase();
      return String(r).toUpperCase();
    };

    const allowedRoles = (Array.isArray(role) ? role : [role]).map((r) => r.toUpperCase());

    const getRawRoles = () => {
      if (Array.isArray(user.roles) && user.roles.length > 0) return user.roles;
      if (user.role) return [user.role];
      return ["ADMIN", "MANAGER"];
    };

    const userRoles = getRawRoles().map(extractRoleName);
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
