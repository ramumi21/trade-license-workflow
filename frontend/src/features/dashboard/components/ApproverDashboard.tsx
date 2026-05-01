import { useUser } from "@clerk/clerk-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, BarChart4, CheckCircle2, XOctagon } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardAnalytics } from "../api";
import { Skeleton } from "@/components/ui/skeleton";

export function ApproverDashboard() {
  const { user } = useUser();
  const { data: stats, isLoading } = useDashboardAnalytics();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Executive Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Final authorization queue and system-wide analytics.
          </p>
        </div>
        <Link to="/approve">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 font-semibold shadow-md">
            <ShieldCheck className="w-5 h-5 mr-2" /> Approver Waiting List
          </Button>
        </Link>
      </div>

      {/* Quick Stats - "Executive Oversight" metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Awaiting Signature</CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.awaitingSignature || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Applications ready for final approval</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Approved (30 Days)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.approvedLast30Days || 0}</div>}
            <p className="text-xs text-muted-foreground mt-1">Total licenses issued this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Rejection Rate</CardTitle>
            <XOctagon className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16 mb-1" /> : <div className="text-2xl font-bold text-slate-900">{stats?.rejectionRate || "0%"}</div>}
            <p className="text-xs text-muted-foreground mt-1">Overall percentage of rejections</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-slate-600" />
            Licenses Issued vs. Rejected (Last Month)
          </CardTitle>
          <CardDescription>Aggregate overview of final authorization decisions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4 min-w-0 min-h-0">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.chartData || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="Issued" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
