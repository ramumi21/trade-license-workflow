import { useUser } from "@clerk/clerk-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchCheck, ListTodo, Activity, Timer, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardAnalytics } from "../api";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewerDashboard() {
  const { user } = useUser();
  const { data: stats, isLoading } = useDashboardAnalytics();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Reviewer Workspace
          </h1>
          <p className="text-muted-foreground mt-1">
            Technical verification queue and daily performance.
          </p>
        </div>
        <Link to="/review">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-md">
            <SearchCheck className="w-5 h-5 mr-2" /> Open Review Queue
          </Button>
        </Link>
      </div>

      {/* Quick Stats - "The Factory" metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Reviews</CardTitle>
            <ListTodo className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.pendingReviews || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Applications awaiting verification</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Processed Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.processedToday || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Total decisions recorded today</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg. Review Time</CardTitle>
            <Timer className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.avgReviewTime || "0m"}</div>}
            <p className="text-xs text-muted-foreground mt-1">Per application (Target: {"<"} 5m)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Log */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Decisions</CardTitle>
            <CardDescription>Your recent technical verification actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "APP-2026-892", action: "Accepted", time: "10 minutes ago" },
                { id: "APP-2026-891", action: "Adjusted", time: "25 minutes ago" },
                { id: "APP-2026-885", action: "Accepted", time: "1 hour ago" },
                { id: "APP-2026-870", action: "Rejected", time: "2 hours ago" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-slate-50 transition-colors rounded-md">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-medium text-slate-700">{log.id}</span>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                  <div className={`text-sm font-semibold ${log.action === 'Accepted' ? 'text-green-600' : log.action === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {log.action}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-sm text-blue-600">
              View Full History <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Verification Guidelines Sidebar */}
        <Card className="bg-slate-50 border-slate-200 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" /> 
              Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 flex-grow">
            <p><strong>1. Document Clarity:</strong> Ensure all attached IDs and certificates are legible and unexpired.</p>
            <p><strong>2. Payment Match:</strong> Verify the payment transaction ID matches the exact required fee for the license type.</p>
            <p><strong>3. Adjustment Requests:</strong> Only request adjustments for correctable minor errors (e.g., blurry photo). Reject fraudulent or entirely invalid applications.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
