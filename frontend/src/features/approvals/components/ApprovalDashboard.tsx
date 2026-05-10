import { useState } from "react";
import { usePendingApprovals, type PendingApproval } from "../api";
import { ApprovalTable } from "./ApprovalTable";
import { ApprovalPanel } from "./ApprovalPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function ApprovalDashboard() {
  const { data: approvals, isLoading, isError, error } = usePendingApprovals();
  const [selectedApplication, setSelectedApplication] = useState<PendingApproval | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Approver Waiting List</h1>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
          <h2 className="font-semibold mb-1">Failed to load queue</h2>
          <p className="text-sm">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight m-0">Approver Waiting List</h1>
          </div>
          <p className="text-muted-foreground mt-1 ml-12">Final legal authorization for reviewed trade license applications.</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full border border-green-200">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
          </span>
          <span className="text-sm font-semibold">
            {approvals?.length || 0} Awaiting Authorization
          </span>
        </div>
      </div>

      <ApprovalTable 
        data={approvals || []} 
        onRowClick={(application) => setSelectedApplication(application)} 
      />

      <ApprovalPanel 
        application={selectedApplication}
        isOpen={selectedApplication !== null}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  );
}
