import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

export interface Attachment {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl?: string; // Sometimes provided directly
}

export interface PendingReview {
  id: string;
  applicantId: string;
  licenseType: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
}

export const usePendingReviews = () => {
  const api = useApi();
  return useQuery({
    queryKey: ["pendingReviews"],
    queryFn: async () => {
      const response = await api.get("/review/pending");
      return (response.data?.data || response.data || []) as PendingReview[];
    },
  });
};

export const useReviewAction = (applicationId: string) => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ action, comment }: { action: "ACCEPT" | "REJECT" | "ADJUST"; comment: string }) => {
      const response = await api.put(`/review/${applicationId}/action`, { action, comment });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingReviews"] });
    },
  });
};
