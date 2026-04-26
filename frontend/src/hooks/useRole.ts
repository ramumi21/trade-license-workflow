import { useUser } from "@clerk/clerk-react";

export type Role = "CUSTOMER" | "REVIEWER" | "APPROVER";

export function useRole() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return { role: null, isLoaded, isSignedIn };
  }

  // Extract role from publicMetadata, default to CUSTOMER
  const role = (user.publicMetadata?.role as Role) || "CUSTOMER";

  return {
    role,
    isLoaded,
    isSignedIn,
    isCustomer: role === "CUSTOMER",
    isReviewer: role === "REVIEWER",
    isApprover: role === "APPROVER",
  };
}
