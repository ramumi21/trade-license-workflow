import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type PendingApproval, useApprovalAction } from "../api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import { FileText, Download, UserCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface ApprovalPanelProps {
  application: PendingApproval | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApprovalPanel({ application, isOpen, onClose }: ApprovalPanelProps) {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const approvalAction = useApprovalAction(application?.id || "");
  const api = useApi();

  const handleAction = async (action: "APPROVE" | "REJECT" | "REREVIEW") => {
    if (!application) return;
    try {
      await approvalAction.mutateAsync({ action, comment });
      
      if (action === "APPROVE") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#22c55e", "#16a34a", "#4ade80"] // Green success colors
        });
        toast({ title: "License Granted!", description: `Application successfully approved.`, className: "bg-green-50 border-green-200" });
      } else {
        toast({ title: "Success", description: `Application ${action.toLowerCase()}ed successfully.` });
      }

      setComment("");
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to process action", variant: "destructive" });
    }
  };

  const downloadFile = async (fileName: string) => {
    try {
      const response = await api.get(`/files/${fileName}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({ title: "Document Unavailable", description: "Could not download the requested document.", variant: "destructive" });
    }
  };

  if (!application) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Final Authorization</SheetTitle>
          <SheetDescription>
            ID: <span className="font-mono">{application.id}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Reviewer Notes Section - Explicit Audit Trail */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-md space-y-2">
            <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> Technical Verification
            </h3>
            <div className="text-sm text-blue-800">
              <p><span className="font-medium">Reviewer ID:</span> {application.reviewerId || "Unknown System User"}</p>
              <p className="mt-1"><span className="font-medium">Notes:</span> {application.reviewerComment || "No notes provided during verification."}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Application Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">License Type:</span>
                <p className="font-medium">{application.licenseType}</p>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Payment Status:</span>
                <p>
                  <Badge variant={application.paymentStatus === "PAID" ? "default" : "destructive"}>
                    {application.paymentStatus || "UNPAID"}
                  </Badge>
                </p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Attached Documents</h3>
            {application.attachments && application.attachments.length > 0 ? (
              <div className="space-y-2">
                {application.attachments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium">{doc.documentType}</p>
                        <p className="text-xs text-muted-foreground truncate">{doc.fileName}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => downloadFile(doc.fileName)} className="shrink-0">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No documents attached.</p>
            )}
          </div>

          {/* Action Footer */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Authorization Action</h3>
            <Textarea 
              placeholder="Add final authorization notes (Optional)..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <div className="grid grid-cols-3 gap-2">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20" 
                onClick={() => handleAction("APPROVE")}
                disabled={approvalAction.isPending}
              >
                Approve
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleAction("REJECT")}
                disabled={approvalAction.isPending}
              >
                Reject
              </Button>
              <Button 
                variant="outline" 
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                onClick={() => handleAction("REREVIEW")}
                disabled={approvalAction.isPending}
              >
                Rereview
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
