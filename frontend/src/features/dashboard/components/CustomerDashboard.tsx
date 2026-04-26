import { useUser } from "@clerk/clerk-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, FileText, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useDashboardAnalytics } from "../api";
import { useCustomerApplications } from "../../applications/api";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomerDashboard() {
  const { user } = useUser();
  const { data: stats, isLoading: isStatsLoading } = useDashboardAnalytics();
  const { data: recentApps, isLoading: isAppsLoading } = useCustomerApplications();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.firstName || "Applicant"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your trade licenses and permit applications here.
          </p>
        </div>
        <Link to="/apply">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-md">
            <FilePlus className="w-5 h-5 mr-2" /> Start New Application
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Applications</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? <Skeleton className="h-8 w-12 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.active || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Pending review or adjustment</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? <Skeleton className="h-8 w-12 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.drafts || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Unsubmitted applications</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Approved Licenses</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isStatsLoading ? <Skeleton className="h-8 w-12 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.approved || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Valid and issued</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Recent Applications Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Status of your most recent submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-slate-50/50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-md">Application ID</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Date Submitted</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-md">Status</th>
                </tr>
              </thead>
              <tbody>
                {isAppsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-4 flex justify-end"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    </tr>
                  ))
                ) : recentApps?.length === 0 ? (
                   <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">
                      No applications found. Start your first application above!
                    </td>
                  </tr>
                ) : (
                  (recentApps || []).slice(0, 5).map((app: any) => (
                    <tr key={app.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-600 truncate max-w-[120px]">{app.id}</td>
                      <td className="px-4 py-3 font-medium">{app.licenseType}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant={app.status === 'APPROVED' ? 'default' : app.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                          {app.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
