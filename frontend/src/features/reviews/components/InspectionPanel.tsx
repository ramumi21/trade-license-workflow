import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type PendingReview, useReviewAction } from "../api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import { FileText, Download } from "lucide-react";

interface InspectionPanelProps {
  application: PendingReview | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InspectionPanel({ application, isOpen, onClose }: InspectionPanelProps) {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  // Provide a fallback empty string for id to avoid invalid queries
  const reviewAction = useReviewAction(application?.id || "");
  const api = useApi();

  const handleAction = async (action: "ACCEPT" | "REJECT" | "ADJUST") => {
    if (!application) return;
    try {
      await reviewAction.mutateAsync({ action, comment });
      toast({ title: "Success", description: `Application ${action.toLowerCase()}ed successfully.` });
      setComment(""); // Reset comment
      onClose();      // Close panel on success
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to process action", variant: "destructive" });
    }
  };

  const downloadFile = async (fileName: string) => {
    try {
      // Fetch securely using the API Interceptor to attach Clerk Bearer token
      const response = await api.get(`/files/${fileName}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({ title: "Document Unavailable", description: "Could not download the requested document. It may have been deleted or the path is invalid.", variant: "destructive" });
    }
  };

  if (!application) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Application Inspection</SheetTitle>
          <SheetDescription>
            ID: <span className="font-mono">{application.id}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
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
                <div>
                  <Badge variant={application.paymentStatus === "PAID" ? "default" : "destructive"}>
                    {application.paymentStatus || "UNPAID"}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-1">Submitted On:</span>
                <p className="font-medium">{new Date(application.createdAt).toLocaleString()}</p>
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
            <h3 className="text-sm font-semibold text-muted-foreground uppercase">Reviewer Action</h3>
            <Textarea 
              placeholder="Add your review comment here (Optional)..." 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <div className="grid grid-cols-3 gap-2">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white" 
                onClick={() => handleAction("ACCEPT")}
                disabled={reviewAction.isPending}
              >
                Accept
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleAction("REJECT")}
                disabled={reviewAction.isPending}
              >
                Reject
              </Button>
              <Button 
                variant="outline" 
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                onClick={() => handleAction("ADJUST")}
                disabled={reviewAction.isPending}
              >
                Adjust
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
