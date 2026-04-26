import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

export interface Attachment {
  id: string;
  documentType: string;
  fileName: string;
}

export interface PendingApproval {
  id: string;
  applicantId: string;
  licenseType: string;
  status: string;
  paymentStatus: string;
  reviewerComment?: string;
  reviewerId?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
}

export const usePendingApprovals = () => {
  const api = useApi();
  return useQuery({
    queryKey: ["pendingApprovals"],
    queryFn: async () => {
      const response = await api.get("/approval/pending");
      return (response.data?.data || response.data || []) as PendingApproval[];
    },
  });
};

export const useApprovalAction = (applicationId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ action, comment }: { action: "APPROVE" | "REJECT" | "REREVIEW"; comment: string }) => {
      const response = await api.put(`/approval/${applicationId}/action`, { action, comment });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
    },
  });
};
