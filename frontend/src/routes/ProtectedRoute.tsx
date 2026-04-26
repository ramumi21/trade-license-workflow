import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRole, type Role } from "@/hooks/useRole";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn, role } = useRole();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-200"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Explicitly allow auth routes to bypass protection, 
  // ensuring users in the middle of sign-up/verification aren't redirected.
  if (
    location.pathname.startsWith("/sign-up") || 
    location.pathname.startsWith("/sign-in")
  ) {
    return <>{children}</>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
