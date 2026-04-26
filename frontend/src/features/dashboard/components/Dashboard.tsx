import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { useRole } from "@/hooks/useRole";
import { ShieldCheck, FilePlus, SearchCheck, Lock, LogOut, Map } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const { user } = useUser();
  const { role, isReviewer, isApprover } = useRole();
  const { signOut } = useClerk();

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

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.firstName || "User"}!
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            Current System Role: 
            <Badge variant="secondary" className="font-semibold text-sm">
              {role || "CUSTOMER"}
            </Badge>
          </div>
        </div>

        {/* 3-Column Grid of Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Applicant Card */}
          <a href="/apply" className="block outline-none h-full">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-primary/20 bg-white">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <FilePlus className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>New Application</CardTitle>
                <CardDescription>Apply for a new trade license or permit.</CardDescription>
              </CardHeader>
            </Card>
          </a>

          {/* Reviewer Card */}
          <a 
            href={isReviewer || isApprover ? "/review" : "#"} 
            className={`block outline-none h-full ${!isReviewer && !isApprover ? 'opacity-50 grayscale pointer-events-none' : ''}`}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full bg-white relative overflow-hidden">
              {(!isReviewer && !isApprover) && (
                <div className="absolute top-4 right-4">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
              )}
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <SearchCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle>Review Queue</CardTitle>
                <CardDescription>Technical verification of pending requests.</CardDescription>
              </CardHeader>
            </Card>
          </a>

          {/* Approver Card */}
          <a 
            href={isApprover ? "/approve" : "#"} 
            className={`block outline-none h-full ${!isApprover ? 'opacity-50 grayscale pointer-events-none' : ''}`}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full bg-white relative overflow-hidden">
              {!isApprover && (
                <div className="absolute top-4 right-4">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
              )}
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>Final Authorization</CardTitle>
                <CardDescription>Legal sign-off and license issuance.</CardDescription>
              </CardHeader>
            </Card>
          </a>

        </div>
      </main>
    </div>
  );
}
