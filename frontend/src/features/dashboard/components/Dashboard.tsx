import { useClerk, UserButton } from "@clerk/clerk-react";
import { useRole } from "@/hooks/useRole";
import { LogOut, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerDashboard } from "./CustomerDashboard";
import { ReviewerDashboard } from "./ReviewerDashboard";
import { ApproverDashboard } from "./ApproverDashboard";

export function Dashboard() {
  const { role, isLoaded } = useRole();
  const { signOut } = useClerk();

  // Show nothing while checking role
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/60 backdrop-blur-md">
        <div className="flex h-16 max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-primary">
            <Map className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">TradeLink Ethiopia</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-slate-600 hover:text-slate-900">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content Router */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!role ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h2 className="text-2xl font-semibold text-slate-700">Pending Role Assignment</h2>
            <p className="text-muted-foreground mt-2">Your account does not have an assigned system role yet. Please contact an administrator.</p>
          </div>
        ) : role === "APPROVER" ? (
          <ApproverDashboard />
        ) : role === "REVIEWER" ? (
          <ReviewerDashboard />
        ) : (
          <CustomerDashboard />
        )}
      </main>
    </div>
  );
}
